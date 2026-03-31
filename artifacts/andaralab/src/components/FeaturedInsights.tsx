import { ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

const insights = [
  {
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85",
    title: "Indonesia's GDP Growth: Resilience Amid Global Headwinds in 2026",
    category: "Macro",
    categoryHref: "/macro/macro-outlooks",
    date: "March 26, 2026",
    readTime: "8 min",
    description:
      "Indonesia maintains its 5% growth trajectory despite global trade tensions, supported by strong domestic consumption and commodity exports. We model three scenarios for H1 2026.",
    href: "/macro/macro-outlooks",
    featured: true,
  },
  {
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    title: "Bank Indonesia Holds Rate at 6.00% — What's Next?",
    category: "Monetary",
    categoryHref: "/macro/policy-monetary",
    date: "March 20, 2026",
    readTime: "5 min",
    description:
      "BI's decision to hold rates signals a cautious easing bias. We analyze the inflation and FX dynamics guiding the central bank's next moves.",
    href: "/macro/policy-monetary",
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    title: "Nickel & Battery Supply Chain: Indonesia's EV Opportunity",
    category: "Sectoral",
    categoryHref: "/sectoral/deep-dives",
    date: "March 15, 2026",
    readTime: "10 min",
    description:
      "With 40% of global nickel reserves, Indonesia is positioning itself as a pivotal player in the global EV battery supply chain.",
    href: "/sectoral/deep-dives",
    featured: false,
  },
];

export default function FeaturedInsights() {
  const [hero, ...rest] = insights;
  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-semibold text-gray-900">Featured Insights</h2>
          <Link href="/macro/macro-outlooks" className="text-[12.5px] font-medium text-[#1a3a5c] hover:underline flex items-center gap-1">
            All research <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#E5E7EB]">
          {/* Hero article */}
          <Link href={hero.href} className="md:col-span-2 border-r border-[#E5E7EB] group flex flex-col">
            <div className="h-[240px] overflow-hidden flex-shrink-0">
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[11px] font-semibold text-[#1a3a5c] bg-blue-50 px-2 py-0.5 uppercase tracking-wide">
                  {hero.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3" />{hero.readTime}
                </span>
                <span className="text-[11px] text-gray-400">{hero.date}</span>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 leading-snug mb-3 group-hover:text-[#1a3a5c] transition-colors">
                {hero.title}
              </h3>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-4 flex-1">{hero.description}</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a3a5c]">
                Read Analysis <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Side articles */}
          <div className="flex flex-col">
            {rest.map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className={`flex flex-col p-5 flex-1 group hover:bg-gray-50 transition-colors ${i === 0 ? "border-b border-[#E5E7EB]" : ""}`}
              >
                <div className="h-[120px] overflow-hidden mb-4 flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10.5px] font-semibold text-[#1a3a5c] bg-blue-50 px-1.5 py-0.5 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />{item.readTime}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#1a3a5c] transition-colors flex-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                  <span className="text-[12px] font-medium text-gray-600 group-hover:text-[#1a3a5c] transition-colors flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
