import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1600&q=85";

export default function Hero() {
  return (
    <section className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="City skyline"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="max-w-[580px]">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-4">
              PT. Andara Investasi Cerdas
            </div>
            <h1 className="text-[30px] md:text-[44px] font-bold text-white leading-tight mb-4">
              AndaraLab: Decoding Economies, Empowering Growth
            </h1>
            <p className="text-[14px] text-white/80 leading-relaxed mb-7 max-w-[440px]">
              Transforming raw economic data into high-precision strategic
              intelligence for Indonesia and beyond.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-white text-[13px] font-medium bg-[#1a3a5c] px-5 py-2.5 hover:bg-[#14305a] transition-colors"
              >
                About AndaraLab
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/data"
                className="inline-flex items-center gap-2 border border-white/70 text-white text-[13px] font-medium px-5 py-2.5 hover:bg-white/10 transition-colors"
              >
                Explore Data Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
