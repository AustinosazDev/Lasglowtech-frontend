import { Link } from "react-router-dom";
import { Slide2 } from "../images";

export default function QuickContact() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#1a1030]">
      {/* Purple glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8700ff] opacity-10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative brand-card rounded-2xl overflow-hidden shadow-2xl shadow-[#8700ff]/10">
            <img src={Slide2} alt="Lasglowtech workspace" className="w-full h-72 md:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1030]/60 to-transparent" />
          </div>

          {/* Text */}
          <div>
            <span className="section-tag"><span className="dot-live" />Why Choose Us</span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight mb-5">
              Why Choose<br /><span className="text-orange-500">Lasglowtech?</span>
            </h2>
            <p className="text-[#9b8cb5] leading-relaxed mb-8">
              At Lasglowtech we don't just build web apps or sleek designs — we build digital experiences that work and convert.
              Looking for a specific service? We've got creative solutions tailored to your needs.
            </p>

            <div className="space-y-3 mb-8">
              {["Strategy-backed design & development","Transparent pricing in Naira","48-hour turnaround on most projects","Post-launch support & maintenance"].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#8700ff]/20 border border-[#8700ff]/40 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  </span>
                  <span className="text-sm text-[#c4b3d8] font-semibold">{t}</span>
                </div>
              ))}
            </div>

            <Link to="/services" className="btn-primary">Explore Our Services →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


