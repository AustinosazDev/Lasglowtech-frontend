import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import faqs from "../assets/data/faq";

export default function FaqSection() {
  const [active, setActive] = useState(null);
  const toggle = i => setActive(i === active ? null : i);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#1a1030]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-tag justify-center"><span className="dot-live" />FAQ</span>
          <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight">Frequently asked questions</h2>
          <p className="mt-3 text-[#9b8cb5] max-w-xl mx-auto">Find quick answers to common questions. Can't find yours? Just reach out.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[0,1].map(col => (
            <div key={col} className="space-y-2">
              {faqs.filter((_,i) => i % 2 === col).map((faq, i) => {
                const gi = i * 2 + col;
                const isOpen = active === gi;
                return (
                  <div key={gi} className="brand-card overflow-hidden">
                    <button onClick={() => toggle(gi)}
                      className="w-full flex justify-between items-center text-left p-5 text-white font-bold text-sm hover:text-orange-500 transition-colors gap-4">
                      {faq.question}
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-orange-500 text-white" : "bg-[#8700ff]/20 text-[#8700ff]"}`}>
                        {isOpen ? <FaMinus className="w-2.5 h-2.5" /> : <FaPlus className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-[#9b8cb5] leading-relaxed border-t border-[#8700ff]/10 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


