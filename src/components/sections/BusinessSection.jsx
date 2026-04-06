import { useState } from "react";
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";
import { Link } from "react-router-dom";

const stats = [
  { value:100,  suffix:"+",    label:"Clients served" },
  { value:7,    suffix:"yrs+", label:"Product delivery" },
  { value:2500, suffix:"+",    label:"Creatives designed" },
  { value:15,   suffix:"+",    label:"Websites built" },
];

export default function StatsSection() {
  const [on, setOn] = useState(false);
  return (
    <ScrollTrigger onEnter={() => setOn(true)}>
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#120b1f]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <span className="section-tag"><span className="dot-live" />By the numbers</span>
              <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight mb-4">
                Ready to Scale<br />Your Brand?
              </h2>
              <p className="text-sm text-[#9b8cb5] leading-relaxed mb-7 max-w-sm">
                We design and deliver tailored digital solutions — from high-converting landing pages to full business platforms that load fast, look premium, and perform reliably.
              </p>
              <Link to="/about" className="btn-primary">Learn More →</Link>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="brand-card p-6 md:p-8 flex flex-col items-center text-center">
                  <p className="font-extrabold text-3xl md:text-4xl text-orange-500">
                    {on ? <CountUp start={0} end={s.value} duration={2.4} suffix={s.suffix} /> : `0${s.suffix}`}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[#9b8cb5] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ScrollTrigger>
  );
}

