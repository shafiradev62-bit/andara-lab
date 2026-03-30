import { ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

interface Article {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  href: string;
  image?: string;
}

interface Props {
  section: string;
  breadcrumb: string;
  breadcrumbHref: string;
  description: string;
  articles: Article[];
}

export default function SectionPage({ section, breadcrumb, breadcrumbHref, description, articles }: Props) {
  return (
    <div className="bg-white">
      <section className="border-b border-[#E5E7EB] py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1a3a5c] mb-3">
            {breadcrumb}
          </div>
          <h1 className="text-[34px] font-bold text-gray-900 mb-3">{section}</h1>
          <p className="text-[14.5px] text-gray-500 max-w-[560px]">{description}</p>
        </div>
      </section>
      <section className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, i) => (
            <Link
              key={i}
              href={article.href}
              className={`border border-[#E5E7EB] hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group ${i === 0 ? "md:col-span-2" : ""}`}
            >
              {article.image && i === 0 && (
                <div className="h-[220px] overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#1a3a5c] bg-blue-50 px-2 py-0.5">
                    <Tag className="w-3 h-3" />{article.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />{article.readTime}
                  </span>
                  <span className="text-[11px] text-gray-400">{article.date}</span>
                </div>
                <h2 className={`font-semibold text-gray-900 mb-2 leading-snug group-hover:text-[#1a3a5c] transition-colors ${i === 0 ? "text-[20px]" : "text-[15px]"}`}>
                  {article.title}
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{article.excerpt}</p>
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

const macroBase = "/macro/macro-outlooks";
const macroArticles = (tag: string): Article[] => [
  {
    title: "Indonesia's Macro Outlook: Navigating Global Headwinds in 2026",
    excerpt: "With global growth slowing and trade tensions escalating, Indonesia's macroeconomic fundamentals remain resilient, supported by strong domestic consumption and a commodity export cushion.",
    date: "March 26, 2026", readTime: "8 min read", tag, href: macroBase,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
  },
  {
    title: "Bank Indonesia Rate Policy: What's Next After the Hold?",
    excerpt: "After keeping rates at 6.00% for the third consecutive meeting, BI signals a potential cut window in H2 2026 if inflation stays benign.",
    date: "March 18, 2026", readTime: "5 min read", tag, href: macroBase,
  },
  {
    title: "Fiscal Consolidation & Budget Deficit: Indonesia's Path to B3 Ratio",
    excerpt: "The government's 2026 budget targets a deficit at 2.5% of GDP, a strategic step toward the B3 threshold while maintaining growth-supportive spending.",
    date: "March 10, 2026", readTime: "6 min read", tag, href: macroBase,
  },
  {
    title: "Current Account Balance: Surplus Narrowing as Imports Recover",
    excerpt: "Indonesia's current account returned to a slight deficit in Q4 2025, as capital goods imports surged amid infrastructure investment acceleration.",
    date: "February 28, 2026", readTime: "4 min read", tag, href: macroBase,
  },
];

export function MacroOutlooksPage() {
  return <SectionPage section="Macro Outlooks" breadcrumb="Macro Foundations" breadcrumbHref="/macro/macro-outlooks" description="In-depth analysis of Indonesia's macroeconomic trends, growth drivers, and risks." articles={macroArticles("Macro")} />;
}

export function PolicyMonetaryPage() {
  return <SectionPage section="Policy & Monetary Watch" breadcrumb="Macro Foundations" breadcrumbHref="/macro/macro-outlooks" description="Tracking Bank Indonesia policy, monetary conditions, and fiscal developments." articles={macroArticles("Monetary")} />;
}

export function GeopoliticalPage() {
  return <SectionPage section="Geopolitical & Structural Analysis" breadcrumb="Macro Foundations" breadcrumbHref="/macro/macro-outlooks" description="Analyzing geopolitical dynamics and structural shifts affecting Indonesia and the region." articles={macroArticles("Geopolitical")} />;
}

export function DeepDivesPage() {
  return (
    <SectionPage
      section="Strategic Industry Deep-dives"
      breadcrumb="Sectoral Intelligence"
      breadcrumbHref="/sectoral/deep-dives"
      description="Rigorous sector-level analysis of Indonesia's key industries and their strategic outlook."
      articles={[
        {
          title: "Nickel & Battery Supply Chain: Indonesia's EV Ambitions",
          excerpt: "Indonesia controls over 40% of global nickel reserves. We analyze how the country is positioning itself as the epicenter of the global EV battery supply chain, and the policy levers driving this transformation.",
          date: "March 22, 2026", readTime: "10 min read", tag: "Sectoral", href: "/sectoral/deep-dives",
          image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900&q=80",
        },
        { title: "Palm Oil Sector: Pricing Dynamics & ESG Headwinds", excerpt: "Despite price normalization, the palm oil sector faces mounting ESG pressure from European import regulations and sustainability certification requirements.", date: "March 15, 2026", readTime: "7 min read", tag: "Sectoral", href: "/sectoral/deep-dives" },
        { title: "Digital Economy: The $130B Opportunity", excerpt: "Indonesia's digital economy is set to reach $130B by 2028. We examine the sectors driving growth and where capital is flowing.", date: "March 8, 2026", readTime: "6 min read", tag: "Tech", href: "/sectoral/deep-dives" },
        { title: "Banking Sector: Credit Growth & NPL Risks", excerpt: "Indonesian banks show strong credit growth at 10-12% YoY, but rising consumer NPLs in the MSME segment warrant close monitoring.", date: "March 1, 2026", readTime: "5 min read", tag: "Finance", href: "/sectoral/deep-dives" },
      ]}
    />
  );
}

export function RegionalPage() {
  return (
    <SectionPage
      section="Regional Economic Monitor"
      breadcrumb="Sectoral Intelligence"
      breadcrumbHref="/sectoral/deep-dives"
      description="Monitoring regional economic performance across Java, Sumatra, Kalimantan, and beyond."
      articles={[
        { title: "Java Economic Corridor: Growth Concentration & Disparity", excerpt: "Over 58% of Indonesia's GDP is generated in Java. We assess spillover effects and the role of new capital Nusantara in redistributing economic activity.", date: "March 20, 2026", readTime: "8 min read", tag: "Regional", href: "/sectoral/regional", image: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=900&q=80" },
        { title: "Kalimantan: Beyond the Capital City — Investment Momentum", excerpt: "IKN continues to attract investment despite logistical challenges. We map the real estate, infrastructure, and services opportunities emerging in the region.", date: "March 12, 2026", readTime: "6 min read", tag: "Regional", href: "/sectoral/regional" },
        { title: "Sumatra Connectivity: Trade Flows & Infrastructure Gap", excerpt: "Sumatra remains underserved by transport infrastructure relative to its economic potential. New toll roads are changing the calculus.", date: "March 5, 2026", readTime: "5 min read", tag: "Regional", href: "/sectoral/regional" },
      ]}
    />
  );
}

export function ESGPage() {
  return (
    <SectionPage
      section="ESG"
      breadcrumb="Sectoral Intelligence"
      breadcrumbHref="/sectoral/deep-dives"
      description="Environmental, social, and governance analysis for Indonesian corporations and investors."
      articles={[
        { title: "Indonesia's Green Bond Market: Growth & Credibility Challenges", excerpt: "The Indonesian green bond market grew 45% in 2025, but greenwashing concerns persist. We assess the regulatory landscape and best practices.", date: "March 25, 2026", readTime: "7 min read", tag: "ESG", href: "/sectoral/esg", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80" },
        { title: "Corporate Governance Reform: Impact on Foreign Investment", excerpt: "New OJK governance regulations are strengthening transparency requirements for listed companies, with significant implications for foreign investor confidence.", date: "March 17, 2026", readTime: "6 min read", tag: "Governance", href: "/sectoral/esg" },
        { title: "Just Energy Transition: Indonesia's Coal Exit Timeline", excerpt: "Under JETP commitments, Indonesia targets coal phase-out by 2050. We model the economic impact and investment requirements.", date: "March 9, 2026", readTime: "8 min read", tag: "Energy", href: "/sectoral/esg" },
      ]}
    />
  );
}

export function BlogPage({ sub }: { sub: "economics-101" | "market-pulse" | "lab-notes" }) {
  const configs = {
    "economics-101": { title: "Economics 101", desc: "Foundational economic concepts explained clearly for non-specialists.", tag: "Education", href: "/blog/economics-101" },
    "market-pulse": { title: "Market Pulse", desc: "Breaking market news and rapid-response analysis.", tag: "News", href: "/blog/market-pulse" },
    "lab-notes": { title: "Lab Notes", desc: "Behind-the-scenes insights from our research team.", tag: "Lab Notes", href: "/blog/lab-notes" },
  };
  const c = configs[sub];
  return (
    <SectionPage
      section={c.title}
      breadcrumb="Blog"
      breadcrumbHref={c.href}
      description={c.desc}
      articles={[
        { title: "What Is the Current Account Deficit (and Why Does It Matter)?", excerpt: "Many people confuse trade balance with current account. Here's a clear breakdown of what each metric measures and why Indonesia's current account matters for your portfolio.", date: "March 24, 2026", readTime: "5 min read", tag: c.tag, href: c.href, image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80" },
        { title: "Understanding Inflation: CPI vs Core Inflation", excerpt: "CPI and core inflation tell different stories. Learn which one the central bank cares about most and why.", date: "March 17, 2026", readTime: "4 min read", tag: c.tag, href: c.href },
        { title: "FX Reserves: Indonesia's Buffer Against External Shocks", excerpt: "With $150B in reserves, Indonesia is relatively well-cushioned. But what constitutes 'adequate' reserves? We explain.", date: "March 10, 2026", readTime: "5 min read", tag: c.tag, href: c.href },
        { title: "Interest Rate Cycles: How BI Moves Affect Your Investments", excerpt: "Rising rates compress bond prices but boost savings yields. Here's the full picture of rate cycle effects across asset classes.", date: "March 3, 2026", readTime: "6 min read", tag: c.tag, href: c.href },
      ]}
    />
  );
}
