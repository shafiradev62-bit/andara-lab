import { ArrowRight, Clock, Tag, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { usePosts } from "@/lib/cms-store";
import { useLocale } from "@/lib/locale";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

const categoryColors: Record<string, string> = {
  "macro-outlooks": "text-blue-700 bg-blue-50",
  "macro": "text-blue-700 bg-blue-50",
  "Macro Outlooks": "text-blue-700 bg-blue-50",
  "geopolitical": "text-purple-700 bg-purple-50",
  "Geopolitical": "text-purple-700 bg-purple-50",
  "esg": "text-green-700 bg-green-50",
  "ESG": "text-green-700 bg-green-50",
  "sectoral": "text-orange-700 bg-orange-50",
  "Sectoral Intelligence": "text-orange-700 bg-orange-50",
  "regional": "text-teal-700 bg-teal-50",
  "Regional Monitor": "text-teal-700 bg-teal-50",
  "market-pulse": "text-red-700 bg-red-50",
  "Market Pulse": "text-red-700 bg-red-50",
  "economics-101": "text-blue-700 bg-blue-50",
  "lab-notes": "text-gray-700 bg-gray-100",
  "monetary": "text-indigo-700 bg-indigo-50",
  "Monetary": "text-indigo-700 bg-indigo-50",
};

function SectionPageLayout({
  section,
  breadcrumb,
  breadcrumbHref,
  description,
  category,
}: {
  section: string;
  breadcrumb: string;
  breadcrumbHref: string;
  description: string;
  // CMS category filter — matches post.category
  category: string | string[];
}) {
  const { locale } = useLocale();
  const categories = Array.isArray(category) ? category : [category];

  const { data: allPosts = [], isLoading } = usePosts({ status: "published" });

  const posts = allPosts
    .filter((p) => {
      const matchLocale = p.locale === locale || p.locale === "en";
      const matchCat = categories.some(
        (c) => p.category?.toLowerCase() === c.toLowerCase()
      );
      return matchLocale && matchCat;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

  return (
    <div className="bg-white">
      <section className="border-b border-[#E5E7EB] py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">{breadcrumb}</span>
          </div>
          <h1 className="text-[34px] font-bold text-gray-900 mb-3">{section}</h1>
          <p className="text-[14.5px] text-gray-500 max-w-[560px]">{description}</p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[13.5px]">Loading articles…</span>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-[14px] mb-2">No articles published yet.</p>
            <Link href="/admin" className="text-[13px] text-[#1a3a5c] hover:underline">
              Add articles in the CMS →
            </Link>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className={`border border-[#E5E7EB] hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group ${i === 0 ? "md:col-span-2" : ""}`}
              >
                {post.image && i === 0 && (
                  <div className="h-[220px] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {post.tag && (
                      <span className={`inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 ${categoryColors[post.category] || "text-[#1a3a5c] bg-blue-50"}`}>
                        <Tag className="w-3 h-3" />{post.tag}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />{post.readTime}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400">{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <h2 className={`font-semibold text-gray-900 mb-2 leading-snug group-hover:text-[#1a3a5c] transition-colors ${i === 0 ? "text-[20px]" : "text-[15px]"}`}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                  )}
                  <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-gray-700 group-hover:text-[#1a3a5c] transition-colors">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
    category={["macro-outlooks", "Macro Outlooks", "macro", "Macro"]}
  />;
}

export function PolicyMonetaryPage() {
  return <SectionPageLayout
    section="Policy & Monetary Watch"
    breadcrumb="Macro Foundations"
    breadcrumbHref="/macro/macro-outlooks"
    description="Tracking Bank Indonesia policy, monetary conditions, and fiscal developments."
    category={["monetary", "Monetary", "policy-monetary", "Policy & Monetary"]}
  />;
}

export function GeopoliticalPage() {
  return <SectionPageLayout
    section="Geopolitical & Structural Analysis"
    breadcrumb="Macro Foundations"
    breadcrumbHref="/macro/macro-outlooks"
    description="Analyzing geopolitical dynamics and structural shifts affecting Indonesia and the region."
    category={["geopolitical", "Geopolitical"]}
  />;
}

export function DeepDivesPage() {
  return <SectionPageLayout
    section="Strategic Industry Deep-dives"
    breadcrumb="Sectoral Intelligence"
    breadcrumbHref="/sectoral/deep-dives"
    description="Rigorous sector-level analysis of Indonesia's key industries and their strategic outlook."
    category={["sectoral", "Sectoral Intelligence", "deep-dives"]}
  />;
}

export function RegionalPage() {
  return <SectionPageLayout
    section="Regional Economic Monitor"
    breadcrumb="Sectoral Intelligence"
    breadcrumbHref="/sectoral/deep-dives"
    description="Monitoring regional economic performance across Java, Sumatra, Kalimantan, and beyond."
    category={["regional", "Regional Monitor", "Regional"]}
  />;
}

export function ESGPage() {
  return <SectionPageLayout
    section="ESG"
    breadcrumb="Sectoral Intelligence"
    breadcrumbHref="/sectoral/deep-dives"
    description="Environmental, social, and governance analysis for Indonesian corporations and investors."
    category={["esg", "ESG"]}
  />;
}

export function BlogPage({ sub }: { sub?: "economics-101" | "market-pulse" | "lab-notes" }) {
  if (!sub) {
    return <SectionPageLayout
      section="All Insights"
      breadcrumb="Blog"
      breadcrumbHref="/blog"
      description="All published research, market commentary, and analysis."
      category={["economics-101", "market-pulse", "lab-notes", "macro-outlooks", "macro", "Macro", "geopolitical", "Geopolitical", "esg", "ESG", "sectoral", "regional", "monetary"]}
    />;
  }
  const configs: Record<string, { section: string; description: string }> = {
    "economics-101": {
      section: "Economics 101",
      description: "Foundational economic concepts explained through the lens of Indonesia's economy.",
    },
    "market-pulse": {
      section: "Market Pulse",
      description: "Short-form market commentary and real-time analysis of Indonesian financial markets.",
    },
    "lab-notes": {
      section: "Lab Notes",
      description: "Behind-the-scenes notes on our research methodology, data sources, and analytical frameworks.",
    },
  };
  const c = configs[sub];
  return <SectionPageLayout
    section={c.section}
    breadcrumb="Blog"
    breadcrumbHref={`/blog/${sub}`}
    description={c.description}
    category={sub}
  />;
}
