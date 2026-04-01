// Canonical seed data — matches the defaultDatasets in store.ts
// Any change here should be mirrored in the frontend seed (for reset functionality).

// ─── Chart Dataset ─────────────────────────────────────────────────────────────

export interface SeedDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  chartType: "line" | "bar" | "area";
  color: string;
  unit: string;
  // CMS-editable chart display metadata
  chartTitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  subtitle?: string;
  columns: string[];
  rows: Record<string, string | number>[];
  createdAt: string;
  updatedAt: string;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export type ContentSection =
  | { type: "text";      content: string }
  | { type: "hero";      headline: string; subheadline?: string; ctaText?: string; ctaHref?: string }
  | { type: "stats";     items: { label: string; value: string; unit?: string }[] }
  | { type: "featured";  slugs: string[]; limit?: number }
  | { type: "chart";     datasetId: string; title?: string }
  | { type: "cta";       heading: string; body: string; buttonText: string; buttonHref: string }
  | { type: "divider" };

export interface SeedPage {
  slug: string;
  locale: "en" | "id";
  status: "draft" | "published";
  title: string;
  description?: string;
  content: ContentSection[];
  linkedId?: string;
  navLabel?: string;
  section?: string;
}

// ─── Blog Post ─────────────────────────────────────────────────────────────────

export interface SeedBlogPost {
  slug: string;
  locale: "en" | "id";
  status: "draft" | "published";
  title: string;
  excerpt?: string;
  body: string[];
  category: string;
  tag?: string;
  image?: string;
  readTime?: string;
  linkedId?: string;
  publishedAt?: string;
}

// ─── Chart Datasets ─────────────────────────────────────────────────────────────

