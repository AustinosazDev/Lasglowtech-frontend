import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Services from "../../assets/data/serviceslist";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function OurServices() {
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

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {Services.map((s) => (
            <motion.div key={s.link} variants={card}>
              <Link
                to={`/services/${s.link.split("/").pop()}`}
                className="brand-card group flex flex-col overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50"
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={s.Picture}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={176}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1030] via-[#1a1030]/50 to-transparent" aria-hidden />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors">{s.title}</h3>
                  <p className="type-muted line-clamp-3 flex-1">{s.description}</p>
                  <span className="mt-4 text-sm font-semibold text-[#8700ff] group-hover:translate-x-1 inline-block transition-transform">
                    Learn more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
