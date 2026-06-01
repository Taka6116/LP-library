import { asset } from "@/lib/asset";
import { isCard, type SharedPreviewProps } from "./_shared";

const ctaItems = [
  {
    title: "Seminar",
    label: "セミナー",
    description:
      "1on1についての最新トレンドや業界動向、実践的なノウハウを学べる多彩なセミナーを定期的に開催しています。",
    href: "https://kakeai.co.jp/seminar/",
    bg: "bg-[#f4a2cf]",
    image: "/Kakeai/68690c902a3fe0be26fd71a1_seminar.webp",
    imageClass: "w-[46%] max-w-[280px]",
  },
  {
    title: "Download",
    label: "お役立ち資料",
    description:
      "Kakeaiが持つ、1on1による組織改善のヒントや最先端の事例等の資料をダウンロードいただけます。",
    href: "https://kakeai.co.jp/download/",
    bg: "bg-[#fb9a9d]",
    image:
      "/Kakeai/68690c90b7b4596dd25c60fb_5f483697f5b2b4c73a370121cf42f815_dl-p-500.webp",
    imageClass: "w-[44%] max-w-[290px]",
  },
  {
    title: "Case",
    label: "導入事例",
    description:
      "実際にお客様がどのような課題を抱え、当社ソリューションによってどのように解決・成果を上げられたかを、具体的な数字や声とともにご紹介しています。",
    href: "https://kakeai.co.jp/case/",
    bg: "bg-[#dea4f4]",
    image: "/Kakeai/68690c90d74e445c7fe98bdb_case.webp",
    imageClass: "w-[45%] max-w-[290px]",
  },
];

export function CtaKakeaiThreeCards({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section className="w-full bg-white px-3 pb-16 pt-0 text-[#050b2c]">
      <div className="w-full">
        {!card && (
          <div className="mb-10 h-[47px] bg-[#f8f2df]" />
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          {ctaItems.map((item) => (
            <article
              key={item.title}
              className={`relative isolate flex min-h-[340px] overflow-hidden ${item.bg} px-8 py-10 sm:min-h-[390px] sm:px-12 sm:py-12 lg:min-h-[436px]`}
            >
              <div className="relative z-10 flex min-h-full w-full flex-col">
                <div>
                  <h2 className="text-[42px] font-bold leading-none tracking-normal sm:text-[48px] xl:text-[52px]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-base font-bold leading-none tracking-normal">
                    {item.label}
                  </p>
                  <p className="mt-6 max-w-[33rem] text-[15px] font-bold leading-8 tracking-normal sm:text-base">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.href}
                  className="mt-auto inline-flex h-12 w-fit min-w-[150px] items-center justify-center gap-2 rounded-md bg-[#030a2d] px-6 text-sm font-bold tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#071347] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#030a2d] focus-visible:ring-offset-2"
                >
                  詳しく見る
                  <span aria-hidden className="text-lg leading-none">
                    →
                  </span>
                </a>
              </div>

              <img
                src={asset(item.image)}
                alt=""
                loading="lazy"
                className={`pointer-events-none absolute bottom-8 right-8 z-0 object-contain sm:right-12 ${item.imageClass}`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
