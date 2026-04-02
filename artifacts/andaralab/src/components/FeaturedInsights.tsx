import { ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { usePosts } from "../lib/cms-store";
import { RESEARCH_TAG_PILL } from "../lib/research-tag-styles";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function FeaturedInsights() {
  const { data: posts = [], isLoading } = usePosts({ status: "published" });

  const published = posts.filter((p) => p.locale === "en" || !p.locale);
  const [hero, ...rest] = published.slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-12 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="h-8 w-48 bg-gray-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!hero) return null;

  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-semibold text-gray-900">Featured Insights</h2>
          <Link href="/blog" className="text-[12.5px] font-medium text-[#1a3a5c] hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hero card */}
          <Link
            href={`/article/${hero.slug}`}
            className="md:col-span-2 group relative overflow-hidden flex flex-col"
          >
            {hero.image && (
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full h-52 object-cover"
              />
            )}
            <div className="flex-1 border border-[#E5E7EB] border-t-0 p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10.5px] font-semibold px-2 py-0.5 uppercase tracking-wide ${RESEARCH_TAG_PILL}`}>
                  {hero.category}
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#1a3a5c] transition-colors flex-1">
                {hero.title}
              </h3>
              {hero.excerpt && (
                <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {hero.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto pt-3 border-t border-[#F3F4F6]">
                <span>{formatDate(hero.publishedAt || hero.createdAt)}</span>
                {hero.readTime && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {hero.readTime}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="flex flex-col gap-4">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group border border-[#E5E7EB] p-4 flex flex-col hover:border-gray-300 hover:shadow-sm transition-all flex-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10.5px] font-semibold px-2 py-0.5 uppercase tracking-wide ${RESEARCH_TAG_PILL}`}>
                    {post.category}
                  </span>
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#1a3a5c] transition-colors flex-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto pt-2 border-t border-[#F3F4F6]">
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
