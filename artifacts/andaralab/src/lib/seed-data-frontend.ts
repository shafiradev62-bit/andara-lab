// Seed data for frontend fallback when API is not available (e.g., Vercel production)
// This matches the backend seed-data.ts

import type { ChartDataset, Page, BlogPost, ContentSection } from "./cms-store";

export const SEED_DATASETS: ChartDataset[] = [
  {
    id: "oil-gas-production",
    title: "Produksi Minyak Bumi & Gas Alam",
    description: "Produksi minyak mentah, kondensat, dan gas alam Indonesia 1996–2024 (ribuan barel & MMscf)",
    category: "Sectoral Intelligence",
    chartType: "line",
    color: "#0d7377",
    unit: "000 Barel / MMscf",
    chartTitle: "Produksi Minyak Bumi & Gas Alam Indonesia",
    xAxisLabel: "Tahun",
    yAxisLabel: "Volume (000 Barel & MMscf)",
    subtitle: "Sumber: SKK Migas / Ministry of Energy and Mineral Resources",
    columns: ["Tahun", "Minyak & Kondensat (000 Barel)", "Gas Alam (MMscf)"],
    rows: [
      { Tahun: "1996", "Minyak & Kondensat (000 Barel)": 548648.3,  "Gas Alam (MMscf)": 3164016.2 },
      { Tahun: "1997", "Minyak & Kondensat (000 Barel)": 543752.6,  "Gas Alam (MMscf)": 3166034.9 },
      { Tahun: "1998", "Minyak & Kondensat (000 Barel)": 534892.0,   "Gas Alam (MMscf)": 2978851.9 },
      { Tahun: "1999", "Minyak & Kondensat (000 Barel)": 494643.0,   "Gas Alam (MMscf)": 3068349.1 },
      { Tahun: "2000", "Minyak & Kondensat (000 Barel)": 484393.3,   "Gas Alam (MMscf)": 2845532.9 },
      { Tahun: "2001", "Minyak & Kondensat (000 Barel)": 480116.1,   "Gas Alam (MMscf)": 3762828.5 },
      { Tahun: "2002", "Minyak & Kondensat (000 Barel)": 397308.5,   "Gas Alam (MMscf)": 2279373.9 },
      { Tahun: "2003", "Minyak & Kondensat (000 Barel)": 383700.0,   "Gas Alam (MMscf)": 2142605.0 },
      { Tahun: "2004", "Minyak & Kondensat (000 Barel)": 404992.9,   "Gas Alam (MMscf)": 3026069.3 },
      { Tahun: "2005", "Minyak & Kondensat (000 Barel)": 387653.5,   "Gas Alam (MMscf)": 2985341.0 },
      { Tahun: "2006", "Minyak & Kondensat (000 Barel)": 357477.4,   "Gas Alam (MMscf)": 2948021.6 },
      { Tahun: "2007", "Minyak & Kondensat (000 Barel)": 348348.0,   "Gas Alam (MMscf)": 2805540.3 },
      { Tahun: "2008", "Minyak & Kondensat (000 Barel)": 358718.7,   "Gas Alam (MMscf)": 2790988.0 },
      { Tahun: "2009", "Minyak & Kondensat (000 Barel)": 346313.0,   "Gas Alam (MMscf)": 2887892.2 },
      { Tahun: "2010", "Minyak & Kondensat (000 Barel)": 344888.0,   "Gas Alam (MMscf)": 3407592.3 },
      { Tahun: "2011", "Minyak & Kondensat (000 Barel)": 329249.3,   "Gas Alam (MMscf)": 3256378.9 },
      { Tahun: "2012", "Minyak & Kondensat (000 Barel)": 314665.9,   "Gas Alam (MMscf)": 2982753.5 },
      { Tahun: "2013", "Minyak & Kondensat (000 Barel)": 301191.9,   "Gas Alam (MMscf)": 2969210.8 },
      { Tahun: "2014", "Minyak & Kondensat (000 Barel)": 287902.2,   "Gas Alam (MMscf)": 2999524.4 },
      { Tahun: "2015", "Minyak & Kondensat (000 Barel)": 286814.2,   "Gas Alam (MMscf)": 2948365.8 },
      { Tahun: "2017", "Minyak & Kondensat (000 Barel)": 292373.8,   "Gas Alam (MMscf)": 2781154.0 },
      { Tahun: "2018", "Minyak & Kondensat (000 Barel)": 281826.61, "Gas Alam (MMscf)": 2833783.51 },
      { Tahun: "2019", "Minyak & Kondensat (000 Barel)": 273494.8,  "Gas Alam (MMscf)": 2647985.9 },
      { Tahun: "2020", "Minyak & Kondensat (000 Barel)": 259246.8,  "Gas Alam (MMscf)": 2442830.7 },
      { Tahun: "2021", "Minyak & Kondensat (000 Barel)": 240324.5,  "Gas Alam (MMscf)": 2433364.0 },
      { Tahun: "2022", "Minyak & Kondensat (000 Barel)": 223532.5,  "Gas Alam (MMscf)": 1962929.0 },
      { Tahun: "2023", "Minyak & Kondensat (000 Barel)": 221088.9,  "Gas Alam (MMscf)": 2420059.5 },
      { Tahun: "2024*", "Minyak & Kondensat (000 Barel)": 211756.18, "Gas Alam (MMscf)": 2483498.15 },
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gdp-growth",
    title: "Indonesia GDP Growth Rate",
    description: "Quarterly GDP growth rate year-over-year (%)",
    category: "Macro Foundations",
    chartType: "line",
    color: "#1a3a5c",
    unit: "%",
    chartTitle: "PDB Indonesia — Pertumbuhan Kuartalan (YoY %)",
    xAxisLabel: "Kuartal",
    yAxisLabel: "Pertumbuhan (%)",
    subtitle: "Sumber: BPS Indonesia",
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
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: "inflation-rate",
    title: "Indonesia Inflation Rate",
    description: "Monthly consumer price index inflation (%)",
    category: "Macro Foundations",
    chartType: "area",
    color: "#e67e22",
    unit: "%",
    chartTitle: "Inflasi IHK Indonesia (YoY %)",
    xAxisLabel: "Bulan",
    yAxisLabel: "Inflasi (%)",
    subtitle: "Sumber: BPS Indonesia",
    columns: ["Month", "Inflation"],
    rows: [
      { Month: "Jan 2024", Inflation: 2.57 },
      { Month: "Feb 2024", Inflation: 2.75 },
      { Month: "Mar 2024", Inflation: 3.05 },
      { Month: "Apr 2024", Inflation: 3.00 },
      { Month: "May 2024", Inflation: 3.42 },
      { Month: "Jun 2024", Inflation: 3.00 },
      { Month: "Jul 2024", Inflation: 2.90 },
      { Month: "Aug 2024", Inflation: 2.12 },
      { Month: "Sep 2024", Inflation: 2.12 },
      { Month: "Oct 2024", Inflation: 1.71 },
      { Month: "Nov 2024", Inflation: 1.55 },
      { Month: "Dec 2024", Inflation: 1.58 },
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-12-15T00:00:00.000Z",
  },
];

export const SEED_PAGES: Page[] = [
  {
    id: 1,
    slug: "/about",
    locale: "en",
    status: "published",
    title: "About AndaraLab",
    description: "Leading economic research institution",
    content: [
      { type: "hero", headline: "About AndaraLab", subheadline: "Economic Research & Policy Analysis" },
      { type: "text", content: "AndaraLab is a leading economic research institution focused on Indonesian market analysis and policy insights." },
    ] as ContentSection[],
    navLabel: "About Us",
    section: "root",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    slug: "/about",
    locale: "id",
    status: "published",
    title: "Tentang AndaraLab",
    description: "Institusi riset ekonomi terkemuka",
    content: [
      { type: "hero", headline: "Tentang AndaraLab", subheadline: "Riset Ekonomi & Analisis Kebijakan" },
      { type: "text", content: "AndaraLab adalah institusi riset ekonomi terkemuka yang fokus pada analisis pasar dan kebijakan Indonesia." },
    ] as ContentSection[],
    navLabel: "Tentang Kami",
    section: "root",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const SEED_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "indonesia-economic-outlook-2024",
    locale: "en",
    status: "published",
    title: "Indonesia Economic Outlook 2024",
    excerpt: "Analysis of Indonesia's economic prospects for 2024",
    body: ["Indonesia's economy continues to show resilience...", "Key drivers include domestic consumption and investment..."],
    category: "economics-101",
    tag: "outlook",
    readTime: "5 min read",
    publishedAt: "2024-01-15T00:00:00.000Z",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
];

// Helper functions to manage localStorage
const STORAGE_KEYS = {
  datasets: 'andaralab_datasets',
  pages: 'andaralab_pages',
  posts: 'andaralab_posts',
};

export function getSeedDatasets(): ChartDataset[] {
  const stored = localStorage.getItem(STORAGE_KEYS.datasets);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid data, return seed
    }
  }
  return SEED_DATASETS;
}

export function getSeedPages(): Page[] {
  const stored = localStorage.getItem(STORAGE_KEYS.pages);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid data, return seed
    }
  }
  return SEED_PAGES;
}

export function getSeedPosts(): BlogPost[] {
  const stored = localStorage.getItem(STORAGE_KEYS.posts);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid data, return seed
    }
  }
  return SEED_POSTS;
}

export function saveDatasetsToStorage(datasets: ChartDataset[]) {
  localStorage.setItem(STORAGE_KEYS.datasets, JSON.stringify(datasets));
}

export function savePagesToStorage(pages: Page[]) {
  localStorage.setItem(STORAGE_KEYS.pages, JSON.stringify(pages));
}

export function savePostsToStorage(posts: BlogPost[]) {
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
}

export function resetDatasetsToSeed() {
  saveDatasetsToStorage(SEED_DATASETS);
  return SEED_DATASETS;
}

export function resetPagesToSeed() {
  savePagesToStorage(SEED_PAGES);
  return SEED_PAGES;
}

export function resetPostsToSeed() {
  savePostsToStorage(SEED_POSTS);
  return SEED_POSTS;
}
