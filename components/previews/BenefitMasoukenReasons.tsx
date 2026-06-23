import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// M&A総合研究所 — 全国で選ばれる5つの理由
// https://masouken.com/lp02ac4b/
// 画像とテキストが左右交互に並ぶ縦リスト + 大きな番号バッジ。
//
// Design tokens:
//   color.text.inverse  = #002046  ネイビー（見出し・番号）
//   shadow.2 base color  = rgb(21,112,57) = #157039  グリーン（アクセント）
//   color.surface.strong = #f7f7f7  背景
//   radius.sm=10 / radius.md=30 / radius.lg=50
//   font: Noto Sans JP

const NAVY = "#002046";
const GREEN = "#157039";
const SURFACE = "#f7f7f7";

// フォルダ名に "&" や日本語を含むため、各セグメントをエンコードして安全に参照
function img(file: string): string {
  return asset("/" + ["M&A総合研究所", file].map(encodeURIComponent).join("/"));
}

const REASONS = [
  {
    file: "p-top-reason-01.webp",
    title: "譲渡企業様は着手金・中間金無料の完全成功報酬制",
    body: "成約まで一切の費用を請求しない体制を採用。着手金がかかることもある大手とは一線を画します。",
  },
  {
    file: "p-top-reason-02.webp",
    title: "M&A支援の実績豊富",
    body: "全国の様々な業種・売上規模に対応した豊富な支援実績があります。",
  },
  {
    file: "p-top-reason-03.webp",
    title: "AIを活用したマッチングでスピード成約",
    body: "AIアルゴリズムで買い手候補を効率的に探索。平均7.2ヶ月、最短43日での成約を実現します。",
  },
  {
    file: "p-top-reason-04.webp",
    title: "マッチング専門部署がございます",
    body: "業界ごとの専門知識を持つ部署体制で、迅速かつ的確な提案を可能にします。",
  },
  {
    file: "p-top-reason-05.webp",
    title: "経験豊富なM&Aアドバイザーがフルサポート",
    body: "売上規模 約1億〜約100億円まで、幅広い案件の対応実績を保有しています。",
  },
];

export function BenefitMasoukenReasons({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full ${card ? "px-3 py-5" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{ background: SURFACE, fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <div className={`mx-auto w-full ${card ? "" : "max-w-5xl"}`}>
        {/* ── 見出し ── */}
        <div className={`text-center ${card ? "mb-3" : "mb-12"}`}>
          <p
            className={`font-bold ${card ? "text-[8px]" : "text-base sm:text-lg"}`}
            style={{ color: NAVY }}
          >
            M&amp;A総合研究所が全国で選ばれる
          </p>
          <p
            className={`font-extrabold leading-none ${card ? "mt-0.5 text-[18px]" : "mt-1 text-4xl sm:text-5xl"}`}
            style={{ color: NAVY }}
          >
            <span style={{ color: GREEN }} className={card ? "text-[24px]" : "text-5xl sm:text-6xl"}>
              5
            </span>
            つの理由
          </p>
          {/* グリーンの下線 */}
          <span
            className={`mx-auto mt-2 block rounded-full ${card ? "h-[2px] w-8" : "h-1 w-20"}`}
            style={{ background: GREEN }}
          />
        </div>

        {/* ── 5理由（左右交互） ── */}
        <div className={card ? "space-y-2" : "space-y-8"}>
          {REASONS.map((r, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className={`flex items-center overflow-hidden bg-white ${
                  card ? "gap-2 p-1.5" : "gap-6 p-5 sm:p-6"
                } ${reverse ? "flex-row-reverse" : "flex-row"}`}
                style={{
                  borderRadius: card ? 10 : 16,
                  boxShadow: "rgba(0,0,0,0.08) 0px 4px 16px 0px",
                  borderLeft: reverse ? undefined : `${card ? 2 : 4}px solid ${GREEN}`,
                  borderRight: reverse ? `${card ? 2 : 4}px solid ${GREEN}` : undefined,
                }}
              >
                {/* 画像 */}
                <div className={`shrink-0 ${card ? "w-[34%]" : "w-[38%]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(r.file)}
                    alt={r.title}
                    className={`w-full rounded object-cover ${card ? "h-10" : "h-36 sm:h-44"}`}
                  />
                </div>

                {/* テキスト */}
                <div className="min-w-0 flex-1">
                  <div className={`flex items-center ${card ? "gap-1" : "gap-3"}`}>
                    {/* 番号バッジ */}
                    <span
                      className={`grid shrink-0 place-items-center rounded-full font-extrabold text-white ${
                        card ? "h-4 w-4 text-[7px]" : "h-10 w-10 text-lg"
                      }`}
                      style={{ background: NAVY }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`font-bold ${card ? "text-[6px]" : "text-[11px]"}`}
                      style={{ color: GREEN }}
                    >
                      REASON 0{i + 1}
                    </span>
                  </div>
                  <h3
                    className={`font-bold leading-snug ${card ? "mt-1 text-[7px]" : "mt-2.5 text-lg sm:text-xl"}`}
                    style={{ color: NAVY }}
                  >
                    {r.title}
                  </h3>
                  {!card && (
                    <p className="mt-2 text-sm leading-relaxed text-[#555]">{r.body}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
