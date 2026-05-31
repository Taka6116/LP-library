import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// PROGRIT — プログリットが選ばれる理由（ベネフィット）
// ドット模様のピーチ背景の見出し + オレンジ枠の3カード（番号・明朝見出し・本文・リンク・写真）。
const ORANGE = "#e8920c";
const INK = "#1a1a1a";
const MINCHO =
  '"Hiragino Mincho ProN", "Yu Mincho", YuMincho, "Noto Serif JP", serif';

type Seg = { t: string; o?: boolean; br?: boolean };

type Reason = {
  no: string;
  img: string;
  title: Seg[];
  desc: Seg[]; // o:true => オレンジ太字
  note?: string;
};

const REASONS: Reason[] = [
  {
    no: "01",
    img: "/Progrit/img-about01-smp.jpg",
    title: [{ t: "専任のコンサルタント", o: true }, { t: "が学習に徹底伴走" }],
    desc: [
      { t: "採用率0.88%（※）の難関を突破した" },
      { t: "ビジネス英語のプロが、あなた専任のコンサルタント", o: true },
      { t: "として伴走します。英語学習の課題分析・最適な学習プラン設計・日々の進捗サポートまで徹底的にコーチングすることで、" },
      { t: "短期間で最大の学習成果へ導きます。", o: true },
    ],
    note: "※2021年9月~2022年2月の総応募者数に対する採用数より算出",
  },
  {
    no: "02",
    img: "/Progrit/img-about02-smp.jpg",
    title: [{ t: "最も効率的な学習", o: true }, { t: "を提供" }],
    desc: [
      { t: "学習効果を最大化", o: true },
      { t: "するためには、自分の英語力の何が弱点で、何のためにそのトレーニングをやっているのかを意識し、英語力の鍛えるべき能力に対して最適な学習方法を実践することがとても重要です。あなたの弱点や目標から、" },
      { t: "最適な学習方法・時間を特定。膨大な学習データ", o: true },
      { t: "を基に、" },
      { t: "科学と実践データ", o: true },
      { t: "の両面から" },
      { t: "専用のカリキュラムを作成します。", o: true },
    ],
  },
  {
    no: "03",
    img: "/Progrit/img-about03-smp.jpg",
    title: [
      { t: "緻密な計画と実績管理で" },
      { t: "", br: true },
      { t: "学習時間を最大化", o: true },
    ],
    desc: [
      { t: "どんなに良いカリキュラムがあっても、しっかりと日々の学習を実践しなければ意味がありません。徹底的な" },
      { t: "「計画と実績管理」で、毎日3時間", o: true },
      { t: "の学習をします。忙しい日々の中で" },
      { t: "学習時間を最大化", o: true },
      { t: "するために、生活習慣から見直し、学習スケジュールを作成します。" },
    ],
  },
];

function Segments({ segs, bold }: { segs: Seg[]; bold?: boolean }) {
  return (
    <>
      {segs.map((s, i) =>
        s.br ? (
          <br key={i} />
        ) : (
          <span
            key={i}
            style={s.o ? { color: ORANGE } : undefined}
            className={s.o && bold ? "font-bold" : undefined}
          >
            {s.t}
          </span>
        ),
      )}
    </>
  );
}

function MoreLink({ card }: { card: boolean }) {
  return (
    <span className={`inline-flex items-center font-bold ${card ? "gap-1 text-[7px]" : "gap-2 text-sm"}`} style={{ color: INK }}>
      詳しく見る
      <span
        className={`inline-flex items-center justify-center rounded-full text-white ${card ? "h-3 w-3 text-[7px]" : "h-6 w-6 text-sm"}`}
        style={{ background: ORANGE }}
        aria-hidden
      >
        ›
      </span>
    </span>
  );
}

export function BenefitProgritReasons({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  const dots =
    "radial-gradient(rgba(232,146,12,0.18) 1.4px, transparent 1.4px)";

  return (
    <section className="w-full bg-white font-sans" style={{ color: "#333" }}>
      {/* 見出し（ドット模様のピーチ背景） */}
      <div
        className={`relative ${card ? "px-4 pt-5 pb-3" : "px-6 pt-16 pb-10 sm:px-10"}`}
        style={{
          background:
            "linear-gradient(180deg, #fde9d6 0%, #fdf3ea 55%, #ffffff 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: dots, backgroundSize: card ? "8px 8px" : "16px 16px" }}
        />
        <div className="relative mx-auto w-full max-w-6xl">
          <p
            className={`flex items-center gap-2 font-bold tracking-[0.12em] ${card ? "text-[7px]" : "text-sm"}`}
            style={{ color: ORANGE }}
          >
            <span className={`inline-block rounded-full ${card ? "h-1 w-1" : "h-2 w-2"}`} style={{ background: ORANGE }} />
            What is PROGRIT
          </p>
          <h2
            className={`font-bold tracking-wide ${card ? "mt-1 text-base" : "mt-3 text-4xl sm:text-5xl"}`}
            style={{ color: INK, fontFamily: MINCHO }}
          >
            プログリットが選ばれる理由
          </h2>
        </div>
      </div>

      {/* 3カード */}
      <div className={`mx-auto w-full max-w-6xl ${card ? "space-y-2 px-4 py-3" : "space-y-8 px-6 py-10 sm:px-10"}`}>
        {REASONS.map((r) => (
          <article
            key={r.no}
            className={`rounded-xl border bg-white shadow-[0_6px_22px_rgba(0,0,0,0.06)] ${card ? "p-2" : "p-6 sm:p-9"}`}
            style={{ borderColor: "#e8b96a" }}
          >
            <div className={`grid items-center ${card ? "grid-cols-[1.3fr_1fr] gap-2" : "gap-7 lg:grid-cols-[1.25fr_1fr]"}`}>
              {/* テキスト */}
              <div className={`grid grid-cols-[auto_1fr] ${card ? "gap-1.5" : "gap-4 sm:gap-6"}`}>
                <span
                  className={`font-black leading-none ${card ? "text-base" : "text-5xl sm:text-6xl"}`}
                  style={{ color: ORANGE, fontFamily: MINCHO }}
                >
                  {r.no}
                </span>
                <div>
                  <h3
                    className={`font-bold leading-snug ${card ? "text-[8px]" : "text-2xl sm:text-[1.7rem]"}`}
                    style={{ color: INK, fontFamily: MINCHO }}
                  >
                    <Segments segs={r.title} />
                  </h3>
                  {!card && (
                    <p className="mt-4 text-sm leading-loose sm:text-[15px]" style={{ color: "#333" }}>
                      <Segments segs={r.desc} bold />
                    </p>
                  )}
                  {!card && r.note && (
                    <p className="mt-3 text-xs text-slate-400">{r.note}</p>
                  )}
                  <div className={card ? "mt-1" : "mt-6"}>
                    <MoreLink card={card} />
                  </div>
                </div>
              </div>

              {/* 写真 */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(r.img)}
                  alt=""
                  aria-hidden
                  className={`w-full object-cover ${card ? "h-12 rounded" : "h-56 rounded-md sm:h-64"}`}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
