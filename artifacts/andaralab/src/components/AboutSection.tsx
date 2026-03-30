import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[26px] font-semibold text-gray-900 mb-4">
          About AndaraLab
        </h2>
        <p className="text-[15px] text-gray-500 leading-relaxed max-w-[640px] mx-auto mb-8">
          At AndaraLab, we operate as a premier economic research hub under PT.
          Andara Investasi Cerdas. We bridge the gap between complex
          macro-economic data and actionable intelligence. Built on the pillar
          of "Tumbuh" (Growth), our mission is to provide the analytical
          foundation that allows our partners to flourish in an ever-evolving
          economic landscape.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5 hover:bg-[#14305a] transition-colors"
        >
          Learn More
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
