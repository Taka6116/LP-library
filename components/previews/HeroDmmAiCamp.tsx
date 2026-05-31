import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// DMM 生成AI CAMP 学び放題 — ファーストビュー
// 左: ティール/ネイビーの斜め背景にコピー+丸バッジ+CTA / 右: コース画像の4行マーキー
// （上から 右→左 / 左→右 / 右→左 / 左→右 の自動スクロール）。
const ORANGE = "#f47806";
const GOLD = "#ffce3a";
const NAVY = "#0a2436";

const COURSES = [
  "marketing",
  "engineer",
  "video",
  "design",
  "basic",
  "hr",
  "sales",
];

// 行ごとに並びをずらす
function rotate<T>(arr: T[], n: number): T[] {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

function MarqueeRow({
  order,
  dir,
  duration,
  card,
}: {
  order: string[];
  dir: "left" | "right";
  duration: number;
  card: boolean;
}) {
  const cards = [...order, ...order]; // 2周分でシームレスループ
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 ${
          dir === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } ${card ? "gap-1.5" : "gap-3"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {cards.map((name, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${name}-${i}`}
            src={asset(`/DMM/${name}.webp`)}
            alt=""
            aria-hidden
            className={`shrink-0 rounded-lg object-cover shadow-lg ${
              card ? "h-9 w-auto" : "h-[108px] w-auto"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Marquee({ card }: { card: boolean }) {
  const rows: { dir: "left" | "right"; dur: number }[] = [
    { dir: "left", dur: 46 },
    { dir: "right", dur: 54 },
    { dir: "left", dur: 50 },
    { dir: "right", dur: 58 },
  ];
  return (
    <div className={`flex flex-col justify-center ${card ? "gap-1.5" : "gap-3"} h-full`}>
      {rows.map((r, i) => (
        <MarqueeRow
          key={i}
          order={rotate(COURSES, i * 2)}
          dir={r.dir}
          duration={card ? r.dur / 2 : r.dur}
          card={card}
        />
      ))}
    </div>
  );
}

function Badge({
  top,
  big,
  card,
}: {
  top: string;
  big: string;
  card: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full bg-white text-center shadow-md ${
        card ? "h-12 w-12" : "h-28 w-28"
      }`}
      style={{ color: NAVY }}
    >
      <span className={card ? "text-[5px]" : "text-xs"}>{top}</span>
      <span className={`font-black ${card ? "text-[8px]" : "text-xl"}`}>{big}</span>
    </div>
  );
}

export function HeroDmmAiCamp({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section className="w-full bg-white font-sans">
      {/* 白いナビバー */}
      <nav
        className={`flex items-center justify-between border-b border-slate-100 ${
          card ? "px-3 py-1.5" : "px-6 py-3 sm:px-8"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-[#1a1a1a] ${card ? "text-[10px]" : "text-xl"}`}>
            DMM 生成AI CAMP
          </span>
          <span
            className={`rounded font-bold text-white ${card ? "px-1 py-0.5 text-[6px]" : "px-2 py-1 text-xs"}`}
            style={{ background: "#0e7c8c" }}
          >
            学び放題
          </span>
        </div>
        <div className="flex items-center gap-4">
          {!card && (
            <div className="hidden items-center gap-5 text-sm font-bold text-[#1a1a1a] xl:flex">
              {["特徴", "選ばれる理由", "利用者の声", "料金", "ご利用の流れ"].map((n) => (
                <span key={n}>{n}</span>
              ))}
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                法人の方はこちら
                <span aria-hidden>↗</span>
              </span>
            </div>
          )}
          <span
            className={`rounded-full font-bold text-white shadow-sm ${
              card ? "px-2 py-1 text-[7px]" : "px-6 py-2.5 text-sm"
            }`}
            style={{ background: ORANGE }}
          >
            入会申し込み
          </span>
          {!card && (
            <div className="flex flex-col gap-1">
              <span className="h-0.5 w-6 bg-[#1a1a1a]" />
              <span className="h-0.5 w-6 bg-[#1a1a1a]" />
              <span className="h-0.5 w-6 bg-[#1a1a1a]" />
            </div>
          )}
        </div>
      </nav>

      {/* ヒーロー本体（斜め背景 + 右マーキー） */}
      <div
        className={`relative overflow-hidden ${card ? "min-h-[150px]" : "min-h-[560px]"}`}
        style={{ background: NAVY }}
      >
        {/* マーキー（全面） */}
        <div className="absolute inset-0">
          <Marquee card={card} />
        </div>

        {/* ティールの斜めオーバーレイ（左側を覆う） */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0e7c8c 0%, #0c5a6c 45%, #0a3242 100%)",
            clipPath: card
              ? "polygon(0 0, 62% 0, 48% 100%, 0 100%)"
              : "polygon(0 0, 58% 0, 44% 100%, 0 100%)",
          }}
        />

        {/* コンテンツ */}
        <div
          className={`relative z-10 mx-auto w-full max-w-6xl ${
            card ? "px-3 py-3" : "px-6 py-10 sm:px-10 sm:py-14"
          }`}
        >
          <div className={card ? "max-w-[58%]" : "max-w-[52%]"}>
            <p
              className={`font-bold text-white ${card ? "text-[8px]" : "text-lg sm:text-2xl"}`}
            >
              学び放題×徹底サポートで
            </p>

            <h1 className={card ? "mt-1 space-y-1" : "mt-3 space-y-2"}>
              <span
                className={`inline-block rounded font-black text-white ${
                  card ? "px-1 py-0.5 text-[11px]" : "px-3 py-1 text-4xl sm:text-5xl"
                }`}
                style={{ background: "rgba(8,30,45,0.85)" }}
              >
                生成AI時代に
              </span>
              <br />
              <span
                className={`inline-block rounded font-black ${
                  card ? "px-1 py-0.5 text-[11px]" : "px-3 py-1 text-4xl sm:text-5xl"
                }`}
                style={{ background: "rgba(8,30,45,0.85)", color: GOLD }}
              >
                稼げる力
              </span>
              <span
                className={`font-black text-white ${card ? "text-[11px]" : "text-3xl sm:text-4xl"}`}
              >
                {" "}
                が身につく
              </span>
            </h1>

            <p
              className={`text-white/90 ${
                card ? "mt-1 text-[6px] leading-snug" : "mt-5 text-sm leading-relaxed sm:text-base"
              }`}
            >
              全職種の基礎から応用まで約1,000レッスン以上の
              {!card && <br />}
              本格カリキュラムが、月額制ですべて学べる。
            </p>

            <div className={`flex ${card ? "mt-2 gap-1.5" : "mt-7 gap-3"}`}>
              <Badge top="全職種が" big="学び放題" card={card} />
              <Badge top="入会金/教材費" big="0円" card={card} />
              <Badge top="契約期間の" big="縛り無し" card={card} />
            </div>
          </div>

          {/* 下部CTA */}
          <div
            className={`flex flex-wrap items-center ${
              card ? "mt-2 gap-1.5" : "mt-9 gap-4"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center rounded-md border-2 border-white font-bold text-white ${
                card ? "px-2 py-1 text-[7px]" : "px-10 py-4 text-base sm:text-lg"
              }`}
            >
              無料セミナーを予約
            </span>
            <span
              className={`inline-flex items-center justify-center rounded-md font-bold text-white shadow-lg ${
                card ? "px-2 py-1 text-[7px]" : "px-10 py-4 text-base sm:text-lg"
              }`}
              style={{ background: ORANGE }}
            >
              入会申し込み
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
