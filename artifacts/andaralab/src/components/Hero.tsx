import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useLocale } from "@/lib/locale";

const pillarsEn = [
  { text: "28+ Years of Data" },
  { text: "Macro & Sectoral Coverage" },
  { text: "Independent Research" },
];

const pillarsId = [
  { text: "28+ Tahun Data" },
  { text: "Cakupan Makro & Sektoral" },
  { text: "Riset Independen" },
];

export default function Hero() {
  const { locale, t } = useLocale();
  const pillars = locale === "id" ? pillarsId : pillarsEn;

  return (
    <section
      className="relative -mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center border-b border-[#F5F5F5]"
      style={{
        background: "url('/gambar.png') center center / cover no-repeat",
      }}
    >
      {/* Dark overlay so white text is readable */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">

          {/* Label */}
          <div className="text-[11px] font-medium uppercase tracking-widest text-white/70 mb-5">
            {t("independent_research_indonesia")}
          </div>

          {/* Headline */}
          <h1 className="text-[38px] md:text-[52px] font-bold text-white leading-[1.06] mb-6">
            {t("decoding_economies")}<br />
            {t("empowering_growth")}
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] text-white/80 leading-relaxed mb-8 max-w-[480px]">
            {locale === "id"
              ? "AndaraLab mengubah data ekonomi Indonesia yang kompleks menjadi intelijen strategis presisi tinggi — dari perubahan kebijakan makro hingga analisis sektoral mendalam di 8 industri utama."
              : "AndaraLab transforms Indonesia's complex economic data into high-precision strategic intelligence — from macro policy shifts to sectoral deep-dives across 8 key industries."}
          </p>

          {/* Pillar strip */}
          <div className="flex flex-wrap gap-5 mb-10 pb-8 border-b border-white/20">
            {pillars.map((p) => (
              <div key={p.text} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                <span className="text-[13px] font-medium text-white/80">{p.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/analisis"
              className="inline-flex items-center gap-2 text-gray-900 text-[13px] font-semibold bg-white px-6 py-3 hover:bg-white/90 transition-colors"
            >
              {t("view_research_overview")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/macro/macro-outlooks"
              className="inline-flex items-center gap-2 text-white/80 text-[13px] font-medium hover:text-white transition-colors"
            >
              {t("macro_outlooks_label")}
            </Link>
            <Link
              href="/data"
              className="inline-flex items-center gap-2 text-white/60 text-[13px] font-medium hover:text-white transition-colors"
            >
              {t("data_hub_label")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
