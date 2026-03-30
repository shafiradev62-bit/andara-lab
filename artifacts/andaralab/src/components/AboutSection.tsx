import { ArrowRight, BarChart2, Globe, Target } from "lucide-react";
import { Link } from "wouter";

const stats = [
  { icon: BarChart2, value: "100+", label: "Data Points Tracked" },
  { icon: Globe, value: "15+", label: "Economies Monitored" },
  { icon: Target, value: "5+", label: "Research Verticals" },
];

export default function AboutSection() {
  return (
    <section className="py-16 bg-[#F9FAFB] border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1a3a5c] mb-4">
              About AndaraLab
            </div>
            <h2 className="text-[26px] font-bold text-gray-900 leading-tight mb-5">
              A Laboratory for Economic Intelligence
            </h2>
            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-4">
              At AndaraLab, we operate as a premier economic research hub under PT.
              Andara Investasi Cerdas. We bridge the gap between complex
              macro-economic data and actionable intelligence.
            </p>
            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-7">
              Built on the pillar of "Tumbuh" (Growth), our mission is to provide
              the analytical foundation that allows our partners to flourish in an
              ever-evolving economic landscape.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5 hover:bg-[#14305a] transition-colors"
              >
                About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[13.5px] font-medium text-gray-700 border border-[#E5E7EB] px-6 py-2.5 hover:border-gray-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-[#E5E7EB] p-5 text-center">
                <div className="w-10 h-10 bg-[#f0f4f9] flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-5 h-5 text-[#1a3a5c]" />
                </div>
                <div className="text-[26px] font-bold text-[#1a3a5c] mb-1">{s.value}</div>
                <div className="text-[11.5px] text-gray-500 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
