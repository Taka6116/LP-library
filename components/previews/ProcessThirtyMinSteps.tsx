import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// 30min. — サービスご利用の流れ（5 STEP の縦タイムライン）
// やわらかいグリーン基調。上にイラスト + Services 見出し、下に5枚のステップカード、
// カード間にグリーンの三角コネクタ。
const GREEN = "#7cb342";
const GREEN_DARK = "#5e8e2e";
const TITLE = "#8aa356";
const NUM = "#3f3f3f";

type Step = {
  n: number;
  title: string;
  icon: string;
  desc: string;
  button?: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "マイページの新規登録",
    icon: "/30minitues/service_step_icon_1.png",
    desc: "30min.を初めてご利用の方は新規会員登録をおこなっていただきます。",
    button: "新規登録はこちら",
  },
  {
    n: 2,
    title: "キャンペーンのお申し込み",
    icon: "/30minitues/service_step_icon_2.svg",
    desc: "初回限定でお試しキャンペーンをご利用いただけます。ご希望の日時を第3希望までご入力ください。",
  },
  {
    n: 3,
    title: "ご訪問日の提案と確定",
    icon: "/30minitues/service_step_icon_3.svg",
    desc: "訪問日のご提案をマイページにお知らせします。承認いただきますと日時が確定します。",
  },
  {
    n: 4,
    title: "ハウスキーパーのご訪問",
    icon: "/30minitues/service_step_icon_4.svg",
    desc: "ご不明な点はチャットからお問い合わせください。事務局やハウスキーパーにお気軽にご相談下さい。また、下記の「ご用意いただきたいもの」を参考にお掃除道具のご用意をお願いします。",
  },
  {
    n: 5,
    title: "定期契約のお申し込み",
    icon: "/30minitues/service_step_icon_5.png",
    desc: "お試し利用後、マイページの定期契約からお申込みください。ご希望頻度やお申し込み内容に応じ、改めて訪問スケジュールを提案いたします。",
  },
];

function Triangle({ size = 20 }: { size?: number }) {
  return (
    <div className="flex justify-center" aria-hidden>
      <span
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size}px solid transparent`,
          borderRight: `${size}px solid transparent`,
          borderTop: `${size * 0.8}px solid ${GREEN}`,
        }}
      />
    </div>
  );
}

export function ProcessThirtyMinSteps({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full bg-white font-sans ${card ? "px-4 py-6" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{ color: "#333" }}
    >
      <div className={`mx-auto w-full ${card ? "max-w-none" : "max-w-3xl"}`}>
        {/* タイトル */}
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/30minitues/title_image_service.svg")}
            alt="お掃除サービスのイラスト"
            className={`mx-auto w-auto object-contain ${card ? "h-16" : "h-48 sm:h-56"}`}
          />
          <h2
            className={`font-bold tracking-wide ${card ? "mt-1 text-base" : "mt-4 text-4xl sm:text-5xl"}`}
            style={{ color: TITLE }}
          >
            Services
          </h2>
          {!card && (
            <svg
              viewBox="0 0 200 12"
              className="mx-auto mt-1 h-3 w-48"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 7 Q 50 2, 100 6 T 197 5"
                stroke={TITLE}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          )}
          <p
            className={`font-bold ${card ? "mt-1 text-[10px]" : "mt-3 text-lg"}`}
            style={{ color: TITLE }}
          >
            サービスご利用の流れ
          </p>
          {!card && (
            <p className="mx-auto mt-6 max-w-xl text-left text-base leading-loose text-slate-600 sm:text-center">
              一度、お試しでご利用いただいた後に、定期でのお申し込みを承っております。まずマイページに登録して、お試しキャンペーンをお申込ください。
            </p>
          )}
        </div>

        {/* ステップカード */}
        <div className={card ? "mt-3 space-y-1.5" : "mt-12 space-y-0"}>
          {STEPS.map((s, i) => (
            <div key={s.n}>
              <div
                className={`rounded-[20px] border border-slate-100 bg-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] ${
                  card ? "px-2 py-2" : "px-6 py-7 sm:px-9"
                }`}
              >
                <div className={`flex items-center ${card ? "gap-2" : "gap-6"}`}>
                  {/* STEP + number */}
                  <div
                    className={`shrink-0 text-center ${
                      card ? "pr-2" : "border-r-2 border-slate-200 pr-6"
                    }`}
                  >
                    <p
                      className={`font-bold tracking-[0.2em] ${card ? "text-[6px]" : "text-sm"}`}
                      style={{ color: NUM }}
                    >
                      STEP
                    </p>
                    <p
                      className={`font-black leading-none ${card ? "text-base" : "text-5xl"}`}
                      style={{ color: NUM }}
                    >
                      {s.n}
                    </p>
                  </div>

                  {/* icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(s.icon)}
                    alt=""
                    aria-hidden
                    className={`shrink-0 object-contain ${card ? "h-7 w-7" : "h-20 w-20"}`}
                  />

                  {/* text */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-bold ${card ? "text-[9px]" : "text-xl"}`}
                      style={{ color: "#333" }}
                    >
                      {s.title}
                    </p>
                    {!card && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {s.desc}
                      </p>
                    )}
                    {s.button && (
                      <div className={card ? "mt-1" : "mt-4 flex justify-end"}>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full font-bold text-white shadow-md ${
                            card ? "px-2 py-0.5 text-[7px]" : "px-7 py-3 text-sm"
                          }`}
                          style={{
                            background: `linear-gradient(180deg, ${GREEN}, ${GREEN_DARK})`,
                          }}
                        >
                          {s.button}
                          <span aria-hidden>›</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* connector */}
              {i < STEPS.length - 1 && (
                <div className={card ? "py-0.5" : "py-3"}>
                  <Triangle size={card ? 6 : 18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {!card && (
          <p className="mt-8 text-xs leading-relaxed text-slate-400">
            ※サービス提供エリア外にお住まいの方：新規登録していただきますと、お住まいのエリアでサービス提供が開始された時点で、登録メールアドレスにサービス提供開始のご案内を配信させていただきます
          </p>
        )}
      </div>
    </section>
  );
}
