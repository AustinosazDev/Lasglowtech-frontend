import { useState } from "react";
import Marquee from "react-fast-marquee";
import { FaEye, FaTimes } from "react-icons/fa";
import { pelifts, heroimage, fiftyreign, Fhemfelhomes, Phoenixcover, ur9group, Smiggle2, Smiggle3, Smiggle4, Sures1, Sures2 } from "../images";

const images = [pelifts, heroimage, fiftyreign, Fhemfelhomes, Phoenixcover, ur9group, Smiggle2, Smiggle3, Smiggle4, Sures1, Sures2];

export default function Servicesslide() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-20 bg-[#1a1030]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <span className="section-tag"><span className="dot-live"/>Our Works</span>
        <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight">A section of our projects</h2>
      </div>

      <Marquee pauseOnHover speed={40} gradient={false}>
        {images.map((src, i) => (
          <div key={i} className="mx-3 relative group cursor-pointer rounded-xl overflow-hidden border border-[#8700ff]/15 hover:border-[#8700ff]/50 transition-all"
            onClick={() => setSelected(src)}>
            <img src={src} alt={`Project ${i+1}`} className="w-[380px] h-[260px] object-cover" />
            <div className="absolute inset-0 bg-[#120b1f]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#8700ff] flex items-center justify-center">
                <FaEye className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </Marquee>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#8700ff] flex items-center justify-center text-white hover:bg-orange-500 transition-colors" onClick={() => setSelected(null)}>
            <FaTimes className="w-4 h-4" />
          </button>
          <img src={selected} alt="Project" className="max-w-full max-h-[85vh] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}


