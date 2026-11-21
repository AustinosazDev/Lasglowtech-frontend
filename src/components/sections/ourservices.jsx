import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Services from "../../assets/data/serviceslist";
import servicePillars from "../../assets/data/servicePillars";

const tabs = servicePillars.map(p => ({ ...p, subtitle: p.title, image: `https://images.unsplash.com/photo-${['1517694712202-14dd9538aa97', '1626785774573-4b799314346d', '1558655146-d09347e92766'][['digital', 'brand-systems', 'print-production'].indexOf(p.id)]}?w=800&h=600&fit=crop` }));

export default function OurServices() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 md:py-28" id="our-services" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <span className="section-tag justify-center">
            <span className="dot-live" />
            Our Services
          </span>
          <h2 id="services-heading" className="text-white mb-4 text-balance">
            Strategy, design & engineering built for results
          </h2>
          <p className="type-muted max-w-xl mx-auto">
            End-to-end creative technology — from brand identity to production-ready products.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          {/* Horizontal navigation */}
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Select ${tab.title}`}
                className={`transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold ${
                  active === i
                    ? "bg-[#8700ff] text-white shadow-lg shadow-[#8700ff]/40"
                    : "border border-[#8700ff]/40 text-[#c4b3d8] hover:bg-[#8700ff]/20"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 w-full brand-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatePresence mode="wait">
                <motion.div key={active + "t"} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }} transition={{ duration:0.3 }}
                  className="p-7 md:p-10 flex flex-col justify-center order-2 md:order-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">{tabs[active].subtitle}</span>
                  <h3 className="text-white mb-4 text-2xl md:text-3xl">{tabs[active].title}</h3>
                  <p className="type-muted mb-6">{tabs[active].description}</p>

                  {/* Service list */}
                  {tabs[active].services && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {tabs[active].services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8700ff]" />
                          <span className="text-sm text-[#e8ddf8]">{service}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link to={tabs[active].link} className="btn-primary text-xs">Explore {tabs[active].title}</Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px] order-1 md:order-2">
                <AnimatePresence mode="wait">
                  <motion.img key={active + "i"} initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.98 }} transition={{ duration:0.3 }}
                    src={tabs[active].image} alt={tabs[active].title}
                    className="absolute inset-0 w-full h-full object-cover" />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1030]/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
