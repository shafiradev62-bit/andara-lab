import { ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "wouter";
import { articles, getArticle } from "@/lib/articles";
import { useLocale } from "@/lib/locale";

function SectionPageLayout({
  section, sectionKey, breadcrumb, breadcrumbHref, description, descriptionKey, slugs,
}: {
  section: string;
  sectionKey?: "economics_101" | "market_pulse" | "lab_notes";
  breadcrumb: string;
  breadcrumbHref: string;
  description: string;
  descriptionKey?: "economics_101" | "market_pulse" | "lab_notes";
  slugs: string[];
}) {
  const { locale, t } = useLocale();
  const displaySection = sectionKey ? t(sectionKey) : section;
  const displayDescription = descriptionKey ? t(descriptionKey) : description;
  const sectionArticles = slugs
    .map((s) => getArticle(s, locale))
    .filter(Boolean) as typeof articles;

  return (
    <div className="bg-white">
      <section className="border-b border-[#E5E7EB] py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">{breadcrumb}</span>
          </div>
          <h1 className="text-[34px] font-bold text-gray-900 mb-3">{displaySection}</h1>
          <p className="text-[14.5px] text-gray-500 max-w-[560px]">{displayDescription}</p>
        </div>
      </section>
      <section className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionArticles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className={`border border-[#E5E7EB] hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group ${i === 0 ? "md:col-span-2" : ""}`}
            >
              {article.image && i === 0 && (
                <div className="h-[220px] overflow-hidden">
                  <img src={article.image} alt={locale === "id" ? (article.titleId ?? article.title) : article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#1a3a5c] bg-blue-50 px-2 py-0.5">
                    <Tag className="w-3 h-3" />{locale === "id" ? (article.tagId ?? article.tag) : article.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />{article.readTime}
                  </span>
                  <span className="text-[11px] text-gray-400">{article.date}</span>
                </div>
                <h2 className={`font-semibold text-gray-900 mb-2 leading-snug group-hover:text-[#1a3a5c] transition-colors ${i === 0 ? "text-[20px]" : "text-[15px]"}`}>
                  {locale === "id" ? (article.titleId ?? article.title) : article.title}
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{locale === "id" ? (article.excerptId ?? article.excerpt) : article.excerpt}</p>
                <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-gray-700 group-hover:text-[#1a3a5c] transition-colors">
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function MacroOutlooksPage() {
  return <SectionPageLayout
    section="Macro Outlooks"
    breadcrumb="Macro Foundations"
    breadcrumbHref="/macro/macro-outlooks"
    description="In-depth analysis of Indonesia's macroeconomic trends, growth drivers, and risks."
    slugs={["indonesia-macro-outlook-2026", "bi-rate-policy-2026", "fiscal-consolidation-indonesia", "current-account-balance-2026"]}
  />;
}

export function PolicyMonetaryPage() {
  return <SectionPageLayout
    section="Policy & Monetary Watch"
    breadcrumb="Macro Foundations"
    breadcrumbHref="/macro/macro-outlooks"
    description="Tracking Bank Indonesia policy, monetary conditions, and fiscal developments."
    slugs={["bi-rate-hold-march-2026", "indonesia-inflation-breakdown", "bi-rate-policy-2026", "fiscal-consolidation-indonesia"]}
  />;
}

export function GeopoliticalPage() {
  return <SectionPageLayout
    section="Geopolitical & Structural Analysis"
    breadcrumb="Macro Foundations"
    breadcrumbHref="/macro/macro-outlooks"
    description="Analyzing geopolitical dynamics and structural shifts affecting Indonesia and the region."
    slugs={["us-china-trade-indonesia", "asean-economic-integration", "indonesia-macro-outlook-2026", "current-account-balance-2026"]}
  />;
}

export function DeepDivesPage() {
  return <SectionPageLayout
    section="Strategic Industry Deep-dives"
    breadcrumb="Sectoral Intelligence"
    breadcrumbHref="/sectoral/deep-dives"
    description="Rigorous sector-level analysis of Indonesia's key industries and their strategic outlook."
    slugs={["nickel-ev-indonesia", "palm-oil-esg-headwinds", "digital-economy-130b", "banking-sector-credit-npl"]}
  />;
}

export function RegionalPage() {
  return <SectionPageLayout
    section="Regional Economic Monitor"
    breadcrumb="Sectoral Intelligence"
    breadcrumbHref="/sectoral/deep-dives"
    description="Monitoring regional economic performance across Java, Sumatra, Kalimantan, and beyond."
    slugs={["java-economic-corridor", "kalimantan-nusantara-investment", "sumatra-connectivity"]}
  />;
}

export function ESGPage() {
  return <SectionPageLayout
    section="ESG"
    breadcrumb="Sectoral Intelligence"
    breadcrumbHref="/sectoral/deep-dives"
    description="Environmental, social, and governance analysis for Indonesian corporations and investors."
    slugs={["indonesia-green-bond-market", "corporate-governance-reform", "indonesia-coal-exit-jetp"]}
  />;
}

export function BlogPage({ sub }: { sub: "economics-101" | "market-pulse" | "lab-notes" }) {
  const configs: Record<typeof sub, { sectionKey: "economics_101" | "market_pulse" | "lab_notes"; descriptionKey: "economics_101" | "market_pulse" | "lab_notes"; slugs: string[] }> = {
    "economics-101": {
      sectionKey: "economics_101",
      descriptionKey: "economics_101",
      slugs: ["what-is-current-account-deficit", "cpi-vs-core-inflation", "fx-reserves-indonesia", "interest-rate-cycles-investments"],
    },
    "market-pulse": {
      sectionKey: "market_pulse",
      descriptionKey: "market_pulse",
      slugs: ["jci-7200-bi-hold", "idr-carry-trade-dynamics", "bi-rate-hold-march-2026", "indonesia-inflation-breakdown"],
    },
    "lab-notes": {
      sectionKey: "lab_notes",
      descriptionKey: "lab_notes",
      slugs: ["how-we-build-macro-models", "data-quality-indonesia-challenge", "nowcasting-indonesia-gdp"],
    },
  };
  const c = configs[sub];
  return <SectionPageLayout
    section=""
    sectionKey={c.sectionKey}
    breadcrumb="Blog"
    breadcrumbHref={`/blog/${sub}`}
    description=""
    descriptionKey={c.descriptionKey}
    slugs={c.slugs}
  />;
}
