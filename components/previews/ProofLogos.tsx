import {
  SectionFrame,
  Eyebrow,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function ProofLogos({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  const logos = Array.from({ length: card ? 6 : 10 });
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3" : "mb-8"}`}>
        <Eyebrow variant={variant}>業界をリードする企業に選ばれています</Eyebrow>
      </div>
      <div
        className={`grid items-center gap-${card ? "2" : "5"} ${
          card ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        }`}
      >
        {logos.map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 ${
              card ? "h-8" : "h-16"
            }`}
          >
            <div
              className={`rounded bg-slate-300/70 ${
                card ? "h-2 w-10" : "h-3 w-20"
              }`}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
