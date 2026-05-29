import {
  SectionFrame,
  Eyebrow,
  SubCopy,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function HookQuestion({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div
        className={`mx-auto max-w-3xl text-center ${
          card ? "space-y-2" : "space-y-6"
        }`}
      >
        <Eyebrow variant={variant} tone="muted">
          少し立ち止まって
        </Eyebrow>
        <h2
          className={`font-bold leading-snug tracking-tight ${
            card ? "text-base" : "text-3xl sm:text-5xl"
          }`}
        >
          なぜ、頑張っているのに
          <br className="hidden sm:block" />
          <span className="text-sansan-600">成果が伸びない</span>のか？
        </h2>
        <SubCopy variant={variant} className="mx-auto">
          努力の量ではなく、仕組みの設計が原因かもしれません。次のセクションで、その理由を解き明かします。
        </SubCopy>
      </div>
    </SectionFrame>
  );
}
