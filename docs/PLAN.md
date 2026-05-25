# 実装計画: 投稿フロー + マッチング API 化（Cloudflare 移行）

## Context

現在はモック（`src/data/senpai.ts` 20件ハードコード、`src/lib/similarity.ts` の単純ルールでランキング）で、GitHub Pages 静的書き出し。本採用フェーズに向けて以下を満たす必要がある:

- **先輩からの手紙投稿**を受け付ける（招待リンク制）
- **LLM 一次審査 + 管理者承認** の二段モデレーション
- **embedding ベースのマッチング** をルールスコアと混合し、ユーザの決断テキストに意味的に近い手紙を優先表示
- インフラは Cloudflare Pages + D1 + Vectorize + Workers AI

ユーザ規模は当面 100/月、データ 1000件想定。Workers AI 無料枠で実質ほぼ無料で運用できる前提。

---

## アーキテクチャ方針

### ホスティング
**Cloudflare Pages（静的書き出し維持） + Pages Functions（`functions/` ディレクトリ）**

- 既存の `output: "export"` は維持。フロントは引き続き静的 HTML として配信。
- API は `functions/api/*.ts` に Pages Functions として配置（Workers ランタイム）。
- Next.js SSR 化はしない（移行コスト・破壊変更を避けるため）。
- 動的ルート `/letters/[id]` は **クライアント側 fetch に変更**:
  - 既存 `app/letters/[id]/page.tsx` の `generateStaticParams` を削除し、`app/letters/view/page.tsx` に統合。`/letters/view?id=k01` 形式の query string で受け取り、クライアント側で API から手紙を取得。
  - 既存 `/letters/[id]/LetterView.tsx` のロジックは流用。

### バインディング
- **D1**: `letters`, `invites`, `admin_sessions` テーブル
- **Vectorize**: index `letters-embeddings`（768次元 or モデル依存）
- **Workers AI**: `@cf/baai/bge-m3`（多言語 embedding、日本語OK）+ `@cf/meta/llama-3.1-8b-instruct`（モデレーション用）
- **環境変数**: `ADMIN_PASSWORD_HASH`（SHA-256）、`INVITE_SIGNING_SECRET`

---

## データモデル（D1）

```sql
CREATE TABLE letters (
  id TEXT PRIMARY KEY,                  -- k21, k22... or nanoid
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL,                 -- 'pending_ai' | 'pending_admin' | 'approved' | 'rejected'
  age INTEGER NOT NULL,
  occupation TEXT NOT NULL,
  occupation_category TEXT NOT NULL,
  gender TEXT NOT NULL,                 -- 'f'|'m'|'x'
  chose TEXT NOT NULL,
  didnt_choose TEXT NOT NULL,
  event TEXT NOT NULL,
  afterwards TEXT NOT NULL,
  judgment TEXT NOT NULL,               -- 'good_job' | 'needs_thought'
  body TEXT NOT NULL,
  ai_review_score REAL,
  ai_review_reason TEXT,
  rejection_reason TEXT,
  invite_token TEXT
);
CREATE INDEX idx_letters_status ON letters(status);

CREATE TABLE invites (
  token TEXT PRIMARY KEY,               -- ランダム32文字
  created_at INTEGER NOT NULL,
  used_at INTEGER,
  expires_at INTEGER NOT NULL,
  note TEXT                             -- 「○○さん用」など管理メモ
);

CREATE TABLE admin_sessions (
  token TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
```

Vectorize の各ベクトルは `id = letters.id`、metadata に `{ status, occupation_category, event, age, gender, judgment }` を持たせ、フィルタ可能にしておく。

---

## 投稿フロー（先輩側）

### 1. 招待リンク発行
- 管理者が `/admin/invites` から「メモ」を付けてトークン生成。
- 生成された `https://.../invite/<token>` を Slack 等で当該の先輩に送る。

### 2. 投稿ページ `/invite/[token]`
- 新規ページ。`src/app/compose/page.tsx` の 5ステップ wizard を**ベースに増補**:
  1. 年齢（既存）
  2. 職種（既存）
  3. 性別（既存）
  4. ライフイベント（既存）
  5. 選んだ道（`chose`）/ 選ばなかった道（`didntChoose`） — テキスト2本
  6. 3年後の自分の状態（`afterwards`） — 1〜2行
  7. 当時の自分への手紙本文（`body`） — 複数行、400字目安
  8. 判定（`good_job` / `needs_thought`） — ラジオ

- 送信時に `POST /api/invites/:token/submit` をコール。

### 3. 一次審査（LLM）
`POST /api/invites/:token/submit` の処理内で同期実行:
1. `invites` テーブルでトークン検証（未使用・有効期限内）
2. `letters` に `pending_ai` で INSERT
3. `@cf/meta/llama-3.1-8b-instruct` でモデレーション
   - プロンプト: 「以下の文章に (a) 個人特定情報, (b) 攻撃的・誹謗中傷, (c) 明らかなスパム/無意味, のいずれかが含まれるか JSON で判定せよ」
   - 結果を `ai_review_score`, `ai_review_reason` に保存
4. 合格 → `status='pending_admin'`、不合格 → `status='rejected'`
5. `invites.used_at` を埋める
6. レスポンスは 200 + 「届きました。掲載まで少しお待ちください」表示

### 4. 管理者承認
- `/admin` で管理者ログイン（合言葉 → セッショントークン Cookie）
- `/admin/queue`: `pending_admin` の一覧。各行に内容プレビュー + 「承認」「却下」「修正して承認」
- 承認時:
  1. 本文 + chose + didntChoose を結合して embedding 生成（`@cf/baai/bge-m3`）
  2. Vectorize に upsert（id = letters.id）
  3. `letters.status = 'approved'`
