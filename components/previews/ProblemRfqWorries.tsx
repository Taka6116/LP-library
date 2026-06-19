import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// RFQクラウド — 見積査定業務のお悩み解決します
// https://rfqcloud.com/
// 6枚のソリューションカード（イラスト + タイトル + 説明 + もっと詳しく）。
//
// Design tokens:
//   color.text.primary  = #2e3840  本文
//   color.text.tertiary = #2d5ac7  ブルーアクセント（リンク/見出し装飾）
//   color.surface.strong= #e2edff  ライトブルー面
//   shadow.1            = rgba(45,90,199,.11) 0 0 10px
//   radius.xs = 10px / radius.sm = 100px(pill)
//   font: 游ゴシック

const INK = "#2e3840";
const BLUE = "#2d5ac7";
const SOFT = "#e2edff";
const CARD_SHADOW = "rgba(45,90,199,0.11) 0px 0px 10px 0px";

const CARDS = [
  { img: "/RFQ/img03.webp", title: "購買を強くする",            body: "個人のスキル・ノウハウに頼っていた業務を一元管理。組織力強化に活用可能。" },
  { img: "/RFQ/img04.webp", title: "見積データの活用",          body: "共通フォーマットによる見積取得を実現。明細情報DB化による購買分析を支援。" },
  { img: "/RFQ/img05.webp", title: "購買プロセスの「見える化」", body: "過去の交渉履歴や見積依頼状況を集約。購買担当者の業務可視化に貢献。" },
  { img: "/RFQ/img06.webp", title: "価格の妥当性把握",          body: "各社で異なる見積フォーマットを統一。明細比較、類似品比較による妥当性判断。" },
  { img: "/RFQ/img07.webp", title: "見積作業の効率化",          body: "アナログな繰り返し作業を効率化。煩雑なやり取りの一元管理を実現。" },
  { img: "/RFQ/img08.webp", title: "調達レベルの向上",          body: "査定業務の仕組み化とデータ活用にて調達レベルのさらなる向上を支援。" },
];

export function ProblemRfqWorries({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full ${card ? "px-3 py-5" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{
        background: `linear-gradient(180deg, #ffffff 0%, ${SOFT} 100%)`,
        color: INK,
        fontFamily:
          "游ゴシック, 'Yu Gothic', YuGothic, 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
      }}
    >
      <div className={`mx-auto w-full ${card ? "" : "max-w-6xl"}`}>
        {/* ── 見出し ── */}
        <div className={`text-center ${card ? "mb-3" : "mb-10"}`}>
          {/* eyebrow バッジ */}
          <span
            className={`inline-block font-bold ${card ? "text-[6px] mb-1 px-2 py-0.5" : "text-sm mb-3 px-4 py-1"}`}
            style={{ color: BLUE, background: "#fff", borderRadius: 100, boxShadow: CARD_SHADOW }}
          >
            SOLUTION
          </span>
          <h2
            className={`font-bold leading-snug ${card ? "text-[12px]" : "text-2xl sm:text-3xl"}`}
            style={{ color: INK }}
          >
            見積査定業務の
            <span style={{ color: BLUE }}>お悩み</span>
            解決します
          </h2>
        </div>

        {/* ── 6カード ── */}
        <div className={`grid ${card ? "grid-cols-3 gap-1.5" : "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {CARDS.map((c) => (
            <article
              key={c.title}
              className="flex flex-col overflow-hidden bg-white"
              style={{ borderRadius: 10, boxShadow: CARD_SHADOW }}
            >
              {/* イラスト */}
              <div
                className="flex items-center justify-center"
                style={{ background: SOFT }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(c.img)}
                  alt={c.title}
                  className={`w-full object-contain ${card ? "h-10 p-1" : "h-40 p-4"}`}
                />
              </div>
              {/* テキスト */}
              <div className={`flex flex-1 flex-col ${card ? "p-1.5" : "p-5"}`}>
                <h3
                  className={`font-bold ${card ? "text-[7px] leading-tight" : "text-lg leading-snug"}`}
                  style={{ color: INK }}
                >
                  {c.title}
                </h3>
                {!card && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "#5a6670" }}>
                    {c.body}
                  </p>
                )}
                {/* もっと詳しく */}
                <span
                  className={`mt-auto inline-flex items-center gap-1 font-bold ${card ? "pt-1 text-[6px]" : "pt-4 text-sm"}`}
                  style={{ color: BLUE }}
                >
                  もっと詳しく
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={card ? "h-2 w-2" : "h-3.5 w-3.5"}
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
