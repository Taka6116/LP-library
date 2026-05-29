import {
  SectionFrame,
  Heading,
  SubCopy,
  PrimaryButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";
import { asset } from "@/lib/asset";

// Sansan活用ガイド ファーストビュー
// パンくず + タイトル + 説明 + 注記ボックス + 右側マスコットイラスト
export function HeroSansanGuide({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div
        className={`grid items-center gap-${card ? "3" : "10"} ${
          card ? "grid-cols-[1fr_auto]" : "grid-cols-1 lg:grid-cols-[1.3fr_1fr]"
        }`}
      >
        <div className={card ? "space-y-2" : "space-y-6"}>
          <nav
            className={`flex items-center gap-1.5 text-subtle ${
              card ? "text-[9px]" : "text-xs sm:text-sm"
            }`}
          >
            <span>ホーム</span>
            <span aria-hidden>›</span>
            <span className="font-semibold text-accent">活用ガイド</span>
          </nav>

          <Heading variant={variant} className={card ? "" : "!text-4xl sm:!text-5xl"}>
            Sansan活用ガイド
          </Heading>

          <SubCopy variant={variant}>
            Sansanをもっと活用するためのヒントが満載。
            {!card && <br />}
            目的に合わせて、今日から使える活用法を見つけましょう。
          </SubCopy>

          <div
            className={`rounded-2xl border-l-4 border-accent bg-white shadow-soft ${
              card ? "p-2" : "p-5"
            }`}
          >
            <p
              className={`font-bold text-ink ${
                card ? "text-[10px]" : "text-sm sm:text-base"
              }`}
            >
              はじめてご利用の方へ
            </p>
            <p
              className={`text-subtle ${
                card ? "text-[9px] leading-snug" : "mt-1 text-sm leading-relaxed"
              }`}
            >
              基本操作から応用まで、ステップごとに解説しています。
            </p>
          </div>

          {!card && (
            <div className="flex flex-wrap gap-3 pt-1">
              <PrimaryButton variant={variant}>活用法を探す</PrimaryButton>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/sansan/img-guide-mv-illust.svg")}
            alt="Sansan活用ガイド メインビジュアル"
            className={card ? "h-24 w-auto" : "h-56 w-auto sm:h-72"}
          />
        </div>
      </div>
    </SectionFrame>
  );
}
