import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const phases = [
  { phase: "設計", client: 30, us: 70 },
  { phase: "構築", client: 15, us: 85 },
  { phase: "運用", client: 60, us: 40 },
];

export function ProcessCollaboration({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          役割分担
        </Eyebrow>
        <Heading variant={variant}>伴走しながら、自走へ</Heading>
      </div>
      <div className={`mx-auto max-w-3xl space-y-${card ? "2" : "4"}`}>
        <div
          className={`flex items-center justify-end gap-${card ? "2" : "4"} ${
            card ? "text-[9px]" : "text-sm"
          } font-semibold`}
        >
          <span className="flex items-center gap-1 text-sansan-600">
            <span className="h-2 w-2 rounded-full bg-sansan-500" />
            支援側
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            お客様
          </span>
        </div>
        {phases.map((p, i) => (
          <div key={i}>
            <p
              className={`mb-1 font-semibold text-slate-700 ${
                card ? "text-[10px]" : "text-sm"
              }`}
            >
              {p.phase}フェーズ
            </p>
            <div
              className={`flex overflow-hidden rounded-full ${
                card ? "h-3" : "h-6"
              }`}
            >
              <div
                style={{ width: `${p.us}%` }}
                className="bg-sansan-500"
              />
              <div
                style={{ width: `${p.client}%` }}
                className="bg-slate-300"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