- 却下時: `rejection_reason` を埋めて `status='rejected'`

---

## マッチング API（ユーザ側）

### `GET /api/letters/match?age=&occ=&event=&gender=&theme=`

1. `theme`（決断テキスト）を embedding 化
2. Vectorize の `query()` で `status=approved` フィルタ付き topK=20 を取得
3. 各候補に対し **ハイブリッドスコア** を計算:
   ```
   final = 0.55 * cosineSim
         + 0.20 * ageScore     // 既存 similarity.ts のロジック流用
         + 0.15 * eventScore
         + 0.07 * occScore
         + 0.03 * genderScore
   ```
   重みは調整余地ありだが、embedding を主軸にしつつルールで補正。
4. final 降順で並べ、上位 10件を返す
5. レスポンス形式は既存の `Letter` 型互換 + `score` を付与

### フロント側の差し替え
- `src/app/letters/LettersClient.tsx`: 既存の `rankBySimilarity(user, senpai)` を `fetch('/api/letters/match?...')` に置換。SWR / useEffect で取得し loading 状態を追加。
- `src/lib/similarity.ts` のルールスコア計算は API 側に移植（同一ロジックを `functions/_lib/similarity.ts` に置く）。クライアント側からは削除可能。
- `src/data/senpai.ts` はビルド時 seed として残し、`scripts/seed.ts` で D1 + Vectorize に投入。

---

## 認証

### 招待トークン
- 32文字ランダム文字列（`crypto.getRandomValues`）
- D1 で管理、署名チェック不要（推測困難なシークレットそのもの）
- 有効期限: 発行から 30日

### 管理者
- 単一管理者前提。`ADMIN_PASSWORD_HASH` を環境変数に SHA-256 で保存
- ログイン成功 → `admin_sessions` にトークン INSERT、Cookie に Set
- 各 admin API でセッション検証ミドルウェア

ランディング前の既存パスワードゲート（`PasswordGate.tsx`）はそのまま残す（プレビュー段階のため）。本採用後は別認証に置き換え。

---

## 変更/新規ファイル

### 新規
- `functions/api/invites/[token]/submit.ts` — 投稿受付 + AI モデレーション
- `functions/api/letters/match.ts` — マッチング
- `functions/api/admin/login.ts` — 合言葉検証 + セッション発行
- `functions/api/admin/invites/index.ts` — 招待トークン発行（POST）/ 一覧（GET）
- `functions/api/admin/queue.ts` — 承認待ち一覧
- `functions/api/admin/letters/[id].ts` — 承認/却下
- `functions/_lib/db.ts` — D1 ヘルパー
- `functions/_lib/embedding.ts` — Workers AI embedding ラッパー
- `functions/_lib/similarity.ts` — 既存ロジック移植 + ハイブリッドスコア
- `functions/_lib/auth.ts` — 管理者セッション検証
- `functions/_lib/moderation.ts` — LLM プロンプト + パース
- `src/app/invite/[token]/page.tsx` + `InviteForm.tsx` — 投稿フォーム（compose の wizard を流用・拡張）
- `src/app/admin/page.tsx` — ログイン
- `src/app/admin/queue/page.tsx` — 承認キュー UI
- `src/app/admin/invites/page.tsx` — 招待発行 UI
- `src/app/letters/view/page.tsx` + `LetterView.tsx`（移動） — 動的ルートのクライアント版
- `migrations/0001_init.sql` — D1 スキーマ
- `scripts/seed.ts` — `senpai.ts` の20件を D1+Vectorize に投入する CLI
- `wrangler.toml` — Pages bindings 設定

### 修正
- `src/app/letters/LettersClient.tsx` — fetch ベースに変更、loading 状態追加
- `src/app/letters/[id]/page.tsx`, `LetterView.tsx` — 削除 or `/letters/view` へ統合
- `next.config.ts` — 変更なし（`output: "export"` 維持）。デプロイ先を GitHub Pages → Cloudflare Pages へ
- `package.json` — `wrangler`, `@cloudflare/workers-types` を devDependencies に追加

### 削除候補
- `.github/workflows/deploy.yml` — Cloudflare Pages の Git 連携に置き換え
- `src/lib/similarity.ts` — Functions 側に移したのち削除

---

## マイグレーション / 移行手順

1. Cloudflare アカウントで D1 / Vectorize / Pages プロジェクト作成
2. `wrangler d1 migrations apply` でスキーマ投入
3. `npm run seed` で既存20件を D1+Vectorize に投入（status='approved'）
4. Pages プロジェクトに GitHub 連携、`main` push でビルド
5. 既存 GitHub Pages デプロイは停止
6. カスタムドメインがあれば DNS 切替

---

## 検証

### ローカル
- `wrangler pages dev` で Functions + Pages を一緒に起動
- D1 ローカル DB に seed → `/letters/view?id=k01` 表示確認
- `/compose` → `/letters?...` フロー: API 経由でランキング取得を確認
- 仮の招待トークンを D1 に手で INSERT → `/invite/<token>` フォームで投稿
  - DB に `pending_ai` で入り、AI 審査後 `pending_admin` になることを確認
- `/admin` ログイン → 承認 → Vectorize に embedding 入る → `/letters` で実際に上位表示されるか確認

### 本番
- ステージング Pages プロジェクトで上記同様の E2E
- LLM モデレーションの誤検知率を 20件の試験投稿で測定
- Vectorize の query レイテンシが体感可能な水準か（目標 <500ms）

---

## スコープ外（次フェーズ）

- 先輩の継続的フォロー（複数投稿、編集）
- ユーザ向けアカウント（手紙の保存、再訪）
- 通報 / 削除フロー
- reranker 導入（精度不足が見えたら）
- 多言語化
