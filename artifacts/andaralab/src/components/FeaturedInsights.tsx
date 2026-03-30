import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const insights = [
  {
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    title: "Indonesia's GDP Growth: Resilience Amid Global Headwinds",
    category: "Macro",
    date: "March 26, 2026",
    description:
      "Indonesia maintains its 5% growth trajectory despite global trade tensions, supported by strong domestic consumption and commodity exports.",
    href: "/macro/macro-outlooks",
  },
  {
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    title: "Bank Indonesia Holds Rate at 6.00% — What's Next?",
    category: "Monetary",
    date: "March 20, 2026",
    description:
      "BI's decision to hold rates signals a cautious easing bias. We analyze the inflation and FX dynamics guiding the central bank's next moves.",
    href: "/macro/policy-monetary",
  },
  {
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    title: "Nickel & Battery Supply Chain: Indonesia's EV Opportunity",
    category: "Sectoral",
    date: "March 15, 2026",
    description:
      "With 40% of global nickel reserves, Indonesia is positioning itself as a pivotal player in the global EV battery supply chain.",
    href: "/sectoral/deep-dives",
  },
];

export default function FeaturedInsights() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-semibold text-gray-900">Featured Insights</h2>
          <Link href="/macro/macro-outlooks" className="text-[12.5px] font-medium text-[#1a3a5c] hover:underline flex items-center gap-1">
            All research <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="border border-[#E5E7EB] flex flex-col hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="h-[155px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-medium text-[#1a3a5c] bg-blue-50 px-1.5 py-0.5">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                </div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-2 leading-snug group-hover:text-[#1a3a5c] transition-colors">
                  {item.title}
                </h3>
                <div className="h-px bg-[#E5E7EB] mb-3" />
                <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1 mb-3">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-gray-700 group-hover:text-[#1a3a5c] transition-colors">
                  Read More
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
