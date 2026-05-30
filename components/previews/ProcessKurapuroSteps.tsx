import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// クラプロ — 申込からサービスのご利用まで 4 STEP
// 赤い吹き出しタイトル + グレーのステップカード4枚（黒のSTEPピル + イラスト + 説明）。
const RED = "#dd0000";
const INK = "#2b2b2b";

const STEPS = [
  {
    no: "STEP1",
    title: "WEB申込・電話申込",
    img: "/kurapuro/step1.png",
    desc: "PC/スマホで\n簡単申込",
  },
  {
    no: "STEP2",
    title: "ヒアリング",
    img: "/kurapuro/step2.png",
    desc: "貴社のビジネスモデルを\n詳細にヒアリング",
  },
  {
    no: "STEP3",
    title: "マーケティング施策立案",
    img: "/kurapuro/step3.png",
    desc: "貴社のビジネスモデルに適切\nなマーケティング施策を立案",
  },
  {
    no: "STEP4",
    title: "マーケティング施工実行",
    img: "/kurapuro/step4.png",
    desc: "様々な分野のプロ集団\nによる施策実行",
  },
];

export function ProcessKurapuroSteps({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full bg-white font-sans ${card ? "px-4 py-6" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{ color: INK }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* 赤い吹き出しタイトル */}
        <div className={`relative mx-auto ${card ? "max-w-[260px]" : "max-w-2xl"}`}>
          <div
            className={`rounded-full text-center font-bold text-white ${
              card ? "px-4 py-2 text-xs" : "px-8 py-5 text-2xl sm:text-3xl"
            }`}
            style={{ background: RED }}
          >
            申込からサービスの ご利用まで{" "}
            <span className={card ? "text-base" : "text-4xl"}>4</span> STEP！
          </div>
          {/* 吹き出しの三角 */}
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "100%",
              width: 0,
              height: 0,
              borderLeft: `${card ? 8 : 14}px solid transparent`,
              borderRight: `${card ? 8 : 14}px solid transparent`,
              borderTop: `${card ? 10 : 18}px solid ${RED}`,
            }}
          />
        </div>

        {/* ステップカード */}
        <div
          className={`grid grid-cols-4 ${card ? "mt-5 gap-1.5" : "mt-12 gap-4"}`}
        >
          {STEPS.map((s) => (
            <div
              key={s.no}
              className={`flex flex-col items-center rounded-2xl bg-[#f4f4f4] ${
                card ? "px-1 py-2" : "px-3 py-6"
              }`}
            >
              {/* 黒いSTEPピル */}
              <span
                className={`w-full rounded-full bg-[#2e2e2e] text-center font-bold text-white ${
                  card ? "py-1 text-[8px]" : "py-2.5 text-base"
                }`}
              >
                {s.no}
              </span>

              {/* タイトル */}
              <p
                className={`text-center font-bold leading-tight ${
                  card ? "mt-1.5 text-[8px]" : "mt-5 text-base sm:text-lg"
                }`}
                style={{ color: INK }}
              >
                {s.title}
              </p>

              {/* イラスト */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(s.img)}
                alt={s.title}
                className={`w-auto object-contain ${card ? "my-1.5 h-8" : "my-6 h-28"}`}
              />

              {/* 説明 */}
              <p
                className={`whitespace-pre-line text-center leading-snug ${
                  card ? "text-[6.5px]" : "text-sm"
                }`}
                style={{ color: "#555" }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
