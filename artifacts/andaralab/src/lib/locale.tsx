// i18n — Locale Context and Translation System
//
// Architecture:
// - Locale state lives at the app root, propagated via React Context.
// - Only UI chrome strings are translated (nav labels, section headers, button text, etc.).
// - Article body content is stored per-locale in the articles table (CMS-managed).
//   For the current static articles, EN is the canonical version.
// - Locale is persisted in localStorage so it survives page reloads.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Locale = "en" | "id";
export type TranslationKey = keyof typeof translations.en;

const STORAGE_KEY = "andaralab_locale";

// ─── UI Translations ────────────────────────────────────────────────────────────

const translations = {
  en: {
    // Nav
    nav_home: "Home",
    nav_about: "About Us",
    nav_macro: "Macro Foundations",
    nav_sectoral: "Sectoral Intelligence",
    nav_data: "Data Hub",
    nav_blog: "Blog",
    nav_contact: "Contact",
    nav_macro_outlooks: "Macro Outlooks",
    nav_policy_monetary: "Policy & Monetary Watch",
    nav_geopolitical: "Geopolitical & Structural Analysis",
    nav_deep_dives: "Strategic Industry Deep-dives",
    nav_regional: "Regional Economic Monitor",
    nav_esg: "ESG",
    nav_interactive_charts: "Interactive Charts",
    nav_model_comparison: "LLM Model Comparison",
    nav_economic_calendar: "Economic Calendar",
    nav_market_dashboard: "Market Dashboard",
    nav_economics_101: "Economics 101",
    nav_market_pulse: "Market Pulse",
    nav_lab_notes: "Lab Notes",
    nav_get_in_touch: "Get in Touch",

    // Data Hub
    data_hub_title: "Economic Data & Market Intelligence",
    data_hub_subtitle: "Interactive charts, economic calendar, and live market data for Indonesia and global economies.",
    interactive_charts: "Interactive Charts",
    economic_calendar: "Economic Calendar",
    market_overview: "Market Overview",
    available_datasets: "Available Datasets",
    manage_in_cms: "Manage in CMS",
    view_full_chart: "View full chart",
    chart: "Chart",
    table: "Table",
    loading_datasets: "Loading datasets…",
    no_datasets: "No datasets available.",
    api_error: "Could not reach API server",

    // Market overview
    idr_usd: "IDR/USD",
    jci_ihsg: "JCI (IHSG)",
    bi_rate: "BI Rate",
    us_10y_yield: "US 10Y Yield",
    brent_crude: "Brent Crude",
    gold: "Gold",
    featured_charts: "Featured Charts",

    // Economic calendar
    date: "Date",
    event: "Event",
    impact: "Impact",
    actual: "Actual",
    forecast: "Forecast",
    high: "High",
    medium: "Medium",
    low: "Low",

    // Article categories
    macro_outlooks: "Macro Outlooks",
    policy_monetary: "Policy & Monetary Watch",
    geopolitical: "Geopolitical & Structural Analysis",
    deep_dives: "Strategic Industry Deep-dives",
    regional: "Regional Economic Monitor",
    esg: "ESG",
    economics_101: "Economics 101",
    market_pulse: "Market Pulse",
    lab_notes: "Lab Notes",

    // Generic
    back: "Back",
    loading: "Loading…",
    error: "An error occurred",
    no_results: "No results found",
    read_more: "Read more",
    min_read: "min read",
  },

  id: {
    // Nav
    nav_home: "Beranda",
    nav_about: "Tentang Kami",
    nav_macro: "Fondasi Makro",
    nav_sectoral: "Intelijen Sektoral",
    nav_data: "Pusat Data",
    nav_blog: "Blog",
    nav_contact: "Kontak",
    nav_macro_outlooks: "Prospek Makro",
    nav_policy_monetary: "Kebijakan & Moneter",
    nav_geopolitical: "Analisis Geopolitik & Struktural",
    nav_deep_dives: "Analisis Mendalam Industri Strategis",
    nav_regional: "Monitor Ekonomi Regional",
    nav_esg: "ESG",
    nav_interactive_charts: "Grafik Interaktif",
    nav_model_comparison: "Perbandingan Model LLM",
    nav_economic_calendar: "Kalender Ekonomi",
    nav_market_dashboard: "Dashboard Pasar",
    nav_economics_101: "Ekonomi 101",
    nav_market_pulse: "Pulsa Pasar",
    nav_lab_notes: "Catatan Lab",
    nav_get_in_touch: "Hubungi Kami",

    // Data Hub
    data_hub_title: "Data Ekonomi & Intelijen Pasar",
    data_hub_subtitle: "Grafik interaktif, kalender ekonomi, dan data pasar live untuk ekonomi Indonesia dan global.",
    interactive_charts: "Grafik Interaktif",
    economic_calendar: "Kalender Ekonomi",
    market_overview: "Ikhtisar Pasar",
    available_datasets: "Dataset Tersedia",
    manage_in_cms: "Kelola di CMS",
    view_full_chart: "Lihat grafik lengkap",
    chart: "Grafik",
    table: "Tabel",
    loading_datasets: "Memuat dataset…",
    no_datasets: "Tidak ada dataset.",
    api_error: "Tidak dapat terhubung ke server API",

    // Market overview
    idr_usd: "IDR/USD",
    jci_ihsg: "JCI (IHSG)",
    bi_rate: "Suku Bunga BI",
    us_10y_yield: "Imbal Hasil US 10Y",
    brent_crude: "Minyak Brent",
    gold: "Emas",

    // Economic calendar
    date: "Tanggal",
    event: "Peristiwa",
    impact: "Dampak",
    actual: "Aktual",
    forecast: "Forecast",
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",

    // Article categories
    macro_outlooks: "Prospek Makro",
    policy_monetary: "Kebijakan & Moneter",
    geopolitical: "Analisis Geopolitik & Struktural",
    deep_dives: "Analisis Mendalam Industri Strategis",
    regional: "Monitor Ekonomi Regional",
    esg: "ESG",
    economics_101: "Ekonomi 101",
    market_pulse: "Pulsa Pasar",
    lab_notes: "Catatan Lab",

    // Generic
    back: "Kembali",
    loading: "Memuat…",
    error: "Terjadi kesalahan",
    no_results: "Tidak ada hasil",
    read_more: "Baca selengkapnya",
    min_read: "menit baca",
  },
} as const;

// ─── Context ──────────────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as Locale) ?? "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {}
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string): string => {
      const localeStrings = translations[locale] as Record<string, string>;
      return localeStrings[key] ?? (translations.en as Record<string, string>)[key] ?? key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
