import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "wouter";

const metrics = [
  {
    label: "GDP Growth",
    value: "5.02%",
    sub: "Indonesia Q4 2024",
    change: "+0.08pp",
    up: true,
    href: "/macro/macro-outlooks",
    sparkColor: "#1a3a5c",
    spark: [4.94, 4.98, 5.03, 5.17, 4.94, 5.04, 5.11, 5.02],
  },
  {
    label: "Inflation (CPI)",
    value: "2.51%",
    sub: "Indonesia Aug 2024",
    change: "-0.01pp",
    up: true,
    href: "/macro/policy-monetary",
    sparkColor: "#e67e22",
    spark: [2.57, 2.75, 3.05, 3.0, 2.84, 2.51, 2.13, 2.12],
  },
  {
    label: "BI Rate",
    value: "6.00%",
    sub: "Unchanged",
    change: "0.00pp",
    up: null,
    href: "/macro/policy-monetary",
    sparkColor: "#2ecc71",
    spark: [5.75, 5.75, 5.75, 6.0, 6.0, 6.25, 6.25, 6.0],
  },
  {
    label: "IDR/USD",
    value: "15,890",
    sub: "Spot rate",
    change: "+0.32%",
    up: false,
    href: "/data/market-dashboard",
    sparkColor: "#e74c3c",
    spark: [15620, 15680, 15721, 16100, 16015, 16373, 16200, 15890],
  },
  {
    label: "Trade Balance",
    value: "+$2.3B",
    sub: "Jun 2024",
    change: "-0.3B",
    up: false,
    href: "/sectoral/deep-dives",
    sparkColor: "#9b59b6",
    spark: [2.4, 1.5, 2.6, 2.6, 2.6, 2.3, 2.1, 2.3],
  },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KeyMetrics() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-0">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-[#F3F4F6]">
          {metrics.map((m, i) => (
            <Link
              key={i}
              href={m.href}
              className="px-4 py-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="min-w-0">
                <div className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5 truncate">
                  {m.label}
                </div>
                <div className="text-[18px] font-bold text-gray-900 leading-tight">{m.value}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  {m.up === null ? (
                    <Minus className="w-3 h-3 text-gray-400" />
                  ) : m.up ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-[10.5px] font-semibold ${
                      m.up === null ? "text-gray-400" : m.up ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {m.change}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">{m.sub}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <MiniSparkline data={m.spark} color={m.sparkColor} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
