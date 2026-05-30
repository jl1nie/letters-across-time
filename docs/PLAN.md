# 「ふ、と」実装計画

## コンセプト

> 3年前のあなたから届く、人生のバトン

キャリアや生き方に悩む30代が、少し先を歩く誰かの経験と出会い、焦りではなく納得から自分の人生を選び直すための**経験循環型アプリ**。

答えを教えるものではない。「選んだ人」だけでなく「選ばなかった人」の経験にも出会い、自分の選択肢を広げるためのサービス。

**経験の循環**:
> 受け取った人が、いつか渡す人になる

バトンを受け取ることで、自らの経験を次の誰かに残す動機が生まれる。

---

## Phase 1: インフラ基盤 + 先輩投稿フロー（Cloudflare 移行）

現在はモック（`src/data/senpai.ts` 20件ハードコード、`src/lib/similarity.ts` の単純ルールでランキング）で、GitHub Pages 静的書き出し。本採用フェーズに向けて以下を満たす必要がある:

- **先輩からの手紙投稿**を受け付ける（招待リンク制）
- **LLM 一次審査 + 管理者承認** の二段モデレーション
- **embedding ベースのマッチング** をルールスコアと混合し、ユーザの決断テキストに意味的に近い手紙を優先表示
- インフラは Cloudflare Pages + D1 + Vectorize + Workers AI

ユーザ規模は当面 100/月、データ 1000件想定。Workers AI 無料枠で実質ほぼ無料で運用できる前提。

### アーキテクチャ方針

**Cloudflare Pages（静的書き出し維持） + Pages Functions（`functions/` ディレクトリ）**

- 既存の `output: "export"` は維持。フロントは引き続き静的 HTML として配信。
- API は `functions/api/*.ts` に Pages Functions として配置（Workers ランタイム）。
- Next.js SSR 化はしない（移行コスト・破壊変更を避けるため）。
- 動的ルート `/letters/[id]` は **クライアント側 fetch に変更**:
  - 既存 `app/letters/[id]/page.tsx` の `generateStaticParams` を削除し、`app/letters/view/page.tsx` に統合。`/letters/view?id=k01` 形式の query string で受け取り、クライアント側で API から手紙を取得。

### バインディング
- **D1**: `letters`, `invites`, `admin_sessions` テーブル
- **Vectorize**: index `letters-embeddings`（768次元 or モデル依存）
- **Workers AI**: `@cf/baai/bge-m3`（多言語 embedding、日本語OK）+ `@cf/meta/llama-3.1-8b-instruct`（モデレーション用）
- **環境変数**: `ADMIN_PASSWORD_HASH`（SHA-256）、`INVITE_SIGNING_SECRET`

### データモデル（D1）

```sql
CREATE TABLE letters (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL,                 -- 'pending_ai' | 'pending_admin' | 'approved' | 'rejected'
  age INTEGER NOT NULL,
  occupation TEXT NOT NULL,
  occupation_category TEXT NOT NULL,
  gender TEXT NOT NULL,
  chose TEXT NOT NULL,
  didnt_choose TEXT NOT NULL,
  event TEXT NOT NULL,
  afterwards TEXT NOT NULL,
  judgment TEXT NOT NULL,               -- 'good_job' | 'needs_thought'
  body TEXT NOT NULL,
  ai_review_score REAL,
  ai_review_reason TEXT,
  rejection_reason TEXT,
  invite_token TEXT,
  baton_origin_id TEXT                  -- どのバトンから生まれた手紙か（Phase 3）
);

CREATE TABLE invites (
  token TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  used_at INTEGER,
  expires_at INTEGER NOT NULL,
  note TEXT,
  -- バトン用フィールド
  from_letter_id TEXT,                  -- バトンを発行した先輩の手紙ID
  baton_message TEXT,                   -- 先輩からの一言
  dialogue_id TEXT                      -- きっかけになった対話ID（Phase 2）
);

CREATE TABLE admin_sessions (
  token TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
```

### 投稿フロー（先輩側）

