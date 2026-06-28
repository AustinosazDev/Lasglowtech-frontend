import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaRocket,
  FaStar,
  FaCalendar,
} from "react-icons/fa";
import { Aboutus } from "../components/images";
import Subscription from "../components/sections/subscription";
import MeetTheTeam from "../components/meetheteam";
import CoreValues from "../components/sections/corevalues";
import FaqSection from "../components/Faq";
import SEO from "../utils/seo";
import { breadcrumbSchema } from "../utils/structuredData";

const stats = [
  { value: "2021", label: "Year founded", Icon: FaCalendar },
  { value: "100+", label: "Projects delivered", Icon: FaRocket },
  { value: "4.9★", label: "Client rating", Icon: FaStar },
  { value: "48h", label: "Avg. turnaround", Icon: FaClock },
];

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
        description="Meet Lasglowtech — a creative technology company delivering web development, mobile apps, UI/UX, branding, and digital products with creativity, precision, and reliability."
        url="/about"
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20 px-6 md:px-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${Aboutus})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120b1f] via-[#120b1f]/95 to-[#120b1f]/70" />
        <div className="absolute top-0 right-0 w-[480px] h-[360px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-[#9b8cb5] mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-orange-500">About</span>
          </nav>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-[#8700ff]/30 bg-[#8700ff]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#c4b3d8]">
              About Lasglowtech
            </span>
            <h1 className="text-white mt-6 mb-5">
              A creative technology partner for modern brands
            </h1>
            <p className="text-lg text-[#9b8cb5] max-w-2xl leading-relaxed">
              Design, engineering, and strategy for websites, apps, and digital products that drive growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-12 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto brand-card grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8">
          {stats.map(({ value, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center md:text-left"
            >
              <Icon className="w-5 h-5 text-[#8700ff] mx-auto md:mx-0 mb-2" />
              <p className="type-stat-lg text-white">{value}</p>
              <p className="text-sm text-[#9b8cb5] mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="brand-card rounded-3xl overflow-hidden shadow-2xl shadow-[#8700ff]/10"
          >
            <img src={Aboutus} alt="Lasglowtech team" className="w-full h-72 md:h-[22rem] object-cover" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.08 } } }}
          >
            <span className="section-tag"><span className="dot-live" />Who we are</span>
            <h2 className="text-white leading-tight mb-5">Built for brands that want results</h2>
            <p className="text-sm text-[#9b8cb5] leading-relaxed mb-4">
              Launched in 2021, we help startups, founders, and teams compete in a digital-first world with products that are useful, reliable, and growth-ready.
            </p>
            <p className="text-sm text-[#9b8cb5] leading-relaxed">
              One partner for design, code, and delivery — with plain-language updates and projects kept on track.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What we deliver & How we work */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="brand-card p-6 md:p-8 h-full"
          >
            <h3 className="font-semibold text-white mb-2">What we deliver</h3>
            <p className="text-sm text-[#9b8cb5] mb-5 leading-relaxed">
              Strategy-backed design, solid engineering, and clear communication.
            </p>
            <ul className="space-y-3">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FaCheckCircle className="text-orange-500 mt-0.5 flex-shrink-0 w-4 h-4" />
                  <span className="text-sm text-[#c4b3d8] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.08 } } }}
            className="brand-card p-6 md:p-8 h-full"
          >
            <h3 className="font-semibold text-white mb-2">How we work</h3>
            <p className="text-sm text-[#9b8cb5] mb-5 leading-relaxed">
              A structured process so you always know where things stand.
            </p>
            <div className="space-y-3">
              {process.map((step, i) => (
                <div key={step.title} className="rounded-2xl border border-[#8700ff]/15 bg-[#8700ff]/5 p-4 md:p-5">
                  <p className="text-orange-500 font-semibold text-sm mb-1">
                    {String(i + 1).padStart(2, "0")}. {step.title}
                  </p>
                  <p className="text-sm text-[#9b8cb5] leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <CoreValues />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="brand-card relative overflow-hidden p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8700ff]/10 to-transparent pointer-events-none" />
          <div className="relative max-w-2xl">
            <h2 className="text-white mb-3">Ready to start your project?</h2>
            <p className="text-sm text-[#9b8cb5] mb-8 leading-relaxed">
              Browse our service catalogue or get in touch — we&apos;ll respond quickly with clear next steps.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogues" className="btn-primary">Browse catalogue</Link>
              <Link to="/contact" className="btn-outline">Contact us</Link>
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
