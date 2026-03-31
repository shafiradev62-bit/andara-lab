import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Macro Foundations",
    children: [
      { label: "Macro Outlooks", href: "/macro/macro-outlooks" },
      { label: "Policy & Monetary Watch", href: "/macro/policy-monetary" },
      { label: "Geopolitical & Structural Analysis", href: "/macro/geopolitical" },
    ],
  },
  {
    label: "Sectoral Intelligence",
    children: [
      { label: "Strategic Industry Deep-dives", href: "/sectoral/deep-dives" },
      { label: "Regional Economic Monitor", href: "/sectoral/regional" },
      { label: "ESG", href: "/sectoral/esg" },
    ],
  },
  {
    label: "Data Hub",
    children: [
      { label: "Interactive Charts", href: "/data" },
      { label: "Economic Calendar", href: "/data/economic-calendar" },
      { label: "Market Dashboard", href: "/data/market-dashboard" },
    ],
  },
  {
    label: "Blog",
    children: [
      { label: "Economics 101", href: "/blog/economics-101" },
      { label: "Market Pulse", href: "/blog/market-pulse" },
      { label: "Lab Notes", href: "/blog/lab-notes" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (item: (typeof navItems)[0]) => {
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
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">AndaraLab</span>
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
            {(["EN", "ID"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  lang === l ? "bg-[#1a3a5c] text-white" : "hover:text-gray-800"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            href="/contact"
            className="text-[12.5px] font-medium text-white bg-[#1a3a5c] px-4 py-1.5 hover:bg-[#14305a] transition-colors whitespace-nowrap"
          >
            Get in Touch
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
              {(["EN", "ID"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 font-medium transition-colors ${lang === l ? "bg-[#1a3a5c] text-white" : "hover:text-gray-800"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-[12.5px] font-medium text-white bg-[#1a3a5c] px-4 py-1.5"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
