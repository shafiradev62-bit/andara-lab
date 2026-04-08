import json
import random

categories = [
    "Macro Foundations",
    "Sectoral Intelligence",
    "Market Dashboard",
    "Financial Markets"
]

sub_topics = {
    "Macro Foundations": ["Annual GDP Growth", "CPI Inflation Rate", "Foreign Direct Investment", "Government Debt to GDP", "Fiscal Deficit", "Reserve Assets", "M2 Money Supply Growth", "Current Account Balance", "Consumer Spending", "Gini Coefficient"],
    "Sectoral Intelligence": ["Palm Oil Exports", "Coal Production Volume", "Nickel Smelter Output", "Manufacturing PMI", "Rice Production", "Automotive Sales", "Tourism Arrivals", "Cement Consumption", "Copper Ore Production", "Digital Services Revenue"],
    "Market Dashboard": ["USD/IDR Exchange Rate", "EUR/IDR Stability", "Consumer Confidence Index", "Retail Sales Growth", "Business Expectations Survey", "Google Trends: Economy", "Electricity Consumption", "Property Price Index", "E-commerce GMV", "Mobile Phone Penetration"],
    "Financial Markets": ["10Y SBN Yield", "IHSG (JCI) Index", "Banking Loan Growth", "LDR Ratio", "Net Interest Margin", "Corporate Bond Issuance", "Daily Equity Turnover", "Insurance Assets", "Crypto Adoption Rate", "Credit Default Swaps"]
}

datasets = []

for cat in categories:
    topics = sub_topics[cat]
    for topic in topics:
        years = [f"202{i}" for i in range(5)]
        rows = []
        for y in years:
            rows.append({"Tahun": y, "Value": round(random.uniform(2.0, 10.0), 2)})
        
        datasets.append({
            "title": f"Laporan {topic} Indonesia",
            "description": f"Data historis dan proyeksi untuk {topic} di Indonesia.",
            "category": cat,
            "chartType": random.choice(["line", "bar", "area"]),
            "color": "#1a3a5c",
            "unit": "%" if "Rate" in topic or "Growth" in topic else "Units",
            "columns": ["Tahun", "Value"],
            "rows": rows
        })

print(json.dumps(datasets, indent=2))
