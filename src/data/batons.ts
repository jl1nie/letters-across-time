export type Baton = {
  token: string;
  fromLetterId: string;
  message: string;
};

export const sampleBatons: Baton[] = [
  {
    token: "demo",
    fromLetterId: "k01",
    message: "悩みが似ている気がして、あなたにこのバトンを渡したいと思いました。",
  },
  {
    token: "demo2",
    fromLetterId: "k05",
    message: "今のあなたには、この人の話がきっとヒントになる気がします。",
  },
];
