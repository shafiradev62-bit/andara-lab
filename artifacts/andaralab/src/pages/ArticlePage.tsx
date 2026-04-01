import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { getArticle, getRelated } from "@/lib/articles";
import { useLocale } from "@/lib/locale";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const { locale, t } = useLocale();
  const article = getArticle(params.slug || "", locale);
  const related = article ? getRelated(params.slug || "", locale) : [];

  if (!article) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <div className="text-[72px] font-bold text-gray-100 mb-4">404</div>
        <h1 className="text-[24px] font-semibold text-gray-900 mb-3">Article not found</h1>
        <p className="text-gray-500 mb-8">This article doesn't exist or may have been moved.</p>
        <Link href="/" className="text-[13.5px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href={article.categoryHref} className="hover:text-gray-700 transition-colors">{article.category}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[300px]">{locale === "id" ? (article.titleId ?? article.title) : article.title}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main article */}
          <div className="lg:col-span-2">
            <Link
              href={article.categoryHref}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a3a5c] mb-5 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {locale === "id" ? (article.tagId ?? article.tag) : article.tag}
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10.5px] font-semibold text-[#1a3a5c] border border-[#1a3a5c]/20 bg-blue-50 px-2 py-0.5 uppercase tracking-wide">
                {locale === "id" ? (article.tagId ?? article.tag) : article.tag}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-gray-400">
                <Clock className="w-3 h-3" /> {locale === "id" ? (article.readTime.replace("min read", "menit baca")) : article.readTime}
              </span>
              <span className="text-[12px] text-gray-400">{article.date}</span>
            </div>

            <h1 className="text-[28px] md:text-[34px] font-bold text-gray-900 leading-tight mb-4">
              {locale === "id" ? (article.titleId ?? article.title) : article.title}
            </h1>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-6 border-l-4 border-[#1a3a5c] pl-4">
              {locale === "id" ? (article.excerptId ?? article.excerpt) : article.excerpt}
            </p>

            {article.image && (
              <div className="mb-8 border border-[#E5E7EB] overflow-hidden">
                <img
                  src={article.image}
                  alt={locale === "id" ? (article.titleId ?? article.title) : article.title}
                  className="w-full h-[300px] object-cover"
                />
              </div>
            )}

            <div className="prose max-w-none">
              {(locale === "id" && article.bodyId ? article.bodyId : article.body).map((para, i) => (
                <p key={i} className="text-[14.5px] text-gray-700 leading-[1.8] mb-5">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="text-[12px] text-gray-400">
                Published: <span className="text-gray-600">{article.date}</span> · AndaraLab Research
              </div>
              <Link
                href={article.categoryHref}
                className="inline-flex items-center gap-2 text-[12.5px] font-medium text-white bg-[#1a3a5c] px-4 py-2 hover:bg-[#14305a] transition-colors"
              >
                {locale === "id" ? "Selengkapnya di" : "More in"} {locale === "id" ? (article.tagId ?? article.tag) : article.category} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-[6rem]">
              {related.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    Related Articles
                  </div>
                  <div className="space-y-0 border border-[#E5E7EB]">
                    {related.map((r, i) => (
                      <Link
                        key={r.slug}
                        href={`/article/${r.slug}`}
                        className={`block p-4 group hover:bg-gray-50 transition-colors ${i < related.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[10px] font-semibold text-[#1a3a5c] bg-blue-50 px-1.5 py-0.5 uppercase tracking-wide">
                            {r.tag}
                          </span>
                          <span className="text-[10.5px] text-gray-400">{r.readTime}</span>
                        </div>
                        <h4 className="text-[13px] font-medium text-gray-900 leading-snug group-hover:text-[#1a3a5c] transition-colors">
                          {r.title}
                        </h4>
                        <p className="text-[11.5px] text-gray-400 mt-1">{r.date}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 border border-[#E5E7EB] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  About This Research
                </div>
                <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">
                  AndaraLab produces independent economic research for Indonesia and emerging markets. Our analysis is based on publicly available data and our own proprietary models.
                </p>
                <Link
                  href="/about"
                  className="text-[12px] font-medium text-[#1a3a5c] hover:underline flex items-center gap-1"
                >
                  About AndaraLab <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="mt-4 border border-[#E5E7EB] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Data Hub
                </div>
                <p className="text-[12.5px] text-gray-500 mb-3">
                  Explore interactive charts and economic data behind this analysis.
                </p>
                <Link
                  href="/data"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#1a3a5c] px-3 py-1.5 hover:bg-[#14305a] transition-colors"
                >
                  Open Data Hub <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
