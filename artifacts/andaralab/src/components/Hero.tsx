import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const pillars = [
  { text: "28+ Years of Data" },
  { text: "Macro & Sectoral Coverage" },
  { text: "Independent Research" },
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-[#F5F5F5]">
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="max-w-2xl">

          {/* Label */}
          <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-5">
            Independent Economic Research · Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-[38px] md:text-[52px] font-bold text-gray-900 leading-[1.06] mb-6">
            Decoding Economies,<br />
            Empowering Growth
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] text-gray-500 leading-relaxed mb-8 max-w-[480px]">
            AndaraLab transforms Indonesia's complex economic data into
            high-precision strategic intelligence — from macro policy shifts to
            sectoral deep-dives across 8 key industries.
          </p>

          {/* Pillar strip */}
          <div className="flex flex-wrap gap-5 mb-10 pb-8 border-b border-[#F5F5F5]">
            {pillars.map((p) => (
              <div key={p.text} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-600">{p.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/analisis"
              className="inline-flex items-center gap-2 text-white text-[13px] font-semibold bg-gray-900 px-6 py-3 hover:bg-gray-700 transition-colors"
            >
              View Research Overview
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/macro/macro-outlooks"
              className="inline-flex items-center gap-2 text-gray-600 text-[13px] font-medium hover:text-gray-900 transition-colors"
            >
              Macro Outlooks
            </Link>
            <Link
              href="/data"
              className="inline-flex items-center gap-2 text-gray-400 text-[13px] font-medium hover:text-gray-900 transition-colors"
            >
              Data Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
