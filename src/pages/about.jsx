import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
} from "react-icons/fa";
import { Aboutus } from "../components/images";
import Subscription from "../components/sections/subscription";
import MeetTheTeam from "../components/meetheteam";
import CoreValues from "../components/sections/corevalues";
import FaqSection from "../components/Faq";
import SEO from "../utils/seo";
import { breadcrumbSchema } from "../utils/structuredData";

const capabilities = [
  "Web and mobile development for platforms, e-commerce, and high-converting sites.",
  "UI/UX design — wireframes, prototypes, and design systems.",
  "Branding, graphics, and digital marketing.",
  "Project delivery with clear timelines and updates.",
  "Training programmes and fixed-price catalogue with instant checkout.",
];

const process = [
  { title: "Discovery", text: "Align on goals, audience, and success metrics." },
  { title: "Design & Build", text: "Turn the plan into design and code with regular feedback." },
  { title: "Launch & Growth", text: "Deploy, monitor, and improve from real usage." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="About Lasglowtech | Creative Technology Company Nigeria"
        description="Meet Lasglowtech  a creative technology company delivering web development, mobile apps, UI/UX, branding, and digital products with creativity, precision, and reliability."
        url="/about"
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32 px-6 md:px-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${Aboutus})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120b1f] via-[#120b1f]/95 to-[#120b1f]/70" />
        <div className="absolute top-0 right-0 w-[480px] h-[360px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="section-tag justify-center"><span className="dot-live" />About Lasglowtech</span>
            <h1 className="text-white mt-5 mb-6 text-balance">Innovative tech.<br /><span className="text-orange-500">Ideas brought to life.</span></h1>
            <p className="text-lg md:text-xl text-[#c4b3d8] max-w-2xl mx-auto leading-relaxed">
              We build bold digital experiences that help ambitious brands move forward with clarity and confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-9">
              <Link to="/contact" className="btn-orange">Start a conversation <FaArrowRight className="text-xs" /></Link>
              <Link to="/catalogues" className="btn-outline">Explore our work</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="relative overflow-hidden shadow-2xl shadow-black/25"
          >
            <img src={Aboutus} alt="Lasglowtech team" className="w-full aspect-[4/3] object-cover" />
            <div className="absolute bottom-5 left-5 bg-[#120b1f]/90 px-5 py-3 border-l-4 border-orange-500">
              <p className="text-white font-bold">People first.</p>
              <p className="text-xs text-[#c4b3d8]">Technology with purpose.</p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.08 } } }}
          >
            <span className="section-tag"><span className="dot-live" />Who we are</span>
            <h2 className="text-white leading-tight mb-5">We make complex ideas feel simple.</h2>
            <p className="text-sm text-[#9b8cb5] leading-relaxed mb-4">
              Launched in 2021, Lasglowtech is a creative technology company helping startups, founders, and teams compete in a digital-first world.
            </p>
            <p className="text-sm text-[#9b8cb5] leading-relaxed">
              From the first sketch to the final launch, we bring design, code, and strategy together to create products people want to use.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 mt-7 text-sm font-bold text-orange-500 hover:text-white transition-colors">Meet your new digital partner <FaArrowRight className="text-xs" /></Link>
          </motion.div>
        </div>
      </section>

      {/* What we deliver */}
      <section className="bg-[#170d29] text-[#e8ddf8] px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="section-tag"><span className="dot-live" />What we deliver</span>
            <h2 className="text-white">Everything you need to go from idea to impact.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item, i) => (
              <motion.div key={item} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-[#8700ff]/20 bg-[#1a1030]/60 p-6 hover:border-orange-500 transition-colors">
                <span className="text-3xl font-bold text-orange-500">0{i + 1}</span>
                <p className="text-sm text-[#c4b3d8] leading-relaxed mt-8">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-[#120b1f] px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="section-tag"><span className="dot-live" />How we work</span>
            <h2 className="text-white">A clear process. No mystery.</h2>
            <p className="text-[#9b8cb5] mt-4 max-w-xl">Good work comes from good communication. We keep every stage focused, collaborative, and moving.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, i) => (
              <motion.div key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-t border-[#8700ff]/30 pt-5">
                <p className="text-orange-500 font-bold text-sm mb-5">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-white mb-3">{step.title}</h3>
                <p className="text-sm text-[#9b8cb5] leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CoreValues />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative overflow-hidden bg-orange-500 p-8 md:p-14 text-center"
        >
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-[#120b1f] mb-3">Let&apos;s build what&apos;s next.</h2>
            <p className="text-sm text-[#3e2616] mb-8 leading-relaxed">
              Tell us where you want to go. We&apos;ll help you find the clearest way to get there.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#120b1f] text-white rounded-full text-sm font-bold hover:bg-[#8700ff] transition-colors">Contact us <FaArrowRight className="text-xs" /></Link>
              <Link to="/catalogues" className="inline-flex items-center justify-center px-6 py-3 border border-[#120b1f]/40 text-[#120b1f] rounded-full text-sm font-bold hover:bg-[#120b1f]/10 transition-colors">Browse catalogue</Link>
            </div>
          </div>
        </motion.div>
      </section>

      <MeetTheTeam />
      <Subscription />
      <FaqSection />
    </div>
  );
}
