import { ArrowRight, BarChart3, Globe, Shield } from "lucide-react";

const pillars = [
  { icon: <BarChart3 className="w-5 h-5 text-[#1a3a5c]" />, text: "28+ Years of Data" },
  { icon: <Globe className="w-5 h-5 text-[#1a3a5c]" />, text: "Macro & Sectoral Coverage" },
  { icon: <Shield className="w-5 h-5 text-[#1a3a5c]" />, text: "Independent Research" },
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="max-w-2xl">

          {/* Label */}
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1a3a5c] mb-5">
            Independent Economic Research · Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-[38px] md:text-[52px] font-bold text-gray-900 leading-[1.06] mb-6">
            Decoding Economies,<br />
            Empowering Growth
          </h1>

          {/* Subheadline */}
          <p className="text-[15.5px] text-gray-500 leading-relaxed mb-8 max-w-[480px]">
            AndaraLab transforms Indonesia's complex economic data into
            high-precision strategic intelligence — from macro policy shifts to
            sectoral deep-dives across 8 key industries.
          </p>

          {/* Pillar strip */}
          <div className="flex flex-wrap gap-5 mb-10 pb-8 border-b border-[#F3F4F6]">
            {pillars.map((p) => (
              <div key={p.text} className="flex items-center gap-2">
                {p.icon}
                <span className="text-[13px] font-medium text-gray-700">{p.text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/analisis"
              className="inline-flex items-center gap-2 text-white text-[13px] font-semibold bg-[#1a3a5c] px-6 py-3 hover:bg-[#14305a] transition-colors"
            >
              View Research Overview
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/macro/macro-outlooks"
              className="inline-flex items-center gap-2 border border-[#D1D5DB] text-gray-700 text-[13px] font-medium px-6 py-3 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              Macro Outlooks
            </Link>
            <Link
              href="/data"
              className="inline-flex items-center gap-2 text-[#1a3a5c] text-[13px] font-semibold hover:underline"
            >
              Data Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
