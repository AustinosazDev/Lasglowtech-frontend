import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BgPatternOverlay from "../BgPatternOverlay";
import { Typewriter } from "react-simple-typewriter";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const up = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } };

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center flex-col overflow-hidden bg-[#120b1f] py-16">
      <BgPatternOverlay />
      <div
        className="absolute top-[-120px] right-[-80px] w-[520px] h-[520px] rounded-full bg-primary1 opacity-[0.12] blur-[100px] pointer-events-none z-0"
        style={{ transform: `translateY(${scrollY * 0.16}px)` }}
        aria-hidden
      />
      <div
        className="absolute bottom-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full bg-[#8700ff] opacity-[0.07] blur-[90px] pointer-events-none z-0"
        style={{ transform: `translateY(${scrollY * -0.14}px)` }}
        aria-hidden
      />

      <section
        className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-16 pb-24 pt-16 text-center"
        style={{ transform: `translateY(${scrollY * 0.04}px)` }}
      >
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={up} className="mx-auto text-center max-w-4xl text-white mb-6 mt-8">
            Digital Service Providers
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-Secondarycolor to-Secondarycolor">
              <Typewriter
                words={[
                  "For All Businesses",
                  "For Startups Ready to Scale",
                  "For Creators Building Brands",
                  "For Founders & Entrepreneurs",
                  "For Modern Digital Brands",
                  "For Vision-Driven Teams",
                ]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
          </motion.h1>

          <motion.p variants={up} className="text-lg text-[#9b8cb5] max-w-3xl mx-auto leading-relaxed mb-10">
            At Lasglowtech, we help businesses grow with powerful websites, scalable applications, and creative digital solutions that drive visibility, engagement, and real results.
          </motion.p>

          <motion.div variants={up} className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <Link to="/catalogues" className="btn-primary">Explore Services & Pricing</Link>
            <Link to="/projects" className="btn-outline">View our Work →</Link>
          </motion.div>

          <motion.div variants={up} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { num: "100+", label: "Projects delivered" },
              { num: "48h", label: "Avg. turnaround" },
              { num: "4.9★", label: "Client rating" },
              { num: "2021", label: "Year founded" },
            ].map(({ num, label }) => (
              <div key={label} className="brand-card p-4 sm:p-5 text-center">
                <p className="type-stat text-white">{num}</p>
                <p className="text-xs text-[#9b8cb5] mt-2 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-30">
        <span className="text-xs text-[#9b8cb5]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#8700ff] to-transparent" />
      </div>
    </div>
  );
}
