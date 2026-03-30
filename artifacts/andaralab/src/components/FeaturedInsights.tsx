import { ArrowRight } from "lucide-react";

const insights = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    title: "Global Recession Risks in 2026",
    category: "Economics",
    date: "March 18, 2021",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac elit metus, at tincidunt lorem. Aenean efficitur the ever erat egestas.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    title: "Indonesia's Inflation Outlook",
    category: "Economics",
    date: "March 16, 2021",
    description:
      "Examining expansion outlook, performance of bands, meanwhile remedies and walkingings lgols.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=600&q=80",
    title: "China's Property Market Update",
    category: "Economics",
    date: "March 16, 2021",
    description:
      "Examining china's vehicle percity and groping wa, mah osis sopioke linore forwente scnerises.",
  },
];

export default function FeaturedInsights() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-8">
          Featured Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((item) => (
            <div
              key={item.id}
              className="border border-[#E5E7EB] flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="h-[155px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium text-[#1a3a5c] bg-blue-50 px-1.5 py-0.5">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                </div>
                <div className="h-px bg-[#E5E7EB] mb-3" />
                <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1 mb-3">
                  {item.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[12.5px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Read More
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
