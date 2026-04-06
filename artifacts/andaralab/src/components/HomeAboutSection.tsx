// HomeAboutSection — fetches /about page from CMS and renders its content
// Used on the homepage so About section is CMS-driven, not static

import { usePageBySlug } from "@/lib/cms-store";
import { useLocale } from "@/lib/locale";
import type { ContentSection } from "@/lib/cms-store";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

// ─── Section Renderers ─────────────────────────────────────────────────────────

function HeroSection({ headline, subheadline }: { headline?: string; subheadline?: string }) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-14 pb-8">
      <h2 className="text-[28px] font-bold text-gray-900 leading-tight mb-5">{headline ?? "A Laboratory for Economic Intelligence"}</h2>
      {subheadline && <p className="text-[14.5px] text-gray-500 leading-relaxed mb-6">{subheadline}</p>}
    </section>
  );
}

function TextSection({ content }: { content?: string }) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-10">
      <p className="text-[14.5px] text-gray-500 leading-relaxed">{content}</p>
    </section>
  );
}

function StatsSection({ items }: { items?: { label: string; value: string; unit?: string }[] }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return null;
  return (
    <section className="border-t border-b border-[#E5E7EB] mb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E7EB]">
        {list.map((item, i) => (
          <div key={i} className="px-6 py-6 text-center">
            <div className="text-[32px] font-bold text-gray-900 leading-none">
              {item.value}{item.unit && <span className="text-[16px] font-normal text-gray-500 ml-1">{item.unit}</span>}
            </div>
            <div className="text-[12px] text-gray-400 mt-1.5 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApproachSection({ items }: { items?: { label: string; value: string; unit?: string }[] }) {
  const list = Array.isArray(items) ? items : [
    { label: "Rigor", value: "Every analysis is grounded in verified data sources, peer-reviewed methodology, and transparent assumptions." },
    { label: "Relevance", value: "We focus on what matters now — policy shifts, market dislocations, and structural economic changes." },
    { label: "Clarity", value: "Complex economic intelligence translated into clear, actionable insights for decision-makers." },
  ];
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-14">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">Our Approach</div>
      <div className="space-y-0 border border-[#E5E7EB]">
        {list.map((item, i, arr) => (
          <div key={i} className={`flex gap-4 p-5 ${i < arr.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}>
            <div className="text-[11px] font-bold text-gray-300 w-6 flex-shrink-0 mt-0.5">0{i + 1}</div>
            <div>
              <div className="text-[14px] font-semibold text-gray-900 mb-1">{item.label}</div>
              <div className="text-[13px] text-gray-500 leading-relaxed">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Block Router ─────────────────────────────────────────────────────────────

function SectionBlock({ section }: { section: ContentSection }) {
  switch (section.type) {
    case "hero":   return <HeroSection {...section} />;
    case "text":   return <TextSection content={section.content} />;
    case "stats":  return <StatsSection items={section.items} />;
    case "about":  return <ApproachSection items={section.items} />;
    default:       return null;
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function HomeAboutSection() {
  const { locale } = useLocale();
  const { data: page, isLoading } = usePageBySlug("/about", locale);

  if (isLoading) {
    return (
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="space-y-4 max-w-md">
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </section>
    );
  }

  const blocks: ContentSection[] = page?.content ?? [];

  if (blocks.length === 0) return null;

  return (
    <section className="border-t border-[#E5E7EB] bg-white">
      {blocks.map((section, i) => (
        <SectionBlock key={`${section.type}-${i}`} section={section} />
      ))}
      {/* Always show CTA link to full about page */}
      <div className="max-w-[1200px] mx-auto px-6 pb-10">
        <div className="flex items-center gap-3 pt-2 border-t border-[#E5E7EB]">
          <Link href="/about" className="inline-flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 px-6 py-2.5 hover:bg-gray-700 transition-colors">
            About Us <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-700 border border-[#D1D5DB] px-6 py-2.5 hover:border-gray-400 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