export const SEED_DATASETS: SeedDataset[] = [
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
      { Tahun: "2024*","Minyak & Kondensat (000 Barel)": 211756.18, "Gas Alam (MMscf)": 2483498.15 },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2026-03-31",
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
    chartTitle: "Inflasi IHK Indonesia (YoY %)",
    xAxisLabel: "Bulan",
    yAxisLabel: "Inflasi (%)",
    subtitle: "Sumber: BPS Indonesia",
    columns: ["Month", "CPI Inflation", "Core Inflation"],
    rows: [
      { Month: "Jan 2024", "CPI Inflation": 2.57, "Core Inflation": 1.8 },
      { Month: "Feb 2024", "CPI Inflation": 2.75, "Core Inflation": 1.9 },
      { Month: "Mar 2024", "CPI Inflation": 3.05, "Core Inflation": 1.8 },
      { Month: "Apr 2024", "CPI Inflation": 3.0,  "Core Inflation": 1.8 },
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
    chartTitle: "Suku Bunga Kebijakan BI vs Fed Funds Rate (%)",
    xAxisLabel: "Periode",
    yAxisLabel: "Suku Bunga (%)",
    subtitle: "Sumber: Bank Indonesia / Federal Reserve",
    columns: ["Period", "BI Rate", "US Fed Rate"],
    rows: [
      { Period: "Jan 2023", "BI Rate": 5.75, "US Fed Rate": 4.5  },
      { Period: "Apr 2023", "BI Rate": 5.75, "US Fed Rate": 5.0  },
      { Period: "Jul 2023", "BI Rate": 5.75, "US Fed Rate": 5.25 },
      { Period: "Oct 2023", "BI Rate": 6.0,  "US Fed Rate": 5.5  },
      { Period: "Jan 2024", "BI Rate": 6.0,  "US Fed Rate": 5.5  },
      { Period: "Apr 2024", "BI Rate": 6.25, "US Fed Rate": 5.5  },
      { Period: "Jul 2024", "BI Rate": 6.25, "US Fed Rate": 5.5  },
      { Period: "Oct 2024", "BI Rate": 6.0,  "US Fed Rate": 5.0  },
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
    chartTitle: "Neraca Perdagangan Indonesia (USD Miliar)",
    xAxisLabel: "Bulan",
    yAxisLabel: "USD Miliar",
    subtitle: "Sumber: BPS Indonesia",
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
    chartTitle: "Kurs IDR/USD (Rata-rata Bulanan)",
    xAxisLabel: "Bulan",
    yAxisLabel: "IDR per USD",
    subtitle: "Sumber: Bank Indonesia",
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

// ─── Pages ─────────────────────────────────────────────────────────────────────

export const SEED_PAGES: SeedPage[] = [
  {
    slug: "/",
    locale: "en",
    status: "published",
    title: "AndaraLab — Independent Economic Research for Indonesia",
    description: "AndaraLab produces independent macroeconomic research, sectoral analysis, and market intelligence for Indonesia and emerging markets.",
    navLabel: "Home",
    section: "root",
    content: [
      {
        type: "hero",
        headline: "Independent Economic Research for Indonesia",
        subheadline: "Rigorous analysis of macroeconomic trends, sectoral dynamics, and market intelligence — for investors, policymakers, and researchers.",
        ctaText: "Explore Research",
        ctaHref: "/macro/macro-outlooks",
      },
      {
        type: "stats",
        items: [
          { label: "Macro Reports", value: "24+" },
          { label: "Sectors Covered", value: "8" },
          { label: "Years of Data", value: "28+" },
          { label: "Research Team", value: "6" },
        ],
      },
      {
        type: "featured",
        slugs: ["indonesia-macro-outlook-2026", "nickel-ev-indonesia", "bi-rate-policy-2026"],
        limit: 3,
      },
      {
        type: "chart",
        datasetId: "gdp-growth",
        title: "GDP Growth Trend",
      },
      {
        type: "cta",
        heading: "Stay ahead of Indonesia's economic landscape",
        body: "Subscribe to receive our latest macro research, sectoral deep-dives, and market intelligence directly to your inbox.",
        buttonText: "Subscribe to Research",
        buttonHref: "/contact",
      },
    ],
  },
  {
    slug: "/",
    locale: "id",
    status: "published",
    title: "AndaraLab — Riset Ekonomi Independen untuk Indonesia",
    description: "AndaraLab memproduksi riset makroekonomi independen, analisis sektoral, dan intelijen pasar untuk Indonesia dan pasar berkembang.",
    navLabel: "Beranda",
    section: "root",
    content: [
      {
        type: "hero",
        headline: "Riset Ekonomi Independen untuk Indonesia",
        subheadline: "Analisis mendalam tentang tren makroekonomi, dinamika sektoral, dan intelijen pasar — untuk investor, pembuat kebijakan, dan peneliti.",
        ctaText: "Jelajahi Riset",
        ctaHref: "/macro/macro-outlooks",
      },
      {
        type: "stats",
        items: [
          { label: "Laporan Makro", value: "24+" },
          { label: "Sektor Tercakup", value: "8" },
          { label: "Tahun Data", value: "28+" },
          { label: "Tim Riset", value: "6" },
        ],
      },
      {
        type: "featured",
        slugs: ["prospeks-makro-indonesia-2026"],
        limit: 3,
      },
      {
        type: "chart",
        datasetId: "gdp-growth",
        title: "Tren Pertumbuhan PDB",
      },
      {
        type: "cta",
        heading: "Kuasai lanskap ekonomi Indonesia",
        body: "Berlangganan untuk menerima riset makro, analisis sektoral, dan intelijen pasar terbaru kami langsung ke kotak masuk Anda.",
        buttonText: "Berlangganan Riset",
        buttonHref: "/contact",
      },
    ],
  },
  {
    slug: "/about",
    locale: "en",
    status: "published",
    title: "About AndaraLab",
    description: "Who we are, our research methodology, and the team behind the analysis.",
    navLabel: "About Us",
    section: "root",
    content: [
      { type: "hero", headline: "Who We Are", subheadline: "Independent. Rigorous. Indonesia-focused." },
      {
        type: "text",
        content: "AndaraLab is an independent economic research firm providing in-depth analysis of Indonesia's macroeconomic environment, sectoral developments, and financial markets. Our work is built on publicly available data, proprietary models, and decades of collective experience across central banking, sovereign wealth management, and international institutions.",
      },
      { type: "stats", items: [{ label: "Founded", value: "2021" }, { label: "Research Coverage", value: "Indonesia" }, { label: "Methodology", value: "Quantitative + Qualitative" }] },
    ],
  },
  {
    slug: "/about",
    locale: "id",
    status: "published",
    title: "Tentang AndaraLab",
    description: "Siapa kami, metodologi riset kami, dan tim di balik analisis.",
    navLabel: "Tentang Kami",
    section: "root",
    content: [
      { type: "hero", headline: "Siapa Kami", subheadline: "Independen. Ketat. Berfokus pada Indonesia." },
      {
        type: "text",
        content: "AndaraLab adalah firma riset ekonomi independen yang menyediakan analisis mendalam tentang lingkungan makroekonomi Indonesia, perkembangan sektoral, dan pasar keuangan.",
      },
    ],
  },
  {
    slug: "/macro/macro-outlooks",
    locale: "en",
    status: "published",
    title: "Macro Outlooks",
    description: "In-depth analysis of Indonesia's macroeconomic trends, growth drivers, and risks.",
    navLabel: "Macro Outlooks",
    section: "Macro Foundations",
    content: [
      { type: "text", content: "Our Macro Outlooks series provides quarterly and annual assessments of Indonesia's macroeconomic environment." },
      { type: "featured", slugs: ["indonesia-macro-outlook-2026", "bi-rate-policy-2026", "fiscal-consolidation-indonesia"] },
    ],
  },
  {
    slug: "/macro/macro-outlooks",
    locale: "id",
    status: "published",
    title: "Prospek Makro",
    description: "Analisis mendalam tentang tren makroekonomi Indonesia.",
    navLabel: "Prospek Makro",
    section: "Fondasi Makro",
    content: [
      { type: "text", content: "Seri Prospek Makro kami menyediakan penilaian kuartalan dan tahunan tentang lingkungan makroekonomi Indonesia." },
      { type: "featured", slugs: ["prospeks-makro-indonesia-2026", "inflasi-indonesia-2026"] },
    ],
  },
  {
    slug: "/data",
    locale: "en",
    status: "published",
    title: "Data Hub",
    description: "Interactive charts, economic data, and market intelligence for Indonesia.",
    navLabel: "Data Hub",
    section: "root",
    content: [{ type: "text", content: "The Data Hub provides interactive access to the datasets powering our research." }],
  },
  {
    slug: "/data",
    locale: "id",
    status: "published",
    title: "Pusat Data",
    description: "Grafik interaktif, data ekonomi, dan intelijen pasar untuk Indonesia.",
    navLabel: "Pusat Data",
    section: "root",
    content: [{ type: "text", content: "Pusat Data menyediakan akses interaktif ke dataset yang menjadi dasar riset kami." }],
  },
];

// ─── Blog Posts ────────────────────────────────────────────────────────────────

export const SEED_BLOG_POSTS: SeedBlogPost[] = [
  {
    slug: "what-is-current-account-deficit",
    locale: "en",
    status: "published",
    title: "What Is a Current Account Deficit — and Why It Matters for Indonesia",
    excerpt: "A current account deficit is one of the most watched macro variables in emerging markets.",
    body: [
      "The current account is the broadest measure of a country's transactions with the rest of the world.",
      "When a country spends more on imports than it earns from exports, it runs a current account deficit. This is not inherently bad.",
      "For Indonesia, the current account has become a focal point for investors and policymakers alike.",
    ],
    category: "economics-101",
    tag: "Macro",
    readTime: "5 min read",
    publishedAt: "2026-01-15",
  },
  {
    slug: "cpi-vs-core-inflation",
    locale: "en",
    status: "published",
    title: "CPI vs. Core Inflation: Why Central Banks Watch the Difference",
    excerpt: "Headline inflation captures everything. Core inflation tells you what the central bank really cares about.",
    body: [
      "Consumer Price Index (CPI) inflation is the number that makes headlines.",
      "Core inflation strips out the most volatile components: food prices and administered prices.",
      "When core inflation falls below 2.5% and is on a stable downward path, BI has room to begin easing.",
    ],
    category: "economics-101",
    tag: "Inflation",
    readTime: "6 min read",
    publishedAt: "2026-03-01",
  },
  {
    slug: "jci-7200-bi-hold",
    locale: "en",
    status: "published",
    title: "JCI at 7,200: Why BI's Rate Hold Changes the Playbook",
    excerpt: "With Bank Indonesia holding rates and the Fed signaling caution, the calculus for Indonesian equities has shifted.",
    body: [
      "The Jakarta Composite Index's push toward 7,200 this quarter reflects resilient corporate earnings and foreign inflow momentum.",
      "Bank Indonesia's decision to hold the BI Rate at 6.00% removes one tail risk from the equity market.",
      "However, the external backdrop remains challenging.",
    ],
    category: "market-pulse",
    tag: "Equities",
    readTime: "4 min read",
    publishedAt: "2026-02-20",
  },
  {
    slug: "how-we-build-macro-models",
    locale: "en",
    status: "published",
    title: "How We Build Our Macro Models: A Behind-the-Scenes Look",
    excerpt: "Our GDP nowcasting model combines official data, high-frequency indicators, and machine learning.",
    body: [
      "One of the most challenging problems in emerging market research is the lag between what is happening and what official data reveals.",
      "This is the nowcasting problem — and it's where we spend a significant portion of our analytical effort.",
      "We validate this model continuously against new official releases and publish our nowcast alongside each BPS release.",
    ],
    category: "lab-notes",
    tag: "Methodology",
    readTime: "8 min read",
    publishedAt: "2026-03-10",
  },
  {
    slug: "prospeks-makro-indonesia-2026-id",
    locale: "id",
    status: "published",
    title: "Prospek Makro Indonesia 2026: Menavigasi Angin Keringat Global",
    excerpt: "Dengan pertumbuhan global melambat, fundamental makroekonomi Indonesia tetap tangguh.",
    body: [
      "Indonesia memasuki 2026 dengan salah satu profil makro paling tangguh di Asia Tenggara.",
      "Pendorong utama ketahanan ini adalah konsumsi rumah tangga yang kuat, yang menyumbang sekitar 57% PDB.",
      "Risiko utama meliputi pelemahan IDR jika The Fed menunda pemotongan suku bunga.",
    ],
    category: "economics-101",
    tag: "Makro",
    readTime: "6 min read",
    publishedAt: "2026-03-26",
  },
];
