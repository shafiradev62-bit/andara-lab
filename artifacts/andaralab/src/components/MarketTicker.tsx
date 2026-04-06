const tickers = [
  { symbol: "IDR/USD", value: "15,890", change: "+0.32%", up: false },
  { symbol: "JCI", value: "7,214.3", change: "+1.14%", up: true },
  { symbol: "BI Rate", value: "6.00%", change: "Unch", up: null },
  { symbol: "US 10Y", value: "4.28%", change: "-0.05%", up: true },
  { symbol: "Gold", value: "$2,285", change: "+0.63%", up: true },
  { symbol: "Brent", value: "$82.4", change: "+0.78%", up: true },
  { symbol: "EUR/USD", value: "1.0831", change: "-0.15%", up: false },
  { symbol: "DXY", value: "104.2", change: "+0.18%", up: false },
  { symbol: "S&P 500", value: "5,248", change: "+0.52%", up: true },
  { symbol: "Shanghai", value: "3,178", change: "-0.24%", up: false },
  { symbol: "Nikkei", value: "38,820", change: "+0.87%", up: true },
  { symbol: "CPI ID", value: "2.51%", change: "-0.33pp", up: true },
];

const double = [...tickers, ...tickers];

export default function MarketTicker() {
  return (
    <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 flex items-center gap-2 px-3 border-r border-[#E5E7EB] h-full bg-[#F9FAFB] z-10">
        <span className="live-dot w-1.5 h-1.5 rounded-full bg-gray-900 inline-block" />
        <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest">Live</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track">
          {double.map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-5 border-r border-[#F3F4F6] h-8">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                {t.symbol}
              </span>
              <span className="text-[11.5px] font-semibold text-gray-900 whitespace-nowrap">{t.value}</span>
              <span
                className={`text-[10.5px] font-semibold whitespace-nowrap ${
                  t.up === null ? "text-gray-400" : t.up ? "text-green-600" : "text-red-500"
                }`}
              >
                {t.up === null ? t.change : (t.up ? "▲ " : "▼ ") + t.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
