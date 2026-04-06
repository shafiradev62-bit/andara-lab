import { useState, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { usePages } from "@/lib/cms-store";

type NavChild = { label: string; href: string };
type NavItem =
  | { label: string; href: string }
  | { label: string; children: NavChild[] };

function isMacroSection(section?: string) {
  return section === "Macro Foundations" || section === "Fondasi Makro";
}

function isSectoralSection(section?: string) {
  return section === "Sectoral Intelligence" || section === "Intelijen Sektoral";
}

export default function Navbar() {
  const [location] = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { locale, setLocale, t } = useLocale();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: cmsPages = [] } = usePages({ status: "published", locale });

  const navItems: NavItem[] = useMemo(() => {
    const pub = cmsPages.filter((p) => p.locale === locale && p.status === "published");

    const macroSubPages = pub
      .filter((p) => isMacroSection(p.section) && p.slug.startsWith("/macro/"))
      .sort((a, b) => (a.navLabel || a.title).localeCompare(b.navLabel || b.title))
      .map((p) => ({ label: p.navLabel || p.title, href: p.slug }));

    const macroLanding = pub.find((p) => p.slug === "/macro" && isMacroSection(p.section));
    const macroChildren: NavChild[] = [];
    if (macroLanding && !macroSubPages.some((c) => c.href === "/macro")) {
      macroChildren.push({ label: macroLanding.navLabel || macroLanding.title, href: "/macro" });
    }
    macroChildren.push(...macroSubPages);

    const sectoralChildren = pub
      .filter((p) => isSectoralSection(p.section) && p.slug.startsWith("/sectoral/"))
      .sort((a, b) => (a.navLabel || a.title).localeCompare(b.navLabel || b.title))
      .map((p) => ({ label: p.navLabel || p.title, href: p.slug }));

    const blogChildren = pub
      .filter(
        (p) =>
          p.slug.startsWith("/blog/") &&
          p.slug !== "/blog" &&
          (p.section === "root" || !p.section)
      )
      .sort((a, b) => (a.navLabel || a.title).localeCompare(b.navLabel || b.title))
      .map((p) => ({ label: p.navLabel || p.title, href: p.slug }));

    const sectoralLanding = pub.find(
      (p) => p.slug === "/sectoral/deep-dives" && isSectoralSection(p.section)
    );
    const macroNavTitle = macroLanding?.section || t("nav_macro");
    const sectoralNavTitle = sectoralLanding?.section || t("nav_sectoral");

    const fallbackMacro: NavChild[] = [
      { label: t("nav_macro_outlooks"), href: "/macro/macro-outlooks" },
      { label: t("nav_policy_monetary"), href: "/macro/policy-monetary" },
      { label: t("nav_geopolitical"), href: "/macro/geopolitical" },
    ];
    const fallbackSectoral: NavChild[] = [
      { label: t("nav_deep_dives"), href: "/sectoral/deep-dives" },
      { label: t("nav_regional"), href: "/sectoral/regional" },
      { label: t("nav_esg"), href: "/sectoral/esg" },
    ];
    const fallbackBlog: NavChild[] = [
      { label: t("nav_economics_101"), href: "/blog/economics-101" },
      { label: t("nav_market_pulse"), href: "/blog/market-pulse" },
      { label: t("nav_lab_notes"), href: "/blog/lab-notes" },
    ];

    return [
      { label: t("nav_home"), href: "/" },
      { label: t("nav_about"), href: "/about" },
      {
        label: macroNavTitle,
        children: macroChildren.length > 0 ? macroChildren : fallbackMacro,
      },
      {
        label: sectoralNavTitle,
        children: sectoralChildren.length > 0 ? sectoralChildren : fallbackSectoral,
      },
      {
        label: t("nav_data"),
        children: [
          { label: t("nav_interactive_charts"), href: "/data" },
          { label: t("nav_model_comparison"), href: "/data/models" },
          { label: t("nav_economic_calendar"), href: "/data/economic-calendar" },
          { label: t("nav_market_dashboard"), href: "/data/market-dashboard" },
        ],
      },
      {
        label: t("nav_blog"),
        children: blogChildren.length > 0 ? blogChildren : fallbackBlog,
      },
      { label: locale === "id" ? "Analisis" : "Analysis", href: "/analisis" },
      { label: t("nav_contact"), href: "/contact" },
    ];
  }, [cmsPages, locale, t]);

  const isActive = (item: NavItem) => {
    if ("href" in item && !("children" in item)) return location === item.href;
    if ("children" in item) return (item as any).children?.some((c: any) => location.startsWith(c.href));
    return false;
  };

  const handleMouseEnter = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpenMenu(label);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center h-14">
        <Link
          href="/"
          className="flex items-center gap-2 mr-6 flex-shrink-0"
        >
          <div className="w-7 h-7 bg-[#1a3a5c] flex items-center justify-center">
            <span className="text-white text-[11px] font-bold">AL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">AndaraLab</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center flex-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => "children" in item ? handleMouseEnter(item.label) : undefined}
              onMouseLeave={() => "children" in item ? handleMouseLeave() : undefined}
            >
              {"href" in item && !("children" in item) ? (
                <Link
                  href={(item as any).href}
                  className={`flex items-center px-3 py-5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive(item)
                      ? "border-[#1a3a5c] text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    className={`flex items-center gap-1 px-3 py-5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                      isActive(item)
                        ? "border-[#1a3a5c] text-gray-900"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openMenu === item.label && "children" in item && (
                    <div
                      className="absolute top-full left-0 bg-white border border-[#E5E7EB] shadow-lg min-w-[230px] z-50"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {(item as any).children?.map((child: any) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenMenu(null)}
                          className={`block px-4 py-2.5 text-[13px] transition-colors border-b border-[#F9FAFB] last:border-0 ${
                            location === child.href
                              ? "text-[#1a3a5c] font-medium bg-blue-50"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3 ml-4">
          <div className="flex items-center gap-1 text-[12.5px] text-gray-500 border border-[#E5E7EB] p-0.5">
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  locale === l ? "bg-[#1a3a5c] text-white" : "hover:text-gray-800"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            href="/contact"
            className="text-[12.5px] font-medium text-white bg-[#1a3a5c] px-4 py-1.5 hover:bg-[#14305a] transition-colors whitespace-nowrap"
          >
            {t("nav_get_in_touch")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto p-2 text-gray-500"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E7EB] shadow-lg max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-[#F3F4F6]">
              {"href" in item && !("children" in item) ? (
                <Link
                  href={(item as any).href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3.5 text-[14px] font-medium text-gray-800"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    className="flex items-center justify-between w-full px-6 py-3.5 text-[14px] font-medium text-gray-800"
                    onClick={() =>
                      setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpanded === item.label && "children" in item && (
                    <div className="bg-gray-50 border-t border-[#F3F4F6]">
                      {(item as any).children?.map((child: any) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                          className="block px-8 py-3 text-[13.5px] text-gray-600 hover:text-gray-900"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex items-center gap-1 text-[12.5px] text-gray-500 border border-[#E5E7EB] p-0.5">
              {(["en", "id"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2.5 py-1 font-medium transition-colors ${locale === l ? "bg-[#1a3a5c] text-white" : "hover:text-gray-800"}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-[12.5px] font-medium text-white bg-[#1a3a5c] px-4 py-1.5"
            >
              {t("nav_get_in_touch")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
