# ふ、と（Letters Across Time）

> 3年前のあなたから届く、人生のバトン。

キャリアや生き方の選択に迷う人が、**少し先を歩く誰か**の「選んだ道」と「選ばなかった道」に出会うための、経験循環型サービスのコンセプトモック。

答えを教えるのではなく、選択肢の**余白**に出会う場所を目指しています。「受け取った人が、いつか渡す人になる」——経験が次の誰かへ巡っていくことをコンセプトの核にしています。

> ⚠️ これは**デザイン検証用のモック**です。バックエンドや永続化はなく、手紙データはハードコード、マッチングは単純なルールベース、対話やバトンの送信は UI 上だけの演出です（実際の送信・保存は行いません）。本番想定の設計は [`docs/PLAN.md`](docs/PLAN.md) を参照してください。

---

## 体験の流れ

1. **合言葉ゲート** — 関係者向けに簡易なパスワードで保護（`PasswordGate`）。
2. **問いかけ（`/compose`）** — 5ステップのウィザードで、いまの自分を言葉にする。
   - 年齢 → 分野 → 性別（任意）→ 直面している選択（転職・結婚・出産など）→ いちばん迷っていること
3. **手紙を受け取る（`/letters`）** — 入力に近い「先輩の手紙」がランキング表示される。
4. **手紙を読む（`/letters/[id]`）** — 選んだ道・選ばなかった道・その後、本文を読む。読んだ後に「この方と話してみる」リクエストができる（モック）。
5. **バトンを受け取る（`/baton`）** — 「この方と話してもよい」という**紹介**としてバトンが届く。丁寧に受け取る儀式的な演出を経て、紹介された先輩との対話へ。
6. **経験を残す（`/write`）** — 自分の経験を次の誰かへ手紙として残す（モック）。

## 仕組み（モックの作り）

- **手紙データ**：`src/data/senpai.ts` に先輩の手紙を20件ハードコード（年齢・職種・性別・選択・本文など）。
- **マッチング**：`src/lib/similarity.ts` の単純な加重スコアで並べ替え。
  - `age 0.4 + occupation 0.25 + event 0.25 + gender 0.1`（年齢は10歳差で0点）
  - 本番では embedding ベースの意味的類似度と混合する設計（`docs/PLAN.md`）。
- **バトンのつながり**：`src/data/introductions.ts` で20人が一周する輪を手作業で構成（行き止まりなし）。各先輩が「次に話すといい人」を一言添えて紹介する。サンプルバトンは `src/data/batons.ts`。
- **バトン受け取り演出**：`src/lib/flags.ts` で2系統を切り替え。
  - `ceremony`（既定）… スマホ前提・手で受け取る感覚・紙の「かさかさ」音を Web Audio で合成（`usePaperRustle.ts`）・丸みのある色とフォント
  - `classic` … 静かな手紙ベースの受け取り画面
  - 切り替え：環境変数 `NEXT_PUBLIC_BATON_EXPERIENCE=classic|ceremony`、または URL の `?experience=...`
- **演出全般**：`framer-motion` によるゆっくりしたトランジション、`Typewriter` / `Envelope` / `ConnectionGraph` などの雰囲気重視のコンポーネント。
- **永続化なし**：合言葉の解錠状態のみ `sessionStorage` に保持。対話リクエストやバトン送信は実際には送られない。

## 技術スタック

- **Next.js 16**（App Router）/ **React 19** / **TypeScript**
- **Tailwind CSS v4** / **framer-motion**
- `output: "export"` による静的書き出しで **GitHub Pages** に配信（`next.config.ts`）

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 静的書き出し（out/ に生成）
```

GitHub Pages の project pages で配信する場合は `NEXT_PUBLIC_BASE_PATH` を設定します（例：`/letters-across-time`）。

## ディレクトリ

```
src/
  app/         画面（compose / letters / baton / write など）
  components/  Envelope, Typewriter, ConnectionGraph, PasswordGate ...
  data/        senpai（手紙20件）, introductions（紹介の輪）, batons
  lib/         similarity（マッチング）, flags（演出切替）, parseAgeInput ...
docs/PLAN.md   本番（Cloudflare 移行）の設計・フェーズ計画
```

詳しいロードマップ（先輩投稿フロー、LLM＋管理者の二段モデレーション、embedding マッチング、対話・バトンの D1 化、経験の循環）は [`docs/PLAN.md`](docs/PLAN.md) にあります。
