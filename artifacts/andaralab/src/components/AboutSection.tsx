import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

const pillars = [
  { title: "Rigor", desc: "Every analysis is grounded in verified data sources, peer-reviewed methodology, and transparent assumptions." },
  { title: "Relevance", desc: "We focus on what matters now — policy shifts, market dislocations, and structural economic changes." },
  { title: "Clarity", desc: "Complex economic intelligence translated into clear, actionable insights for decision-makers." },
];

const stats = [
  { value: "100+", label: "Economic Indicators\nTracked Monthly" },
  { value: "15+", label: "Economies\nMonitored" },
  { value: "5+", label: "Research\nVerticals" },
  { value: "2019", label: "Founded,\nJakarta" },
];

export default function AboutSection() {
  return (
    <section className="border-t border-[#E5E7EB] bg-[#F9FAFB]">
      {/* Stats bar */}
      <div className="bg-[#1a3a5c]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={i} className="px-6 py-6 text-center">
                <div className="text-[32px] font-bold text-white leading-none">{s.value}</div>
                <div className="text-[11.5px] text-white/45 mt-1.5 leading-tight whitespace-pre-line">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1a3a5c] mb-4">
              About AndaraLab
            </div>
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight mb-5">
              A Laboratory for<br />Economic Intelligence
            </h2>
            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-4">
              At AndaraLab, we operate as a premier economic research hub under PT.
              Andara Investasi Cerdas — bridging the gap between complex
              macro-economic data and actionable intelligence for Indonesia and beyond.
            </p>
            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-7">
              Built on the pillar of <strong className="text-gray-700">"Tumbuh"</strong> (Growth), our mission is to provide
              the analytical foundation that allows partners and clients to flourish in
              an ever-evolving economic landscape.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5 hover:bg-[#14305a] transition-colors"
              >
                About Us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[13.5px] font-medium text-gray-700 border border-[#E5E7EB] px-6 py-2.5 hover:border-gray-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Pillars */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Our Approach
            </div>
            <div className="space-y-4">
              {pillars.map((p, i) => (
                <div key={p.title} className="flex gap-3 bg-white border border-[#E5E7EB] p-5 hover:border-gray-300 transition-colors">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center border border-[#E5E7EB] bg-[#F0F4F9] mt-0.5">
                    <span className="text-[11px] font-bold text-[#1a3a5c]">0{i + 1}</span>
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-gray-900 mb-1">{p.title}</div>
                    <div className="text-[13px] text-gray-500 leading-relaxed">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
