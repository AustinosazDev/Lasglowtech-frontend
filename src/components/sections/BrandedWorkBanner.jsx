import { useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { FaEye, FaTimes } from "react-icons/fa";
import { Smiggle2, Smiggle3, Smiggle4, Sures1, Sures2, pelifts, heroimage, fiftyreign } from "../images";

const brandedItems = [
  { src: Smiggle2, caption: "Custom T-Shirt Print" },
  { src: Smiggle3, caption: "Apparel Branding" },
  { src: Smiggle4, caption: "Product Packaging" },
  { src: Sures1, caption: "Vehicle Branding" },
  { src: Sures2, caption: "Event Signage" },
  { src: pelifts, caption: "Corporate Branding" },
  { src: heroimage, caption: "Brand Materials" },
  { src: fiftyreign, caption: "Print Design" },
];

export default function BrandedWorkBanner() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-20" aria-labelledby="branded-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <span className="section-tag"><span className="dot-live" />Branding & Print</span>
        <h2 id="branded-heading" className="text-white mb-4">Brands we've dressed, printed, and produced</h2>
        <Link to="/projects" className="text-sm font-semibold text-[#8700ff] hover:text-orange-500 transition-colors inline-flex items-center gap-1">
          See more of our branding work →
        </Link>
      </div>

      <Marquee pauseOnHover speed={40} gradient={false}>
        {brandedItems.map((item, i) => (
          <div
            key={i}
            className="mx-3 relative group cursor-pointer brand-card rounded-xl overflow-hidden"
            onClick={() => setSelected(item.src)}
            aria-labelledby={`branded-item-${i}`}
          >
            <img 
              src={item.src} 
              alt={item.caption} 
              className="w-[380px] h-[260px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120b1f]/90 via-[#120b1f]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
              <p id={`branded-item-${i}`} className="text-white text-sm font-semibold">{item.caption}</p>
            </div>
            <div className="absolute inset-0 bg-[#120b1f]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#8700ff] flex items-center justify-center">
                <FaEye className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </Marquee>

      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <button
            className="absolute top-6 right-6 brand-card w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors"
            onClick={() => setSelected(null)}
            aria-label="Close image viewer"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          <img 
            src={selected} 
            alt="Branded work" 
            className="max-w-full max-h-[85vh] object-contain rounded-xl" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
}