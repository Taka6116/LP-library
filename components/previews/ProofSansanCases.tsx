import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";
import { asset } from "@/lib/asset";

// 導入事例・活用事例カード（サムネイル付き）
const CASES = [
  {
    img: "/sansan/target-list_thumb.jpg",
    label: "活用事例",
    title: "ターゲットリストで営業効率を最大化",
  },
  {
    img: "/sansan/labs-company-highlights_thumb.jpg",
    label: "活用事例",
    title: "企業情報で商談前の準備時間を短縮",
  },
];

export function ProofSansanCases({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={card ? "space-y-2" : "space-y-10"}>
        <div className={card ? "space-y-1" : "space-y-3"}>
          <Eyebrow variant={variant}>CASE STUDY</Eyebrow>
          <Heading variant={variant}>活用している企業の事例</Heading>
        </div>

        <div
          className={`grid gap-${card ? "2" : "6"} ${
            card ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {CASES.map((c) => (
            <article
              key={c.title}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition hover:shadow-cardhover"
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(c.img)}
                  alt=""
                  className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
                    card ? "h-16" : "h-48"
                  }`}
                />
                <span
                  className={`absolute left-0 top-0 bg-accent font-bold text-white ${
                    card ? "px-1.5 py-0.5 text-[8px]" : "px-3 py-1 text-xs"
                  }`}
                >
                  {c.label}
                </span>
              </div>
              <div className={card ? "p-2" : "p-5"}>
                <h3
                  className={`font-bold leading-snug text-ink ${
                    card ? "text-[10px]" : "text-base sm:text-lg"
                  }`}
                >
                  {c.title}
                </h3>
                {!card && (
                  <span className="mt-3 inline-block text-sm font-semibold text-accent">
                    事例を読む ›
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
