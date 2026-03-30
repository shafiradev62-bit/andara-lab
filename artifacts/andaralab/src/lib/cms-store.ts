export interface ChartDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  chartType: "line" | "bar" | "area";
  color: string;
  unit: string;
  columns: string[];
  rows: Record<string, string | number>[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "andaralab_cms_datasets";

const defaultDatasets: ChartDataset[] = [
  {
    id: "gdp-growth",
    title: "Indonesia GDP Growth Rate",
    description: "Quarterly GDP growth rate year-over-year (%)",
    category: "Macro Foundations",
    chartType: "line",
    color: "#1a3a5c",
    unit: "%",
    columns: ["Quarter", "GDP Growth", "Forecast"],
    rows: [
      { Quarter: "Q1 2023", "GDP Growth": 5.03, Forecast: 5.1 },
      { Quarter: "Q2 2023", "GDP Growth": 5.17, Forecast: 5.2 },
      { Quarter: "Q3 2023", "GDP Growth": 4.94, Forecast: 5.0 },
      { Quarter: "Q4 2023", "GDP Growth": 5.04, Forecast: 5.0 },
      { Quarter: "Q1 2024", "GDP Growth": 5.11, Forecast: 5.1 },
      { Quarter: "Q2 2024", "GDP Growth": 5.05, Forecast: 5.1 },
      { Quarter: "Q3 2024", "GDP Growth": 4.95, Forecast: 5.0 },
      { Quarter: "Q4 2024", "GDP Growth": 5.02, Forecast: 5.0 },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-12-01",
  },
  {
    id: "inflation-rate",
    title: "Indonesia Inflation Rate",
    description: "Monthly consumer price index inflation (%)",
    category: "Macro Foundations",
    chartType: "area",
    color: "#e67e22",
    unit: "%",
    columns: ["Month", "CPI Inflation", "Core Inflation"],
    rows: [
      { Month: "Jan 2024", "CPI Inflation": 2.57, "Core Inflation": 1.8 },
      { Month: "Feb 2024", "CPI Inflation": 2.75, "Core Inflation": 1.9 },
      { Month: "Mar 2024", "CPI Inflation": 3.05, "Core Inflation": 1.8 },
      { Month: "Apr 2024", "CPI Inflation": 3.0, "Core Inflation": 1.8 },
      { Month: "May 2024", "CPI Inflation": 2.84, "Core Inflation": 1.9 },
      { Month: "Jun 2024", "CPI Inflation": 2.51, "Core Inflation": 1.9 },
      { Month: "Jul 2024", "CPI Inflation": 2.13, "Core Inflation": 1.9 },
      { Month: "Aug 2024", "CPI Inflation": 2.12, "Core Inflation": 2.0 },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-09-01",
  },
  {
    id: "bi-rate",
    title: "Bank Indonesia Policy Rate",
    description: "BI 7-Day Reverse Repo Rate (%)",
    category: "Macro Foundations",
    chartType: "bar",
    color: "#2ecc71",
    unit: "%",
    columns: ["Period", "BI Rate", "US Fed Rate"],
    rows: [
      { Period: "Jan 2023", "BI Rate": 5.75, "US Fed Rate": 4.5 },
      { Period: "Apr 2023", "BI Rate": 5.75, "US Fed Rate": 5.0 },
      { Period: "Jul 2023", "BI Rate": 5.75, "US Fed Rate": 5.25 },
      { Period: "Oct 2023", "BI Rate": 6.0, "US Fed Rate": 5.5 },
      { Period: "Jan 2024", "BI Rate": 6.0, "US Fed Rate": 5.5 },
      { Period: "Apr 2024", "BI Rate": 6.25, "US Fed Rate": 5.5 },
      { Period: "Jul 2024", "BI Rate": 6.25, "US Fed Rate": 5.5 },
      { Period: "Oct 2024", "BI Rate": 6.0, "US Fed Rate": 5.0 },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "trade-balance",
    title: "Indonesia Trade Balance",
    description: "Monthly trade balance in USD Billion",
    category: "Sectoral Intelligence",
    chartType: "bar",
    color: "#9b59b6",
    unit: "USD B",
    columns: ["Month", "Exports", "Imports", "Balance"],
    rows: [
      { Month: "Jan 2024", Exports: 20.5, Imports: 18.1, Balance: 2.4 },
      { Month: "Feb 2024", Exports: 19.3, Imports: 17.8, Balance: 1.5 },
      { Month: "Mar 2024", Exports: 22.1, Imports: 19.5, Balance: 2.6 },
      { Month: "Apr 2024", Exports: 21.5, Imports: 18.9, Balance: 2.6 },
      { Month: "May 2024", Exports: 22.4, Imports: 19.8, Balance: 2.6 },
      { Month: "Jun 2024", Exports: 20.8, Imports: 18.5, Balance: 2.3 },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-07-01",
  },
  {
    id: "idr-usd",
    title: "IDR/USD Exchange Rate",
    description: "Indonesian Rupiah vs US Dollar (monthly average)",
    category: "Market Dashboard",
    chartType: "line",
    color: "#e74c3c",
    unit: "IDR",
    columns: ["Month", "IDR/USD"],
    rows: [
      { Month: "Jan 2024", "IDR/USD": 15620 },
      { Month: "Feb 2024", "IDR/USD": 15680 },
      { Month: "Mar 2024", "IDR/USD": 15721 },
      { Month: "Apr 2024", "IDR/USD": 16100 },
      { Month: "May 2024", "IDR/USD": 16015 },
      { Month: "Jun 2024", "IDR/USD": 16373 },
      { Month: "Jul 2024", "IDR/USD": 16200 },
      { Month: "Aug 2024", "IDR/USD": 15780 },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-09-01",
  },
];

export function loadDatasets(): ChartDataset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDatasets));
    return defaultDatasets;
  } catch {
    return defaultDatasets;
  }
}

export function saveDatasets(datasets: ChartDataset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets));
}

export function saveDataset(dataset: ChartDataset): ChartDataset[] {
  const all = loadDatasets();
  const idx = all.findIndex((d) => d.id === dataset.id);
  if (idx >= 0) all[idx] = dataset;
  else all.push(dataset);
  saveDatasets(all);
  return all;
}

export function deleteDataset(id: string): ChartDataset[] {
  const all = loadDatasets().filter((d) => d.id !== id);
  saveDatasets(all);
  return all;
}

export function getDataset(id: string): ChartDataset | undefined {
  return loadDatasets().find((d) => d.id === id);
}
