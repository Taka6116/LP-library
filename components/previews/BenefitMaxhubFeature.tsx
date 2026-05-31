import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// MAXHUB（オフィスコム）— FEATURE / だから選ばれる！MAXHUBの特徴
// 大きなゴールドの「FEATURE」見出し + 3つの特徴を左右交互（ジグザグ）に配置。
// 斜めのオリーブ装飾・ゴールドのアウトライン数字・グレーパネルが特徴。
const GOLD = "#b3a14e";
const OLIVE = "#8a803f";
const INK = "#333333";

type Feature = {
  no: string;
  title: string;
  desc: string;
  img: string;
};

const FEATURES: Feature[] = [
  {
    no: "01",
    title: "電源を入れるだけ、\nすぐに会議をスタート可能",
    desc: "カメラやマイクなど他の機器の準備や設定、煩雑な接続ケーブルは不要で会議準備の時間を大幅に短縮。大型タッチパネルモニターに高品質なカメラ、マイク、スピーカー、Windows OSを搭載。会議に必要な機能をすべてが揃っています。",
    img: "/officecom/img_feature01.jpg",
  },
  {
    no: "02",
    title: "対面時のような場の雰囲気で、\n遠隔地との意思疎通をスムーズに",
    desc: "高性能のマイクとカメラで、遠隔地でも対面のようなミーティングの雰囲気が作れ円滑なコミュニケーションができます。チーム全員の一体感とチームワークの促進につながります。",
    img: "/officecom/img_feature02.jpg",
  },
  {
    no: "03",
    title: "遠隔地との共同作業で、\n会議の生産性を向上",
    desc: "遠隔地のMAXHUBと通信するとWEB上での資料共有は勿論のこと、資料自体に双方からの書き込みが可能です。遠隔地との活発なコミュニケーションを誘発し、会議の質を高めてくれます。",
    img: "/officecom/img_feature03.jpg",
  },
];

/** 「/ FEATURE 0X」の見出しブロック */
function FeatureLabel({ no, card }: { no: string; card: boolean }) {
  return (
    <div className={`flex items-center ${card ? "gap-1.5" : "gap-4"}`}>
      <span
        className={`font-black italic leading-none text-black ${card ? "text-lg" : "text-5xl"}`}
      >
        /
      </span>
      <span
        className={`font-bold tracking-[0.2em] ${card ? "text-[7px]" : "text-sm"}`}
        style={{ color: OLIVE }}
      >
        FEATURE
      </span>
      <span
        className={`font-black leading-none ${card ? "text-2xl" : "text-7xl"}`}
        style={{
          color: "transparent",
          WebkitTextStroke: `${card ? 1 : 2}px ${GOLD}`,
        }}
      >
        {no}
      </span>
    </div>
  );
}

function FeatureImage({ src, card }: { src: string; card: boolean }) {
  return (
    <div className="relative">
      {/* 斜めのオリーブ装飾 */}
      <div
        aria-hidden
        className={`absolute -bottom-3 -left-3 ${card ? "h-6 w-20" : "h-20 w-56"}`}
        style={{
          background: OLIVE,
          clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(src)}
        alt=""
        aria-hidden
        className={`relative w-full rounded-md object-cover shadow-[0_15px_30px_rgba(0,0,0,0.18)]`}
      />
    </div>
  );
}

export function BenefitMaxhubFeature({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full overflow-hidden bg-white font-sans ${card ? "px-4 py-6" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{ color: INK }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* セクション見出し */}
        <div className="text-center">
          <h2
            className={`font-black leading-none tracking-tight ${card ? "text-3xl" : "text-7xl sm:text-8xl"}`}
            style={{ color: GOLD }}
          >
            FEATURE
          </h2>
          <p
            className={`font-bold ${card ? "mt-1 text-xs" : "mt-3 text-2xl sm:text-3xl"}`}
            style={{ color: INK }}
          >
            だから選ばれる！MAXHUBの特徴
          </p>
        </div>

        {/* 特徴（左右交互） */}
        <div className={card ? "mt-4 space-y-3" : "mt-14 space-y-16 sm:space-y-24"}>
          {FEATURES.map((f, i) => {
            const imageRight = i % 2 === 0; // 01,03: 画像右 / 02: 画像左
            return (
              <div
                key={f.no}
                className={`relative grid items-center ${
                  card ? "grid-cols-2 gap-2" : "gap-8 lg:grid-cols-2 lg:gap-12"
                }`}
              >
                {/* テキスト側の背景パネル */}
                <div
                  aria-hidden
                  className={`absolute inset-y-0 hidden bg-[#f4f4f4] lg:block ${
                    imageRight ? "left-[-3rem] right-1/3" : "left-1/3 right-[-3rem]"
                  }`}
                />

                {/* テキスト */}
                <div
                  className={`relative ${imageRight ? "lg:order-1" : "lg:order-2"} ${
                    card ? "" : "py-8"
                  }`}
                >
                  <FeatureLabel no={f.no} card={card} />
                  <h3
                    className={`whitespace-pre-line font-bold leading-snug ${
                      card ? "mt-1 text-[10px]" : "mt-5 text-2xl sm:text-3xl"
                    }`}
                    style={{ color: INK }}
                  >
                    {f.title}
                  </h3>
                  {!card && (
                    <p className="mt-5 text-sm leading-loose text-slate-500 sm:text-base">
                      {f.desc}
                    </p>
                  )}
                </div>

                {/* 画像 */}
                <div className={`relative ${imageRight ? "lg:order-2" : "lg:order-1"}`}>
                  <FeatureImage src={f.img} card={card} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
