import {
  SectionFrame,
  Heading,
  SubCopy,
  PrimaryButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";
import { asset } from "@/lib/asset";

// Sansan User Forum（SUF）コミュニティ訴求セクション
export function ProofSansanCommunity({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="accent">
      <div
        className={`grid items-center gap-${card ? "3" : "10"} ${
          card ? "grid-cols-[1fr_auto]" : "grid-cols-1 lg:grid-cols-[1.3fr_1fr]"
        }`}
      >
        <div className={card ? "space-y-1.5" : "space-y-5"}>
          <p
            className={`font-bold tracking-[0.16em] text-white/80 ${
              card ? "text-[9px]" : "text-xs sm:text-sm"
            }`}
          >
            SANSAN USER FORUM
          </p>
          <Heading variant={variant} className="!text-white">
            ユーザー同士で、活用のヒントを交換しよう
          </Heading>
          <SubCopy variant={variant} className="!text-white/85">
            全国のSansanユーザーがつながるコミュニティSUF。
            {!card && <br />}
            活用ノウハウや事例をリアルタイムに共有できます。
          </SubCopy>
          {!card && (
            <div className="pt-1">
              <PrimaryButton variant={variant} tone="light">
                SUFに参加する
              </PrimaryButton>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/sansan/suf-illust.png")}
            alt="Sansan User Forum"
            className={card ? "h-20 w-auto" : "h-52 w-auto sm:h-64"}
          />
        </div>
      </div>
    </SectionFrame>
  );
}
