import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  { label: "Insights", href: "/", active: true },
  {
    label: "Macro",
    href: "#",
    submenu: [
      { label: "Macro Outlooks", href: "/macro/macro-outlooks/" },
      { label: "Policy & Monetary Watch", href: "/macro/policy-monetary/" },
      { label: "Geopolitical & Structural Analysis", href: "/macro/geopolitical/" },
    ],
  },
  {
    label: "Sectoral",
    href: "#",
    submenu: [
      { label: "Strategic Industry Deep-dives", href: "/sectoral/deep-dives/" },
      { label: "Regional Economic Monitor", href: "/sectoral/regional/" },
      { label: "ESG", href: "/sectoral/esg/" },
    ],
  },
  {
    label: "Data Hub",
    href: "#",
    submenu: [
      { label: "Economic Calendar", href: "/data/economic-calendar/" },
      { label: "Market Dashboard", href: "/data/market-dashboard/" },
    ],
  },
  {
    label: "Blog",
    href: "#",
    submenu: [
      { label: "Economics 101", href: "/blog/economics-101/" },
      { label: "Market Pulse", href: "/blog/market-pulse/" },
      { label: "Lab Notes", href: "/blog/lab-notes/" },
    ],
  },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [lang, setLang] = useState<"EN" | "ID">("EN");

  return (
    <nav className="w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center h-14 gap-8">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
            AndaraLab
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => item.submenu && setOpenSubmenu(item.label)}
              onMouseLeave={() => setOpenSubmenu(null)}
            >
              <a
                href={item.href}
                className={`flex items-center gap-0.5 px-3 py-1.5 text-[13.5px] font-medium transition-colors ${
                  item.active
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
                {item.submenu && (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                )}
              </a>
              {item.submenu && openSubmenu === item.label && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-[#E5E7EB] shadow-sm z-50">
                  {item.submenu.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-b border-[#F3F4F6] last:border-0"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <button
              onClick={() => setLang("EN")}
              className={`font-medium ${lang === "EN" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              EN
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setLang("ID")}
              className={`font-medium ${lang === "ID" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              ID
            </button>
          </div>
          <button className="flex items-center gap-1 bg-[#1a3a5c] text-white text-[13px] font-medium px-3 py-1.5 rounded-sm">
            IN
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden ml-auto text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                className="w-full text-left px-6 py-3 text-[14px] font-medium text-gray-800 flex items-center justify-between border-b border-[#F3F4F6]"
                onClick={() =>
                  setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                }
              >
                {item.label}
                {item.submenu && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openSubmenu === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </button>
              {item.submenu && openSubmenu === item.label && (
                <div className="bg-gray-50">
                  {item.submenu.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-10 py-2.5 text-[13px] text-gray-600 border-b border-[#F3F4F6]"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-[13px]">
              <button
                onClick={() => setLang("EN")}
                className={lang === "EN" ? "font-semibold text-gray-900" : "text-gray-400"}
              >
                EN
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setLang("ID")}
                className={lang === "ID" ? "font-semibold text-gray-900" : "text-gray-400"}
              >
                ID
              </button>
            </div>
            <button className="flex items-center gap-1 bg-[#1a3a5c] text-white text-[13px] font-medium px-3 py-1.5 rounded-sm">
              IN <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
