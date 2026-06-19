import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaClock, FaRocket, FaStar, FaCalendar } from "react-icons/fa";
import { Aboutus } from "../images";

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

export default function AboutSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12" id="about-us">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center rounded-full border border-[#8700ff]/30 bg-[#8700ff]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#c4b3d8]">
            About Lasglowtech
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 md:mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="brand-card rounded-3xl overflow-hidden shadow-2xl shadow-[#8700ff]/10"
          >
            <img src={Aboutus} alt="Lasglowtech team" className="w-full h-72 md:h-[22rem] object-cover" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.08 } } }}
          >
            <span className="section-tag"><span className="dot-live" />Who we are</span>
            <h2 className="text-white leading-tight mb-5">
              A creative technology partner for modern brands
            </h2>
            <p className="text-sm text-[#9b8cb5] leading-relaxed mb-4">
              Launched in 2021, we combine design, engineering, and strategy to build digital products that are useful, reliable, and growth-ready.
            </p>
            <p className="text-sm text-[#9b8cb5] leading-relaxed mb-6">
              We partner with startups, founders, and teams — one team for design, code, and delivery, with clear communication throughout.
            </p>
            <Link to="/about" className="text-sm font-semibold text-[#8700ff] hover:text-orange-500 transition-colors">
              Learn more about us →
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="brand-card grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 mb-12 md:mb-16"
        >
          {stats.map(({ value, label, Icon }) => (
            <div key={label} className="text-center md:text-left">
              <Icon className="w-5 h-5 text-[#8700ff] mx-auto md:mx-0 mb-2" />
              <p className="type-stat-lg text-white">{value}</p>
              <p className="text-sm text-[#9b8cb5] mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

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
      </div>
    </section>
  );
}
