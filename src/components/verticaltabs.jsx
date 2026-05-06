import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OurVision, OurMission, OurValues } from "./images";

const panels = [
  { title:"Designing the Future of Digital", subtitle:"Our Vision", desc:"At Lasglowtech, our vision is to shape the digital future by crafting smart, creative, and scalable solutions. We aim to be a trusted partner for brands seeking growth through standout websites, intuitive apps, and compelling visuals.", image:OurVision },
  { title:"Turning Ideas into Impact",        subtitle:"Our Mission", desc:"Our mission is to deliver high-quality digital services that transform ideas into powerful user experiences. From web and app development to branding and graphic design, we combine creativity, technology, and strategy to help businesses succeed.", image:OurMission },
  { title:"Creativity. Precision. Reliability.", subtitle:"Our Values", desc:"We value creativity that solves problems, precision in every detail, and reliability in delivery. Whether designing a logo, building a platform, or launching a brand online, our values guide us to do meaningful work with integrity and excellence.", image:OurValues },
];

export default function VerticalTabs() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-[#120b1f]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="section-tag justify-center"><span className="dot-live" />About Us</span>
          <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight">Who we are</h2>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Tab indicators */}
          <div className="flex md:flex-col gap-3 md:gap-4 flex-shrink-0">
            {panels.map((p, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`brand-card flex items-center gap-3 text-left w-full rounded-xl px-4 py-3 transition-all duration-300 ${active === i ? "bg-[#8700ff]/15 border border-[#8700ff]/40" : "hover:bg-[#8700ff]/08"}`}>
                <div className={`md:w-1 md:h-10  h-3 w-16 md:rounded-full flex-shrink-0 transition-all duration-300 ${active === i ? "bg-orange-500" : "bg-[#8700ff]/30"}`} />
                <span className={`hidden md:block text-sm font-bold transition-colors ${active === i ? "text-orange-500" : "text-[#9b8cb5]"}`}>{p.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <AnimatePresence mode="wait">
              <motion.div key={active + "t"} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.4 }}>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">{panels[active].subtitle}</p>
                <h3 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-5">{panels[active].title}</h3>
                <p className="text-[#9b8cb5] leading-relaxed">{panels[active].desc}</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={active + "i"} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} transition={{ duration:0.4 }}
                className="brand-card rounded-2xl overflow-hidden shadow-2xl shadow-[#8700ff]/10">
                <img src={panels[active].image} alt={panels[active].title} className="w-full h-64 md:h-80 object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

