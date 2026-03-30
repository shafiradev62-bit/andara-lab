import { ArrowRight } from "lucide-react";

const topThree = [
  {
    id: 1,
    category: "Macro Outlooks",
    date: "March 26, 2026",
    title: "Emerging Market Currency Volatility",
    description:
      "Sapatis noa masting lagemois cabrmcsts, and bing thectiure. Teur updat lcibost.",
    featured: true,
  },
  {
    id: 2,
    category: "Section: Wahatla, Ghanate Flifs",
    date: "March 19, 2026",
    title: "Renewable Energy Investment Trends",
    description:
      "Expanly patton ommemcolic and masting investments of the finoweinthica intemnasas suspect the regoitr of prouval terots.",
    featured: false,
  },
  {
    id: 3,
    category: "Section: Fil Ghchawe Fagto",
    date: "March 17, 2026",
    title: "US-China Trade Tenus Update",
    description:
      "Soghts finnenmide compemtic cLaherbess/trmisting and global mlateas, an glious or mere feal trends.",
    featured: false,
  },
];

const listItems = [
  {
    id: 4,
    category: "Sectoral Intelligence",
    date: "March 24, 2026",
    title: "Updtern mene and gube luergy, and global trends",
    description: "",
  },
  {
    id: 5,
    category: "Geopolitical Analysis",
    date: "March 20, 2026",
    title: "Geopolitical Analysis",
    description:
      "Rentle drrirens on ntessity bates and inflations in satoqed.",
  },
];

export default function LatestInsights() {
  return (
    <section className="py-12 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-8">
          Latest Insights
        </h2>

        {/* Top three grid */}
        <div className="border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 mb-0">
          {topThree.map((item, i) => (
            <div
              key={item.id}
              className={`p-5 flex flex-col ${i < 2 ? "border-b md:border-b-0 md:border-r border-[#E5E7EB]" : ""}`}
            >
              <div className="text-[11px] text-gray-400 mb-1 uppercase tracking-wide font-medium">
                {item.category} &mdash; {item.date}
              </div>
              <h3
                className={`font-semibold text-gray-900 leading-snug mb-2 ${item.featured ? "text-[16px]" : "text-[14px]"}`}
              >
                {item.title}
              </h3>
              {item.featured && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-700 mb-2" />
              )}
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
          ))}
        </div>

        {/* List items */}
        <div className="border-l border-r border-b border-[#E5E7EB]">
          {listItems.map((item) => (
            <div
              key={item.id}
              className="px-5 py-4 border-t border-[#E5E7EB]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="text-[11.5px] font-semibold text-gray-700 mb-0.5">
                    {item.category}{" "}
                    <span className="font-normal text-gray-400">&mdash; {item.date}</span>
                  </div>
                  {item.description && (
                    <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[12.5px] font-medium text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0 mt-0.5"
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
