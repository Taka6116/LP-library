import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// desknet's NEO — FEATURES / desknet's NEOの特長（興味喚起）
// 3カラム: イラスト + 大きな番号 + 2行タイトル + チェック項目3つ。淡いブルー基調。
const BLUE = "#2b3fa3"; // 番号・チェック
const TITLE = "#1a2456"; // 見出し
const ITEM_BG = "#eef2fb";

type Col = {
  no: string;
  img: string;
  title: string;
  items: string[];
};

const COLS: Col[] = [
  {
    no: "01",
    img: "/desknets/reason_img01.png",
    title: "情報の集約と、業務改善を\n完全ノーコードで実現できる",
    items: [
      "ポータル、スケジュール、申請管理、文書管理など、情報共有に必要な機能をすべて搭載",
      "現場がノンプログラミングで、紙・Excel・メール業務の効率化を行える。",
      "ビジネスチャットを含めたコミュニケーション基盤を作ることができる（プレミアムプラン）",
    ],
  },
  {
    no: "02",
    img: "/desknets/reason_img02.png",
    title: "ユーザーの活用が進みやすく、\n高い効果を生むことができる",
    items: [
      "必要な機能が揃っているから、すぐに使い始められる。個人・組織に合わせたカスタマイズ機能も充実",
      "日本企業向けの設計で誰もが使いやすいから、ユーザー・管理者の負担が少なく活用が進む",
      "1on1の無料活用相談、解説動画、アプリ作成代行など、活用支援が充実",
    ],
  },
  {
    no: "03",
    img: "/desknets/reason_img03.png",
    title: "豊富な実績と多様な環境への対応で\n安心して使い続けられる",
    items: [
      "25年以上の提供実績と、540万ユーザー以上の導入実績。",
      "クラウド・オンプレミス両対応。過去の情報資産も引き継げるから他社からの乗り換えも安心",
      "24時間365日のサポート、定期的な機能改善で、導入後も安心して使い続けられる",
    ],
  },
];

function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" stroke={BLUE} strokeWidth="1.6" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke={BLUE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HookDesknetsFeatures({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full bg-gradient-to-b from-white to-[#eef3fc] font-sans ${
        card ? "px-4 py-6" : "px-6 py-16 sm:px-10 sm:py-20"
      }`}
      style={{ color: "#333" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* 見出し（FEATURES 透かし + タイトル） */}
        <div className="relative text-center">
          <span
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 font-black tracking-wider ${
              card ? "-top-2 text-2xl" : "-top-6 text-7xl sm:text-8xl"
            }`}
            style={{ color: "#dbe4f7" }}
            aria-hidden
          >
            FEATURES
          </span>
          <h2
            className={`relative font-bold ${card ? "text-base" : "text-3xl sm:text-4xl"}`}
            style={{ color: TITLE }}
          >
            desknet&apos;s NEOの特長
          </h2>
        </div>

        {/* 3カラム */}
        <div
          className={`grid grid-cols-3 ${card ? "mt-4 gap-1.5" : "mt-12 gap-5 sm:gap-6"}`}
        >
          {COLS.map((c) => (
            <div
              key={c.no}
              className="flex flex-col items-center rounded-t-2xl bg-gradient-to-b from-[#e9f0fb] to-white"
            >
              {/* イラスト */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(c.img)}
                alt=""
                aria-hidden
                className={`w-auto object-contain ${card ? "mt-2 h-10" : "mt-8 h-28 sm:h-32"}`}
              />

              {/* 番号 */}
              <p
                className={`font-black leading-none ${card ? "mt-1 text-base" : "mt-4 text-5xl"}`}
                style={{ color: BLUE }}
              >
                {c.no}
              </p>

              {/* タイトル */}
              <p
                className={`whitespace-pre-line text-center font-bold leading-snug ${
                  card ? "mt-1 text-[7px]" : "mt-4 text-base sm:text-lg"
                }`}
                style={{ color: TITLE }}
              >
                {c.title}
              </p>

              {/* チェック項目 */}
              <div
                className={`w-full ${card ? "mt-1 space-y-1 px-1.5 pb-2" : "mt-5 space-y-3 px-3 pb-8 sm:px-4"}`}
              >
                {c.items.map((it, i) => (
                  <div
                    key={i}
                    className={`flex items-start rounded-lg ${
                      card ? "gap-1 p-1" : "gap-2 p-3"
                    }`}
                    style={{ background: ITEM_BG }}
                  >
                    {card ? (
                      <span
                        className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: BLUE }}
                      />
                    ) : (
                      <CheckIcon />
                    )}
                    <span
                      className={`leading-relaxed ${card ? "text-[5px]" : "text-xs sm:text-sm"}`}
                      style={{ color: "#444" }}
                    >
                      {it}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
