import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";
import { asset } from "@/lib/asset";

// 「Sansan活用法」3カラム プロモーション
const COLS = [
  {
    img: "/sansan/img-cta-3col-01.svg",
    title: "名刺をデータ化する",
    desc: "取り込んだ名刺を正確にデータ化し、社内で共有できます。",
  },
  {
    img: "/sansan/img-cta-3col-02.svg",
    title: "人脈を可視化する",
    desc: "誰が・いつ・どの企業と接点を持ったかを一目で把握。",
  },
  {
    img: "/sansan/img-cta-3col-03.svg",
    title: "営業に活かす",
    desc: "蓄積した接点データを次のアプローチにつなげます。",
  },
];

export function SolutionKatsuyoThreeCol({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={card ? "space-y-2" : "space-y-10"}>
        <div className={`text-center ${card ? "space-y-1" : "space-y-3"}`}>
          <div className="flex justify-center">
            <Eyebrow variant={variant}>活用法</Eyebrow>
          </div>
          <Heading variant={variant}>Sansanでできる、3つのこと</Heading>
        </div>

        <div
          className={`grid gap-${card ? "2" : "6"} ${
            card ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {COLS.map((c) => (
            <div
              key={c.title}
              className={`flex flex-col items-center rounded-2xl bg-white text-center shadow-soft transition hover:shadow-cardhover ${
                card ? "p-2" : "p-7"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(c.img)}
                alt=""
                className={card ? "h-12 w-auto" : "h-28 w-auto"}
              />
              <h3
                className={`font-bold text-ink ${
                  card ? "mt-1 text-[10px]" : "mt-5 text-lg"
                }`}
              >
                {c.title}
              </h3>
              {!card && (
                <p className="mt-2 text-sm leading-relaxed text-subtle">
                  {c.desc}
                </p>
              )}
              <span
                className={`font-semibold text-accent ${
                  card ? "mt-1 text-[9px]" : "mt-4 text-sm"
                }`}
              >
                くわしく見る ›
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
