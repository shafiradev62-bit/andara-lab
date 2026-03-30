import { ArrowRight } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1600&q=85";

export default function Hero() {
  return (
    <section className="relative w-full h-[300px] md:h-[380px] overflow-hidden">
      {/* Background image */}
      <img
        src={HERO_IMAGE}
        alt="City skyline"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="max-w-[560px]">
            <h1 className="text-[30px] md:text-[42px] font-bold text-white leading-tight mb-4">
              AndaraLab: Decoding Economies, Empowering Growth
            </h1>
            <p className="text-[14px] text-white/85 leading-relaxed mb-6 max-w-[420px]">
              In-depth analysis and insights to navigate economic landscapes and
              uncover opportunities.
            </p>
            <a
              href="#about"
              className="inline-flex items-center gap-2 border border-white/80 text-white text-[13px] font-medium px-5 py-2 hover:bg-white/10 transition-colors"
            >
              Learn More
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
