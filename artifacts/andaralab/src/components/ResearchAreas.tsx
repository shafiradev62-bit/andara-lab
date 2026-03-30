const areas = [
  {
    id: 1,
    title: "Macro Foundations",
    description: "Economic trends, policy insights, and global.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    id: 2,
    title: "Sectoral Intelligence",
    description: "Industry analysis, ESG, and regional trends.",
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&q=80",
  },
  {
    id: 3,
    title: "Data Hub",
    description: "Economic Calendar and Market Dashboard.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
];

export default function ResearchAreas() {
  return (
    <section className="py-12 bg-[#F9FAFB] border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-8">
          Our Research Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {areas.map((area) => (
            <div
              key={area.id}
              className="relative overflow-hidden border border-[#E5E7EB] h-[200px] cursor-pointer group"
            >
              <img
                src={area.image}
                alt={area.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-[15px] font-semibold text-white mb-1">
                  {area.title}
                </h3>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  {area.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
