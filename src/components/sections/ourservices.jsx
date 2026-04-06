import { Link } from "react-router-dom";
import Services from "../../assets/data/serviceslist";
import { useEffect, useRef } from "react";

export default function OurServices() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }), { threshold: 0.1 });
    ref.current?.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#1a1030]" id="our-services" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14 reveal">
          <span className="section-tag"><span className="dot-live" />Our Services</span>
          <h2 className="font-extrabold text-3xl md:text-4xl text-white mb-4 tracking-tight">
            Strategy, Design & Engineering<br className="hidden md:block" /> Built for Results
          </h2>
          <p className="text-[#9b8cb5] max-w-xl mx-auto leading-relaxed">
            A digital infrastructure platform for businesses and tech talent across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Services.map((s, i) => (
            <Link to={`/services/${s.link.split("/").pop()}`} key={s.link}
              className={`brand-card group flex flex-col overflow-hidden reveal reveal-d${Math.min(i+1,4)}`}>
              <div className="relative overflow-hidden h-44">
                <img src={s.Picture} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1030] via-[#1a1030]/50 to-transparent" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-base text-white mb-2 group-hover:text-orange-500 transition-colors">{s.title}</h3>
                <p className="text-xs text-[#9b8cb5] leading-relaxed line-clamp-3 flex-1">{s.description}</p>
                <span className="mt-4 text-xs font-bold text-[#8700ff] group-hover:translate-x-1 inline-block transition-transform">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

