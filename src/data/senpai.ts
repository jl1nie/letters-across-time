export type Gender = "f" | "m" | "x";
export type LifeEvent =
  | "転職"
  | "結婚"
  | "出産"
  | "独立"
  | "進学"
  | "留学"
  | "その他";

export type Letter = {
  id: string;
  profile: {
    age: number; // 現在の年齢
    occupation: string;
    occupationCategory:
      | "デザイン"
      | "エンジニア"
      | "企画・マーケ"
      | "営業"
      | "経営・起業"
      | "研究・教育"
      | "クリエイティブ"
      | "医療・福祉"
      | "その他";
    gender: Gender;
  };
  decision: {
    chose: string;
    didntChoose: string;
    event: LifeEvent;
  };
  message: {
    afterwards: string;
    judgment: "good_job" | "needs_thought";
    body: string;
  };
};

export const senpai: Letter[] = [
  {
    id: "k01",
    profile: {
      age: 36,
      occupation: "UIデザイナー",
      occupationCategory: "デザイン",
      gender: "f",
    },
    decision: {
      chose: "事業会社への転職",
      didntChoose: "制作会社で昇進する道",
      event: "転職",
    },
    message: {
      afterwards:
        "転職した先で、自分の作ったものが何万人にも使われる経験ができた。",
      judgment: "good_job",
      body:
        "あの面接の前夜、眠れずに過ごしていたあなたへ。\n大丈夫、行って良かったよ。\n慣れない言葉に何度もうなずいたふりをした最初の半年も、ちゃんと血肉になっている。\nひとつだけ。気にしてくれる人の名前を、いまのうちにメモしておいて。\n3年後のわたしは、そのリストに何度も救われている。",
    },
  },
  {
    id: "k02",
    profile: {
      age: 35,
      occupation: "プロダクトマネージャー",
      occupationCategory: "企画・マーケ",
      gender: "m",
    },
    decision: {
      chose: "結婚",
      didntChoose: "海外赴任の打診を受けること",
      event: "結婚",
    },
    message: {
      afterwards:
        "想像していたより、二人で過ごす夜のほうが、ずっと長く続いている。",
      judgment: "good_job",
      body:
        "迷っていた、というより怖がっていたあなたへ。\n選ばなかった海の向こうの仕事は、たぶん別の誰かの人生になった。\nそれでいい。\nあなたが選んだのは「同じ部屋で歳をとる」という静かな約束で、\nそれは三年経ってもまだ、毎晩のように小さく更新されている。",
    },
  },
  {
    id: "k03",
    profile: {
      age: 34,
      occupation: "フロントエンドエンジニア",
      occupationCategory: "エンジニア",
      gender: "f",
    },
    decision: {
      chose: "育休からの時短復帰",
      didntChoose: "退職してフリーランスになる道",
      event: "出産",
    },
    message: {
      afterwards:
        "復帰の三ヶ月は、思っていたよりずっとしんどかった。それでも辞めなくてよかった。",
      judgment: "needs_thought",
      body:
        "「とりあえず戻る」を選んだあなたへ。\n戻ったあとに来る空白の時間を、もう少しだけ覚悟しておいてほしかった。\nプロジェクトから外されたわけじゃないのに、\n自分が中心からそっと外されていく感覚は、想像より重かった。\nでも、半年で景色は変わる。\n泣いた日のことは、たぶん未来のあなたが必要な人に話せるようになる。",
    },
  },
  {
    id: "k04",
    profile: {
      age: 38,
      occupation: "スタートアップ共同創業者",
      occupationCategory: "経営・起業",
      gender: "m",
    },
    decision: {
      chose: "会社を辞めて共同創業",
      didntChoose: "管理職になる道",
      event: "独立",
    },
    message: {
      afterwards:
        "売上はまだ小さい。けれど、朝起きるのが嫌だった頃のことを、もう思い出せない。",
      judgment: "good_job",
      body:
        "辞表を書きかけては消していた春のあなたへ。\nお金の不安は、想像通り全部やってきた。\nそれでも、誰のために働いているのかが\n毎日はっきり見えていることのほうが、ずっと安全だった。\n一つだけ。共同創業者に、半年ごとに「いまどう思ってる?」と聞くこと。\nこれをサボると、三年目に取り返しがつかない。",
    },
  },
  {
    id: "k05",
    profile: {
      age: 33,
      occupation: "コピーライター",
      occupationCategory: "クリエイティブ",
      gender: "f",
    },
    decision: {
      chose: "大学院に入り直す",
      didntChoose: "現職で賞を取りにいく道",
      event: "進学",
    },
    message: {
      afterwards: "書ける言葉の幅が、確かに広くなった。",
      judgment: "good_job",
      body:
        "「いまさら学生?」と笑われそうで、誰にも相談できなかったあなたへ。\n大丈夫、笑った人はあなたの人生を歩かない。\n二年間、自分の文章を一度バラバラにする時間は、\n仕事に戻ってからじわじわ効いてくる。\n焦らないで。学びはあとから請求書が来る。きちんと払えば、ちゃんと返ってくる。",
    },
  },
  {
    id: "k06",
    profile: {
      age: 37,
      occupation: "営業マネージャー",
      occupationCategory: "営業",
      gender: "m",
    },
    decision: {
      chose: "地方支社への異動",
      didntChoose: "本社に残ること",
      event: "転職",
    },
    message: {
      afterwards:
        "東京で見えていた数字より、地方で会えた人の顔のほうが、いまの財産になっている。",
      judgment: "good_job",
      body:
        "「左遷だと思われるかも」と気にしていたあなたへ。\n誰がどう思うかは、結局あなたの三年後を一ミリも変えない。\n変えるのは、その土地で何回ごはんを食べたかと、\n誰の名前を覚えたかだ。\n名刺交換より、二度目の挨拶のほうが大事。これだけ覚えておいて。",
    },
  },
  {
    id: "k07",
    profile: {
      age: 35,
      occupation: "プロダクトデザイナー",
      occupationCategory: "デザイン",
      gender: "x",
    },
    decision: {
      chose: "海外の会社にリモートで転職",
      didntChoose: "国内大手への内定承諾",
      event: "転職",
    },
    message: {
      afterwards: "時差と孤独はずっとある。それでも、毎朝の英語の会議で笑える日が増えた。",
      judgment: "needs_thought",
      body:
        "「英語、なんとかなる」と自分に言い聞かせていたあなたへ。\nなんとかなる。けれど「なんとか」の中身は、\nたぶん想像の三倍くらい孤独だった。\n最初の半年だけ、日本語で愚痴れる人を一人、意識して確保しておいて。\nそれをしなかった私から、お願い。",
    },
  },
  {
    id: "k08",
    profile: {
      age: 34,
      occupation: "公立中学校 教員",
      occupationCategory: "研究・教育",
      gender: "f",
    },
    decision: {
      chose: "学校に残ること",
      didntChoose: "民間の教育系スタートアップへの転職",
      event: "その他",
    },
    message: {
      afterwards:
        "辞めなかったことを、年に一度くらいは後悔する。でも、卒業式の朝はいつも、辞めなくてよかったと思っている。",
      judgment: "needs_thought",
      body:
        "「自分の市場価値が下がっていく気がする」と怯えていたあなたへ。\nその感覚は、たぶん間違っていない。\nでも価値の定規は、世の中に何本もある。\n生徒の三年後を引き受けられる人は、そんなに多くない。\nひとつだけ。学校の外の人に、月に一度は会いに行ってほしい。\nそれをやめた瞬間、定規が一本しかなくなる。",
    },
  },
  {
    id: "k09",
    profile: {
      age: 36,
      occupation: "看護師",
      occupationCategory: "医療・福祉",
      gender: "f",
    },
    decision: {
      chose: "出産後に夜勤を外す働き方",
      didntChoose: "管理職への昇進試験",
      event: "出産",
    },
    message: {
      afterwards:
        "後輩が先に師長になった。それを聞いた夜、思っていたよりずっと、なんでもない気持ちで眠れた。",
      judgment: "good_job",
      body:
        "「キャリアを諦めたことになるんじゃないか」と怖かったあなたへ。\n諦めた、ではなく、いったん預けた、でいい。\n預けた分は、子どもが手を離れたあとに、\n別のかたちでちゃんと戻ってきている。\nそのときの自分が受け取りやすいように、いまのうちに勉強だけは細く続けて。",
    },
  },
  {
    id: "k10",
    profile: {
      age: 39,
      occupation: "リサーチャー",
      occupationCategory: "研究・教育",
      gender: "m",
    },
    decision: {
      chose: "博士課程を満期退学して企業へ",
      didntChoose: "アカデミアに残る道",
      event: "転職",
    },
    message: {
      afterwards:
        "論文の代わりに、世の中に出る製品の中に自分の問いが少しずつ混ざっている。",
      judgment: "needs_thought",
      body:
        "「研究者ではなくなる」ことが怖かったあなたへ。\n肩書きは変わったけれど、問いの立て方は変わらなかった。\nそれだけは持って出ていいんだと、もっと早く気づければ楽だった。\n企業に入ってから「ちゃんとした研究者じゃない」と感じる夜が、\n何度かある。そういう夜のために、\n昔の指導教官に年に一度だけ、近況をメールしておいて。",
    },
  },
  {
    id: "k11",
    profile: {
      age: 31,
      occupation: "Webエンジニア",
      occupationCategory: "エンジニア",
      gender: "m",
    },
    decision: {
      chose: "SIerからスタートアップへの転職",
      didntChoose: "受託で年収を上げる道",
      event: "転職",
    },
    message: {
      afterwards:
        "給料は思ったほど上がっていない。月曜の朝の気分は変わったけれど、口座の数字は変わらない。",
      judgment: "needs_thought",
      body:
        "「もう少し経験を積んでから」と自分に言い訳していたあなたへ。\n結論、いま動いて正解だった。\n知らない技術スタックは、半年あれば馴染む。\n馴染まないのは「指示を待つ癖」のほうだった。\nひとつだけ。最初の三ヶ月で、わからないことを十回聞ける同僚を作っておいて。\nそれをしなかった月の生産性が、いちばん低い。",
    },
  },
  {
    id: "k12",
    profile: {
      age: 30,
      occupation: "グラフィックデザイナー",
      occupationCategory: "デザイン",
      gender: "f",
    },
    decision: {
      chose: "結婚して関西に移住",
      didntChoose: "東京で独立する道",
      event: "結婚",
    },
    message: {
      afterwards:
        "クライアントは半分になった。夕方の散歩は増えたけれど、東京の仕事を断った夜だけは、いまも少しだけ後悔している。",
      judgment: "needs_thought",
      body:
        "「キャリアを途切れさせるのが怖い」と泣いた夜のあなたへ。\n途切れる、ではなく、編み直す、だった。\n知らない街で仕事を取り直す半年は、\n想像通りしんどかったけれど、\n名刺の肩書きより、自分の手の動きを信じられるようになった。\n焦らないで。仕事は、暮らしの後ろからついてくる。",
    },
  },
  {
    id: "k13",
    profile: {
      age: 32,
      occupation: "プロダクトマネージャー",
      occupationCategory: "企画・マーケ",
      gender: "f",
    },
    decision: {
      chose: "第一子の出産と育休",
      didntChoose: "海外MBAへの出願",
      event: "出産",
    },
    message: {
      afterwards:
        "MBAのパンフレットは、いまも本棚にある。捨てないでよかったと、たまに思う。",
      judgment: "needs_thought",
      body:
        "「両方は選べない」と決めつけていたあなたへ。\nたぶん、いまは選べない、が正しい。\n二年経っても三年経っても、選び直すチャンスはちゃんと来る。\nそれまでに、子どもの前で「お母さんは何が好きか」を\n話せるようにしておいて。\nそれが、いちばん近道のキャリア継続だった。",
    },
  },
  {
    id: "k14",
    profile: {
      age: 33,
      occupation: "営業",
      occupationCategory: "営業",
      gender: "m",
    },
    decision: {
      chose: "業界をまたぐ転職",
      didntChoose: "社内の新規事業公募に手を挙げる道",
      event: "転職",
    },
    message: {
      afterwards:
        "前職の知り合いは、半年で半分連絡が取れなくなった。数字が立つまでの一年は、想像よりずっと長かった。",
      judgment: "needs_thought",
      body:
        "「営業のスキルって、業界が変わったら通用するのか」と怯えていたあなたへ。\n通用する、けれど、最初の三ヶ月は通用しないふりをして聞くこと。\n前の業界の話を持ち出した瞬間に、新しい人たちは静かに距離を取る。\nそれだけ気をつければ、半年後にはちゃんと数字が立ち上がる。",
    },
  },
  {
    id: "k15",
    profile: {
      age: 31,
      occupation: "薬剤師",
      occupationCategory: "医療・福祉",
      gender: "f",
    },
    decision: {
      chose: "結婚を機に病院から調剤薬局へ",
      didntChoose: "認定資格を取りに行く道",
      event: "結婚",
    },
    message: {
      afterwards:
        "夜勤がなくなって、夫と同じ時間にごはんを食べる日が増えた。",
      judgment: "good_job",
      body:
        "「ステップダウンに見えるかもしれない」と気にしていたあなたへ。\n誰にどう見えるかは、三年経つと、ほんとうにどうでもよくなる。\n生活が安定したぶん、勉強の時間は逆に増えた。\n資格は、いまの場所からでも、ちゃんと取りに行ける。\n焦らないで、暮らしを先に整えていい。",
    },
  },
  {
    id: "k16",
    profile: {
      age: 32,
      occupation: "スタートアップCTO",
      occupationCategory: "エンジニア",
      gender: "m",
    },
    decision: {
      chose: "大手を辞めて共同創業",
      didntChoose: "テックリードとして残る道",
      event: "独立",
    },
    message: {
      afterwards:
        "コードを書く時間は半分に減った。代わりに、誰と書くかを選べるようになった。",
      judgment: "needs_thought",
      body:
        "「自分は経営なんてできない」と決めつけていたあなたへ。\nできない、は半分本当で、半分は逃げだった。\n採用と資金繰りは、想像の三倍しんどい。\nそれでも、自分が選んだ人と朝会で話せる時間は、\nどの大企業のオフィスにもなかった。\n一つだけ。家族に、月に一度は会社の数字を見せておいて。",
    },
  },
  {
    id: "k17",
    profile: {
      age: 30,
      occupation: "編集者",
      occupationCategory: "クリエイティブ",
      gender: "f",
    },
    decision: {
      chose: "出版社から独立してフリーランス",
      didntChoose: "編集長候補として残る道",
      event: "独立",
    },
    message: {
      afterwards:
        "ひとり仕事の静けさは、想像の倍だった。けれど、誰の本を作るかを自分で決められる。",
      judgment: "needs_thought",
      body:
        "「会社の看板がなくなる怖さ」を一晩中考えていたあなたへ。\n看板がない代わりに、名前で呼ばれる回数は確実に増えた。\nそれは想像より、ずっと支えになる。\n最初の一年は、断る勇気を持って。\n安く請けた仕事は、三年経ってもまだ尾を引いている。",
    },
  },
  {
    id: "k18",
    profile: {
      age: 33,
      occupation: "小学校 教員",
      occupationCategory: "研究・教育",
      gender: "m",
    },
    decision: {
      chose: "産休に入る妻の代わりに育休を取得",
      didntChoose: "学年主任の打診を受ける道",
      event: "出産",
    },
    message: {
      afterwards:
        "復帰した教室で、子どもたちが「先生、赤ちゃん元気?」と聞いてくれる。",
      judgment: "good_job",
      body:
        "「男で育休なんて」と職員室の空気を気にしていたあなたへ。\n気にして当然の空気だった。\nそれでも、半年で空気のほうが変わる。\n「先に取った人」になることは、\n誰かの背中を押せる立場になることだった。\n主任は、また来る。家にいる時間は、いま一度きり。",
    },
  },
  {
    id: "k19",
    profile: {
      age: 31,
      occupation: "マーケター",
      occupationCategory: "企画・マーケ",
      gender: "x",
    },
    decision: {
      chose: "事業会社からエージェンシーへ転職",
      didntChoose: "海外赴任のオファーを受ける道",
      event: "転職",
    },
    message: {
      afterwards:
        "扱うブランドの数は十倍に増えた。深さは、自分で守るしかない。",
      judgment: "needs_thought",
      body:
        "「広く浅くになるのが怖い」と言っていたあなたへ。\n怖かった通り、浅くなる。\n意識して、一つだけ深く触り続けるブランドを決めておいて。\nそれをしなかった同期は、三年で「何の人」かわからなくなった。\nあなたは「何の人」かを、自分で名乗っていい。",
    },
  },
  {
    id: "k20",
    profile: {
      age: 32,
      occupation: "助産師",
      occupationCategory: "医療・福祉",
      gender: "f",
    },
    decision: {
      chose: "総合病院から個人助産院へ転職",
      didntChoose: "管理職コースに乗る道",
      event: "転職",
    },
    message: {
      afterwards:
        "一件ずつに長く関われるようになった。代わりに、夜中に呼ばれる電話の重さが、前より直接になった。",
      judgment: "needs_thought",
      body:
        "「ここで降りたら戻れない」と思い詰めていたあなたへ。\n戻れる。けれど、戻りたいかどうかが変わる。\n小さな現場で、名前で呼ばれて働くことの手応えは、\n大きな病院のシフト表には載っていなかった。\n体力は確実に落ちる。それだけは、いまのうちに対策しておいて。",
    },
  },
];
