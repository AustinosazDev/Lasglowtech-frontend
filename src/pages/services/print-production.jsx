import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SEO from "../../utils/seo";
import { breadcrumbSchema } from "../../utils/structuredData";
import Subscription from "../../components/sections/subscription";
import ServicesData from "../../assets/data/serviceslist";

const printServices = ServicesData.filter(service => 
  ["Branding & Print", "Apparel & T-Shirt Branding", "Vehicle Branding"].includes(service.title)
).map((service, index) => ({
  ...service,
  image: service.Picture || `https://images.unsplash.com/photo-${['1558655146-d09347e92766', '1523381210434-271e8be1f52b', '1555421689-491a97ff2040'][index]}?w=800&h=600&fit=crop`
}));

export default function PrintProduction() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Print & Production | Lasglowtech"
        description="Apparel branding, business cards, large format printing, vehicle branding, and corporate gifts for physical brand materials."
        url="/services/print-production"
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Print & Production", url: "/services/print-production" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500 opacity-[0.05] blur-[80px] pointer-events-none" />
        
        <nav className="flex items-center justify-center gap-2 pb-6 text-sm text-[#9b8cb5]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-orange-500 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-orange-500">Print & Production</span>
        </nav>
       
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-tag justify-center"><span className="dot-live"/>Print & Production</span>
          <h1 className="text-white pt-8 pb-3 mx-auto md:max-w-2xl mb-5 text-4xl md:text-5xl lg:text-6xl font-bold">
            Physical Brand Materials & Production
          </h1>
          <p className="type-muted text-lg max-w-2xl mx-auto mb-8">
            From apparel and business cards to large format printing and vehicle branding, we produce the physical materials that make your brand visible.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Get Started</Link>
            <Link to="/services" className="btn-outline">Back to Services</Link>
          </div>
        </div>
      </section>

      {/* Services Selection */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="section-tag justify-center"><span className="dot-live"/>Our Print Services</span>
          <h2 className="text-white mb-4">Complete Print & Production Solutions</h2>
          <p className="type-muted max-w-2xl mx-auto">
            We offer end-to-end print and production services to ensure your brand looks professional in the physical world.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          {/* Horizontal navigation */}
          <div className="flex flex-wrap justify-center gap-3">
            {printServices.map((service, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Select ${service.title}`}
                className={`transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold ${
                  active === i
                    ? "bg-[#8700ff] text-white shadow-lg shadow-[#8700ff]/40"
                    : "border border-[#8700ff]/40 text-[#c4b3d8] hover:bg-[#8700ff]/20"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 w-full brand-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatePresence mode="wait">
                <motion.div key={active + "t"} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }} transition={{ duration:0.3 }}
                  className="p-7 md:p-10 flex flex-col justify-center order-2 md:order-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Print Service</span>
                  <h3 className="text-white mb-4 text-2xl md:text-3xl">{printServices[active].title}</h3>
                  <p className="type-muted mb-6">{printServices[active].description}</p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {printServices[active].features.map(f => (
                      <span key={f} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8700ff]/12 border border-[#8700ff]/25 text-[#c4b3d8]">{f}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to={printServices[active].link} className="btn-primary text-xs">Learn more</Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px] order-1 md:order-2">
                <AnimatePresence mode="wait">
                  <motion.img key={active + "i"} initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.98 }} transition={{ duration:0.3 }}
                    src={printServices[active].image} alt={printServices[active].title}
                    className="absolute inset-0 w-full h-full object-cover" />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1030]/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="brand-card p-8 md:p-12 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Ready to produce your brand materials?</h2>
          <p className="type-muted max-w-2xl mx-auto mb-8">
            Let's discuss how our print and production services can help your brand make a lasting physical impression.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
            <Link to="/catalogues" className="btn-outline">Browse Catalogue</Link>
          </div>
        </div>
      </section>

      <Subscription />
    </div>
  );
}