1. **招待リンク発行** — `/admin/invites` からトークン生成
2. **投稿ページ `/invite/[token]`** — `src/app/compose/page.tsx` の wizard をベースに:
   - chose（選んだ道）/ didntChoose（選ばなかった道）
   - afterwards（その後の状態）
   - body（手紙本文、400字目安）
   - judgment（good_job / needs_thought）
3. **LLM 一次審査** — `@cf/meta/llama-3.1-8b-instruct` で PII・攻撃的内容チェック
4. **管理者承認** — `/admin/queue` で承認時に embedding 生成 + Vectorize upsert

### マッチング API（ユーザ側）

`GET /api/letters/match?age=&occ=&event=&gender=&theme=`

```
final = 0.55 * cosineSim
      + 0.20 * ageScore
      + 0.15 * eventScore
      + 0.07 * occScore
      + 0.03 * genderScore
```

---

## Phase 2: 対話 + バトン（モック実装済み → 将来 D1 化）

### 実装済み（モック）

- **手紙詳細ページの対話リクエストフォーム** (`src/app/letters/[id]/LetterView.tsx`)
  - 手紙を読んだ後「この方と話してみる」ボタン
  - 状況入力 → 送信（モック: UI のみ、実際には送信しない）
- **バトン受け取りページ** (`src/app/baton/page.tsx`)
  - URL: `/baton?from=k01&message=...`
  - バトン＝「この方と話してもよい」という**紹介**として提示する
    （以前の「経験を残す＝投稿へ誘導」から方針変更）
  - 演出は2系統を `src/lib/flags.ts` で切り替え可能:
    - `classic`  … 静かな手紙ベースの受け取り画面
    - `ceremony` … 「人生のバトンを丁寧に受け取る」儀式体験（既定）
      - スマホ前提・手で受け取る感覚（`BatonCeremony.tsx`）
      - 包みをタップ → 中から手紙がふわっと立ち上がる
      - 「かさかさ」の紙摩擦音を Web Audio で合成（`usePaperRustle.ts`）
      - オフホワイトの柔らかい色味・丸みのあるフォント・ゆっくりした動き
  - 切り替え: 環境変数 `NEXT_PUBLIC_BATON_EXPERIENCE=classic|ceremony`、
    または URL の `?experience=classic|ceremony`
  - CTA は「この方と話してみる」（紹介された先輩との対話へ）
- **コンポーズページのバトンコンテキスト** (`src/app/compose/page.tsx`)
  - `?baton=k01` があれば冒頭に発行元先輩の情報を表示

### D1 化（Phase 2 本番）

```sql
CREATE TABLE dialogue_requests (
  id TEXT PRIMARY KEY,
  letter_id TEXT NOT NULL REFERENCES letters(id),
  user_situation TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL             -- 'pending' | 'accepted' | 'completed'
);
```

追加 API:
- `POST /api/letters/:id/dialogue` — 対話リクエスト受付
- `GET /api/admin/dialogues` — 対話一覧
- `POST /api/admin/dialogues/:id/baton` — バトン発行（invites に from_letter_id + baton_message 付きで INSERT）

追加 Admin UI:
- `/admin/dialogues` — 対話管理・バトン発行

---

## Phase 3: 経験の循環

**コンセプト**: バトンを受け取った人が、自分の選択の結果が見えてきたとき（いつでも）に、自らの経験を手紙として残す。

> あの選択の先が、少しずつ見えてきたとき。その経験を、次の誰かへ。

### 実装要素

- `letters.baton_origin_id` — バトンから生まれた手紙の連鎖を記録
- 承認時に「この手紙はバトンで生まれました」表示（オプション）
- 管理者が手紙承認後、書いた人へ「次の誰かにバトンを渡せます」通知
- `ConnectionGraph.tsx` を拡張してバトン連鎖を可視化（将来）

---

## スコープ外（次フェーズ）

- 先輩の継続的フォロー（複数投稿、編集）
- ユーザ向けアカウント（手紙の保存、再訪）
- 通報 / 削除フロー
- reranker 導入（精度不足が見えたら）
- 多言語化
