import { Link } from "wouter";

const links = {
  Research: [
    { label: "Macro Outlooks", href: "/macro/macro-outlooks" },
    { label: "Policy & Monetary", href: "/macro/policy-monetary" },
    { label: "Sectoral Intelligence", href: "/sectoral/deep-dives" },
    { label: "ESG", href: "/sectoral/esg" },
    { label: "Data Hub", href: "/data" },
  ],
  Explore: [
    { label: "Economic Calendar", href: "/data/economic-calendar" },
    { label: "Market Dashboard", href: "/data/market-dashboard" },
    { label: "Blog", href: "/blog/economics-101" },
    { label: "Lab Notes", href: "/blog/lab-notes" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Admin CMS", href: "/admin" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0f2540] text-white py-12 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/10 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">AL</span>
              </div>
              <span className="text-[16px] font-bold tracking-tight">AndaraLab</span>
            </div>
            <p className="text-[12.5px] text-white/55 leading-relaxed max-w-[280px] mb-5">
              A premier economic research hub under PT. Andara Investasi Cerdas.
              Decoding economies, empowering growth.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-[12.5px] font-medium text-white border border-white/30 px-4 py-2 hover:bg-white/10 transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/35 mb-4">
                {group}
              </div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[12.5px] text-white/55 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11.5px] text-white/35">
            © 2026 AndaraLab · PT. Andara Investasi Cerdas. All rights reserved.
          </p>
          <p className="text-[11.5px] text-white/30">andaralab.id</p>
        </div>
      </div>
    </footer>
  );
}
