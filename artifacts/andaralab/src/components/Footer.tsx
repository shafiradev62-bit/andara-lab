export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0f2540] text-white py-10 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="text-[17px] font-semibold mb-3">AndaraLab</div>
            <p className="text-[13px] text-white/60 leading-relaxed max-w-[300px]">
              A premier economic research hub under PT. Andara Investasi Cerdas,
              decoding economies and empowering growth.
            </p>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              Research
            </div>
            <ul className="space-y-2">
              {[
                "Macro Foundations",
                "Sectoral Intelligence",
                "Data Hub",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              Company
            </div>
            <ul className="space-y-2">
              {["About Us", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-white/40">
            © 2026 AndaraLab · PT. Andara Investasi Cerdas. All rights reserved.
          </p>
          <p className="text-[12px] text-white/30">andaralab.id</p>
        </div>
      </div>
    </footer>
  );
}
