import { ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { usePosts } from "../lib/cms-store";

const categoryColors: Record<string, string> = {
  "Macro Outlooks": "text-blue-700 bg-blue-50",
  "macro": "text-blue-700 bg-blue-50",
  "Macro": "text-blue-700 bg-blue-50",
  "Geopolitical": "text-purple-700 bg-purple-50",
  "geopolitical": "text-purple-700 bg-purple-50",
  "ESG": "text-green-700 bg-green-50",
  "esg": "text-green-700 bg-green-50",
  "Sectoral Intelligence": "text-orange-700 bg-orange-50",
  "sectoral": "text-orange-700 bg-orange-50",
  "Regional Monitor": "text-teal-700 bg-teal-50",
  "regional": "text-teal-700 bg-teal-50",
  "Market Pulse": "text-red-700 bg-red-50",
  "market-pulse": "text-red-700 bg-red-50",
  "Monetary": "text-indigo-700 bg-indigo-50",
  "monetary": "text-indigo-700 bg-indigo-50",
  "economics-101": "text-blue-700 bg-blue-50",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function LatestInsights() {
  const { data: posts = [], isLoading } = usePosts({ status: "published" });

  const published = posts
    .filter((p) => p.locale === "en" || !p.locale)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

  const topThree = published.slice(0, 3);
  const listItems = published.slice(3, 6);

  if (isLoading) {
    return (
      <section className="py-12 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="h-8 w-48 bg-gray-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {[0, 1, 2].map((i) => <div key={i} className="h-48 bg-gray-100 animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

  if (topThree.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-semibold text-gray-900">Latest Insights</h2>
          <Link href="/blog" className="text-[12.5px] font-medium text-[#1a3a5c] hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {topThree.map((post) => (
            <Link
              key={post.id}
              href={`/article/${post.slug}`}
              className="group border border-[#E5E7EB] p-5 flex flex-col hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10.5px] font-semibold px-2 py-0.5 uppercase tracking-wide ${categoryColors[post.category] || "text-gray-600 bg-gray-50"}`}>
                  {post.category}
                </span>
              </div>
              <h3 className="text-[14.5px] font-semibold text-gray-900 leading-snug mb-2.5 group-hover:text-[#1a3a5c] transition-colors flex-1">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  {post.readTime && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[12px] font-medium text-[#1a3a5c] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* List */}
        {listItems.length > 0 && (
          <div className="border border-[#E5E7EB]">
            {listItems.map((post, i) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group ${i > 0 ? "border-t border-[#F3F4F6]" : ""}`}
              >
                <div className="flex-shrink-0 w-20">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide ${categoryColors[post.category] || "text-gray-600 bg-gray-50"}`}>
                    {post.category.split(" ")[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-gray-900 truncate group-hover:text-[#1a3a5c] transition-colors">
                    {post.title}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-[11px] text-gray-400">
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  {post.readTime && (
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1a3a5c] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
