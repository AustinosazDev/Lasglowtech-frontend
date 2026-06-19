import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../utils/seo";
import Subscription from "../components/sections/subscription";
import TestimonialSection from "../components/sections/TestimonialSection";
import ServicesData from "../assets/data/serviceslist";

const tabs = ServicesData.map(s => ({ ...s, subtitle: s.title }));

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Lasglowtech Services | Web, Mobile, Design, Tutoring & Service Catalogue"
        description="Lasglowtech offers web and mobile development, UI/UX and graphic design, professional IT tutoring and training, and a service catalogue with instant checkout."
        keywords="Lasglowtech services, web development, mobile apps, UI UX design, graphic design, IT tutoring Nigeria, tech training, service catalogue, instant checkout"
        url="https://www.lasglowtech.com.ng/services"
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500 opacity-[0.05] blur-[80px] pointer-events-none" />
       <nav className="flex items-center justify-center gap-2 pb-6 text-sm text-[#9b8cb5]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-orange-500">Services</span>
          </nav>
       
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-tag justify-center"><span className="dot-live"/>Services</span>
          <h1 className="text-white pt-8 pb-3 mx-auto md:max-w-2xl mb-5">
           <span className="text-[#8700ff]">Digital solutions </span> for modern brands
          </h1>
          <p className="type-muted text-lg max-w-2xl mx-auto mb-8">
            From design, web and mobile development  and branding   we deliver solutions built to perform and scale, with <strong className="text-[#c4b3d8]">professional tutoring</strong>
          </p>
          
        </div>
      </section>

      {/* Service selector + detail */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="section-tag justify-center"><span className="dot-live"/>Choose a service</span>
          <h2 className="text-white mb-3">What we offer</h2>
          <p className="type-muted max-w-2xl mx-auto">
            Select a category to view scope and features. Get started via custom consultation, or browse our <strong className="text-[#c4b3d8]">service catalogue</strong> for fixed-price packages and <strong className="text-[#c4b3d8]">instant checkout</strong>.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          {/* Vertical bar selectors */}
          <div className="flex md:flex-col justify-center items-center gap-2 md:gap-3">
            {tabs.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Select ${tabs[i].title}`}
                className={`transition-all duration-300 rounded-full ${active === i
                  ? "bg-[#8700ff] shadow-lg shadow-[#8700ff]/40 scale-110"
                  : "border border-[#8700ff]/40 hover:bg-[#8700ff]/20"
                } w-12 h-2 md:w-2 md:h-12`}
              />
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 w-full brand-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <AnimatePresence mode="wait">
                <motion.div key={active + "t"} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }} transition={{ duration:0.3 }}
                  className="p-7 md:p-10 flex flex-col justify-center order-2 lg:order-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">{tabs[active].subtitle}</span>
                  <h3 className="text-white mb-4">{tabs[active].title}</h3>
                  <p className="type-muted mb-6">{tabs[active].description}</p>

                  {/* Feature pills */}
                  {tabs[active].features && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tabs[active].features.map(f => (
                        <span key={f} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8700ff]/12 border border-[#8700ff]/25 text-[#c4b3d8]">{f}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link to={tabs[active].link} className="btn-primary text-xs">Learn more</Link>
                    <Link to="/catalogues" className="btn-outline text-xs">View catalogue</Link>
                    <Link to="/careers" className="btn-outline text-xs">Tutoring</Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[380px] order-1 lg:order-2">
                <AnimatePresence mode="wait">
                  <motion.img key={active + "i"} initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.98 }} transition={{ duration:0.3 }}
                    src={tabs[active].Picture} alt={tabs[active].title}
                    className="absolute inset-0 w-full h-full object-cover" />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1030]/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tabs.map((s, i) => (
            <Link to={s.link} key={s.link}
              className="brand-card p-5 group block">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 block">{`0${i+1}`}</span>
              <h3 className="text-white mb-2 group-hover:text-orange-500 transition-colors">{s.title}</h3>
              <p className="type-muted line-clamp-3">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <TestimonialSection />
      <Subscription />
    </div>
  );
}


