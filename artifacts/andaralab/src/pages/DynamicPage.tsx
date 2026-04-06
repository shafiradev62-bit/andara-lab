import { useEffect } from "react";
import { ArrowRight, BarChart2, Clock, Tag, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { usePageBySlug, useDatasets, usePosts } from "@/lib/cms-store";
import type { ContentSection } from "@/lib/cms-store";
import InteractiveChart from "@/components/InteractiveChart";
import { useLocale } from "@/lib/locale";
import { RESEARCH_TAG_PILL } from "@/lib/research-tag-styles";
import { applyDocumentSeo, seoFromCmsPage } from "@/lib/document-meta";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function HeroSection({ headline, subheadline, ctaText, ctaHref }: any) {
  return (
    <section className="border-b border-[#E5E7EB] py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[720px]">
          <h1 className="text-[38px] font-bold text-gray-900 leading-tight mb-4">{headline}</h1>
          {subheadline && <p className="text-[16px] text-gray-500 leading-relaxed mb-6">{subheadline}</p>}
          {ctaText && ctaHref && (
            <Link href={ctaHref} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white bg-[#1a3a5c] px-5 py-2.5 hover:bg-[#14305a]">
              {ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function TextSection({ content }: any) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      <p className="text-[15px] text-gray-600 leading-[1.8] max-w-[720px]">{content}</p>
    </section>
  );
}

function StatsSection({ items }: any) {
  const list = Array.isArray(items) ? items : [];
  return (
    <section className="bg-gray-50 border-y border-[#E5E7EB] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {list.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-[28px] font-bold text-gray-900 mb-1">
                {item.value}{item.unit && <span className="text-[16px] font-normal text-gray-500 ml-1">{item.unit}</span>}
              </div>
              <div className="text-[12px] text-gray-400 uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ heading, body, buttonText, buttonHref }: any) {
  return (
    <section className="bg-[#1a3a5c] py-12">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <div>
          <h3 className="text-[20px] font-semibold text-white mb-2">{heading}</h3>
          <p className="text-[14px] text-gray-300">{body}</p>
        </div>
        <Link href={buttonHref} className="flex-shrink-0 inline-flex items-center gap-2 text-[13px] font-medium text-[#1a3a5c] bg-white px-5 py-2.5 hover:bg-gray-100">
          {buttonText} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function DividerSection() {
  return <div className="border-t border-[#E5E7EB] my-2 max-w-[1200px] mx-auto px-6" />;
}

function FeaturedSection({ slugs, limit }: any) {
  const { data: allPosts = [] } = usePosts({ status: "published" });
  const raw = Array.isArray(slugs) ? slugs : [];
  const targetSlugs: string[] = limit ? raw.slice(0, limit) : raw;
  // Match by slug from CMS posts, fallback to first N published posts if slugs not found
  const matched = targetSlugs
    .map((s: string) => allPosts.find((p) => p.slug === s))
    .filter(Boolean) as typeof allPosts;
  const items = matched.length > 0 ? matched : allPosts.slice(0, limit ?? 3);
  if (!items.length) return null;
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      <h2 className="text-[18px] font-semibold text-gray-900 mb-6">Featured Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((post, i) => (
          <Link key={post.slug} href={"/article/" + post.slug}
            className={"border border-[#E5E7EB] hover:border-gray-300 hover:shadow-sm transition-all group " + (i === 0 ? "md:col-span-3" : "")}>
            {post.image && <div className="h-[180px] overflow-hidden"><img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {post.tag && <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#1a3a5c] bg-slate-100 px-2 py-0.5"><Tag className="w-3 h-3" />{post.tag}</span>}
                {post.readTime && <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="w-3 h-3" />{post.readTime}</span>}
              </div>
              <h3 className="text-[14px] font-semibold text-gray-900 group-hover:text-[#1a3a5c] transition-colors">{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PostsSection({ categories, title }: { categories: string[]; title?: string }) {
  const { locale } = useLocale();
  const cats = Array.isArray(categories) ? categories : [];
  const { data: allPosts = [], isLoading } = usePosts({ status: "published" });

  const posts = allPosts
    .filter((p) => {
      const matchLocale = p.locale === locale || p.locale === "en";
      const matchCat = cats.some((c) => p.category?.toLowerCase() === c.toLowerCase());
      return matchLocale && matchCat;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      {title && <h2 className="text-[18px] font-semibold text-gray-900 mb-6">{title}</h2>}
      {isLoading && (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-[13.5px]">Loading articles…</span>
        </div>
      )}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-[14px]">No articles match this section yet.</div>
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
                    <span
                      className={`inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 ${
                        RESEARCH_TAG_PILL
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {post.tag}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400">{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <h2
                  className={`font-semibold text-gray-900 mb-2 leading-snug group-hover:text-[#1a3a5c] transition-colors ${
                    i === 0 ? "text-[20px]" : "text-[15px]"
                  }`}
                >
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
  );
}

function ChartSection({ datasetId, title }: any) {
  const { data: datasets = [] } = useDatasets();
  const dataset = datasets.find((d: any) => d.id === datasetId);
  if (!dataset) return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="border border-[#E5E7EB] p-8 text-center text-gray-400 text-[13px]">
        <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
        Dataset not found: {datasetId}
      </div>
    </section>
  );
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10">
      {title && <h2 className="text-[18px] font-semibold text-gray-900 mb-4">{title}</h2>}
      <div className="border border-[#E5E7EB] p-6">
        <InteractiveChart dataset={dataset} height={280} />
      </div>
    </section>
  );
}

function SectionBlock({ section }: { section: ContentSection }) {
  switch (section.type) {
    case "hero":     return <HeroSection {...section} />;
    case "text":     return <TextSection content={section.content} />;
    case "stats":    return <StatsSection items={section.items} />;
    case "cta":      return <CTASection {...section} />;
    case "divider":  return <DividerSection />;
    case "featured": return <FeaturedSection slugs={section.slugs} limit={section.limit} />;
    case "posts":    return <PostsSection categories={section.categories} title={section.title} />;
    case "chart":    return <ChartSection datasetId={section.datasetId} title={section.title} />;
    default:         return null;
  }
}

export default function DynamicPage({ pageSlug, locale }: { pageSlug: string; locale?: "en" | "id" }) {
  const { t } = useLocale();
  const [pathname] = useLocation();
  const { data: page, isLoading, error } = usePageBySlug(pageSlug, locale);

  useEffect(() => {
    if (isLoading) return;
    if (error || !page) {
      applyDocumentSeo({
        title: t("meta_not_found_title"),
        description: t("meta_not_found_description"),
        pathname: pathname || pageSlug,
      });
      return;
    }
    const { title, description } = seoFromCmsPage(page);
    applyDocumentSeo({ title, description, pathname: pathname || page.slug });
  }, [isLoading, error, page, pathname, pageSlug, t]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-500">
      <div>DEBUG SLUG: {pageSlug || "EMPTY"}</div>
      <div>DEBUG IS_LOADING: {String(isLoading)}</div>
      <div>DEBUG ERROR: {error ? String(error) : "NONE"}</div>
      <div className="flex items-center gap-3 text-gray-400 mt-4">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <span className="text-[13px]">Loading</span>
      </div>
    </div>
  );

  if (error || !page) {
    const apiDetail = error && typeof error === "object" && error instanceof Error
      ? (error as Error & { apiDetail?: string }).apiDetail
      : undefined;
    const hint =
      apiDetail ||
      (locale === "id"
        ? "Halaman tidak ada atau belum dipublikasikan (masih Draft di CMS)."
        : "This page does not exist or is still a draft in the CMS.");
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <div className="text-[60px] font-bold text-gray-100 mb-4">404</div>
        <h1 className="text-[22px] font-semibold text-gray-900 mb-3">
          {locale === "id" ? "Halaman tidak ditemukan" : "Page not found"}
        </h1>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">{hint}</p>
        <Link href="/" className="text-[13px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5 hover:bg-[#14305a]">
          {locale === "id" ? "Ke beranda" : "Go Home"}
        </Link>
      </div>
    );
  }

  const blocks = Array.isArray(page.content) ? page.content : [];

  return (
    <>
      {blocks.length === 0 ? (
        <>
          <HeroSection 
            headline={page.title || "Untitled Page"} 
            subheadline={page.description || "This page has been created but no content blocks have been added yet."} 
          />
          <div className="max-w-[1200px] mx-auto px-6 py-16 text-center text-gray-400">
            <p className="text-[14px]">You can structure this page using JSON blocks via the CMS API.</p>
          </div>
        </>
      ) : (
        blocks.map((section: ContentSection, i: number) => (
          <SectionBlock key={`${section.type}-${i}`} section={section} />
        ))
      )}
    </>
  );
}
