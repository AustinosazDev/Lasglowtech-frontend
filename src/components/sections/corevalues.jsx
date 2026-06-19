import { motion } from "framer-motion";
import { FaLightbulb, FaBullseye, FaShieldAlt } from "react-icons/fa";

const values = [
  {
    title: "Creativity",
    desc: "We blend design thinking with cutting-edge technology to craft unique digital experiences that elevate your brand.",
    Icon: FaLightbulb,
    color: "#8700ff",
  },
  {
    title: "Precision",
    desc: "From pixel-perfect designs to clean optimized code — we deliver solutions with accuracy, consistency, and attention to detail.",
    Icon: FaBullseye,
    color: "#f97316",
  },
  {
    title: "Reliability",
    desc: "With transparent processes, timely delivery, and ongoing support, we ensure your success every step of the way.",
    Icon: FaShieldAlt,
    color: "#8700ff",
  },
];

export default function CoreValues() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-tag justify-center"><span className="dot-live" />Core Values</span>
          <h2 className="text-white">What we stand for</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              custom={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="brand-card p-7 text-left group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `${v.color}22`, border: `1px solid ${v.color}44` }}
              >
                <v.Icon className="text-2xl" style={{ color: v.color }} />
              </div>
              <h3 className="text-white mb-3 group-hover:text-orange-500 transition-colors">{v.title}</h3>
              <p className="text-sm text-[#9b8cb5] leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
