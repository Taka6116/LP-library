import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// 30min. — 家事代行サービスとは？（興味喚起）
// 手描きの3つの円（巡回型 / 短時間 / ピンポイント）を重ねて配置し、下に清掃イラスト。
const LITEGREEN = "#A5BE5F"; // 巡回型
const GREEN = "#75AC6C"; // 短時間（中央・大きめ）
const YELLOW = "#C8C500"; // ピンポイント
const LOGO_GREEN = "#2f8f6f";

const BASE = "/30min-interest";

type Balloon = {
  circle: string;
  icon: string;
  color: string;
  title: string;
  desc: string;
};

const BALLOONS: { left: Balloon; center: Balloon; right: Balloon } = {
  left: {
    circle: `${BASE}/circle-litegreen.svg`,
    icon: `${BASE}/icon-repeat.svg`,
    color: LITEGREEN,
    title: "巡回型",
    desc: "30min.のハウスキーパーがお住いのマンション内やエリアを巡回してサービスを行う、新しいかたちの家事代行サービスです。",
  },
  center: {
    circle: `${BASE}/circle-green.svg`,
    icon: `${BASE}/icon-time.svg`,
    color: GREEN,
    title: "短時間",
    desc: "エリア内のサービスご利用日をまとめることで、これまでの家事代行サービスにはなかった、「短時間からのサービス提供」を実現しました。",
  },
  right: {
    circle: `${BASE}/circle-yellow.svg`,
    icon: `${BASE}/icon-pinpoint.svg`,
    color: YELLOW,
    title: "ピンポイント",
    desc: "短時間での利用が可能なことで、「お風呂だけ」と言った負担となる家事だけをピンポイントで頼んでいただくことができるサービスです。",
  },
};

function Circle({
  data,
  size,
  card,
  className = "",
  z = 10,
}: {
  data: Balloon;
  size: number;
  card: boolean;
  className?: string;
  z?: number;
}) {
  const pad = Math.round(size * 0.16);
  return (
    <div
      className={`relative flex shrink-0 flex-col items-center justify-center text-center ${className}`}
      style={{
        width: size,
        height: size,
        zIndex: z,
        backgroundImage: `url(${asset(data.circle)})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: pad,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(data.icon)}
        alt=""
        aria-hidden
        style={{ height: card ? 14 : 30 }}
        className="w-auto"
      />
      <p
        className={`font-bold tracking-[0.15em] ${card ? "mt-0.5 text-[8px]" : "mt-2 text-lg"}`}
        style={{ color: data.color }}
      >
        {data.title}
      </p>
      {!card && (
        <p
          className="mt-2 leading-relaxed text-slate-500"
          style={{ fontSize: size > 260 ? 12.5 : 11.5, maxWidth: size * 0.7 }}
        >
          {data.desc}
        </p>
      )}
    </div>
  );
}

export function HookThirtyMinService({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`relative w-full overflow-hidden bg-white font-sans ${
        card ? "px-4 py-6" : "px-6 py-16 sm:px-10 sm:py-20"
      }`}
    >
      {/* 背景ブロブ */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-slate-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full"
        style={{ background: "#eef3e4" }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* 見出し */}
        <div className="text-center">
          <p
            className={`font-black ${card ? "text-lg" : "text-4xl"}`}
            style={{ color: LOGO_GREEN }}
          >
            30<span className="italic">min.</span>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(`${BASE}/heading.png`)}
            alt="家事代行サービスとは？"
            className={`mx-auto w-auto ${card ? "mt-1 h-3" : "mt-3 h-6 sm:h-7"}`}
          />
        </div>

        {/* 3つの円（重ねて配置） */}
        <div
          className={`flex items-start justify-center ${card ? "mt-3" : "mt-10"}`}
        >
          <Circle
            data={BALLOONS.left}
            size={card ? 88 : 240}
            card={card}
            z={10}
            className={card ? "mt-4 -mr-3" : "mt-16 -mr-8"}
          />
          <Circle
            data={BALLOONS.center}
            size={card ? 112 : 300}
            card={card}
            z={20}
          />
          <Circle
            data={BALLOONS.right}
            size={card ? 88 : 240}
            card={card}
            z={10}
            className={card ? "mt-4 -ml-3" : "mt-16 -ml-8"}
          />
        </div>

        {/* 中央下のポインタ */}
        <div className={`flex justify-center ${card ? "-mt-2" : "-mt-6"}`} aria-hidden>
          <span
            className={card ? "h-3 w-3" : "h-8 w-8"}
            style={{
              background: YELLOW,
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
              borderRadius: "0 0 9999px 9999px",
            }}
          />
        </div>

        {/* イラスト */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(`${BASE}/illustration.svg`)}
          alt="家事代行のイラスト"
          className={`mx-auto w-auto ${card ? "mt-1 h-16" : "mt-4 h-56 sm:h-64"}`}
        />
      </div>
    </section>
  );
}
