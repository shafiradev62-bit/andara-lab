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
    <div className="pt-14 pb-8">
      <h2 className="text-[28px] font-bold text-gray-900 leading-tight mb-5">
        {headline ?? "A Laboratory for Economic Intelligence"}
      </h2>
      {subheadline && (
        <p className="text-[15px] text-gray-500 leading-relaxed mb-6">{subheadline}</p>
      )}
    </div>
  );
}

function TextSection({ content }: { content?: string }) {
  return (
    <div className="pb-8">
      <p className="text-[15px] text-gray-500 leading-relaxed">{content}</p>
    </div>
  );
}

function StatsSection({ items }: { items?: { label: string; value: string; unit?: string }[] }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F0F0F0] mb-8">
      {list.map((item, i) => (
        <div key={i} className="px-5 py-5 text-center">
          <div className="text-[28px] font-bold text-gray-900 leading-none">
            {item.value}
            {item.unit && <span className="text-[14px] font-normal text-gray-500 ml-0.5">{item.unit}</span>}
          </div>
          <div className="text-[11px] text-gray-500 mt-1.5 leading-tight">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function ApproachSection({ headline, items }: { headline?: string; items?: { label: string; value: string }[] }) {
  const list = Array.isArray(items) ? items : [
    { label: "Rigor", value: "Every analysis is grounded in verified data sources, peer-reviewed methodology, and transparent assumptions." },
    { label: "Relevance", value: "We focus on what matters now — policy shifts, market dislocations, and structural economic changes." },
    { label: "Clarity", value: "Complex economic intelligence translated into clear, actionable insights for decision-makers." },
  ];
  return (
    <div className="pb-12">
      <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-4">
        {headline ?? "Our Approach"}
      </div>
      <div className="divide-y divide-[#F0F0F0]">
        {list.map((item, i) => (
          <div key={i} className="flex gap-5 py-5">
            <div className="text-[11px] font-medium text-gray-300 w-5 flex-shrink-0 mt-0.5">0{i + 1}</div>
            <div>
              <div className="text-[14px] font-semibold text-gray-900 mb-1">{item.label}</div>
              <div className="text-[13px] text-gray-500 leading-relaxed">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Block Router ─────────────────────────────────────────────────────────────

function SectionBlock({ section }: { section: ContentSection }) {
  switch (section.type) {
    case "hero":   return <HeroSection {...section} />;
    case "text":   return <TextSection content={section.content} />;
    case "stats":  return <StatsSection items={section.items} />;
    case "about":  return <ApproachSection {...section} />;
    default:       return null;
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function HomeAboutSection() {
  const { locale } = useLocale();
  const { data: page, isLoading } = usePageBySlug("/about", locale);

  if (isLoading) {
    return (
      <section className="border-t border-[#F0F0F0] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="space-y-3 max-w-md">
            <div className="h-5 w-24 bg-gray-100 animate-pulse rounded" />
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
    <section className="border-t border-[#F0F0F0] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {blocks.map((section, i) => (
          <SectionBlock key={`${section.type}-${i}`} section={section} />
        ))}

        {/* CTA */}
        <div className="flex items-center gap-4 pb-12">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-white text-[13px] font-semibold bg-gray-900 px-6 py-3 hover:bg-gray-700 transition-colors"
          >
            About Us <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-gray-600 text-[13px] font-medium hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
