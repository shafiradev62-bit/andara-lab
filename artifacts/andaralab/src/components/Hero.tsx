import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const HERO_IMAGE = "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1600&q=85";

const gdpData = [
  { q: "Q1'22", v: 5.01 },
  { q: "Q2'22", v: 5.44 },
  { q: "Q3'22", v: 5.72 },
  { q: "Q4'22", v: 5.01 },
  { q: "Q1'23", v: 5.03 },
  { q: "Q2'23", v: 5.17 },
  { q: "Q3'23", v: 4.94 },
  { q: "Q4'23", v: 5.04 },
  { q: "Q1'24", v: 5.11 },
  { q: "Q2'24", v: 5.05 },
  { q: "Q3'24", v: 4.95 },
  { q: "Q4'24", v: 5.02 },
];

function HeroTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded text-white">
      <p className="text-[11px] text-white/60 mb-0.5">{label}</p>
      <p className="text-[14px] font-bold">{payload[0].value}%</p>
    </div>
  );
}

const highlights = [
  { label: "GDP Growth", value: "5.02%", dir: "up" },
  { label: "BI Rate", value: "6.00%", dir: "flat" },
  { label: "Inflation", value: "2.51%", dir: "down" },
];

export default function Hero() {
  return (
    <section className="relative bg-[#0c1e35] overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="City skyline"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c1e35] via-[#0c1e35]/90 to-[#0c1e35]/60" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-widest text-white/40 mb-5 border border-white/15 px-3 py-1.5">
              PT. Andara Investasi Cerdas · Economic Research
            </div>
            <h1 className="text-[34px] md:text-[46px] font-bold text-white leading-[1.1] mb-5 animate-fade-up">
              Decoding Economies,<br />
              <span className="text-[#4d9de0]">Empowering Growth</span>
            </h1>
            <p className="text-[14.5px] text-white/65 leading-relaxed mb-8 max-w-[420px] animate-fade-up animate-fade-up-delay-1">
              AndaraLab transforms Indonesia's complex economic data into
              high-precision strategic intelligence — from macro policy to
              sectoral deep-dives.
            </p>

            {/* Highlights strip */}
            <div className="flex items-center gap-5 mb-8 animate-fade-up animate-fade-up-delay-2">
              {highlights.map((h) => (
                <div key={h.label} className="border-l-2 border-white/20 pl-3">
                  <div className="text-[10px] text-white/40 uppercase tracking-wide">{h.label}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[17px] font-bold text-white">{h.value}</span>
                    <span className={`text-[11px] ${h.dir === "up" ? "text-green-400" : h.dir === "down" ? "text-green-400" : "text-white/40"}`}>
                      {h.dir === "up" ? "▲" : h.dir === "down" ? "▼" : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 animate-fade-up animate-fade-up-delay-3">
              <Link
                href="/macro/macro-outlooks"
                className="inline-flex items-center gap-2 text-white text-[13px] font-semibold bg-[#1a3a5c] border border-[#2a5a8c] px-5 py-2.5 hover:bg-[#234d7a] transition-colors"
              >
                Explore Research
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/data"
                className="inline-flex items-center gap-2 border border-white/25 text-white text-[13px] font-medium px-5 py-2.5 hover:bg-white/8 transition-colors"
              >
                Data Hub
              </Link>
            </div>
          </div>

          {/* Right column: live chart card */}
          <div className="hidden md:block animate-fade-up animate-fade-up-delay-2">
            <div className="bg-white/6 border border-white/12 backdrop-blur-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#4d9de0]" />
                    <span className="text-[13px] font-semibold text-white">Indonesia GDP Growth</span>
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">Year-over-year, quarterly (%)</div>
                </div>
                <div className="text-right">
                  <div className="text-[22px] font-bold text-white">5.02%</div>
                  <div className="text-[11px] text-green-400 font-medium">▲ Q4 2024</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={gdpData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4d9de0" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4d9de0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="q"
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[4.5, 6]}
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<HeroTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#4d9de0"
                    strokeWidth={2}
                    fill="url(#heroGrad)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "#4d9de0" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <span className="text-[11px] text-white/30">Source: BPS Indonesia · AndaraLab</span>
                <Link href="/data" className="text-[11px] text-[#4d9de0] font-medium hover:underline flex items-center gap-1">
                  Full Data Hub <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
