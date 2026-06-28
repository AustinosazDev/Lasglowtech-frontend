import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Helmet } from "react-helmet";
import faqs from "../assets/data/faq";
import { faqSchema } from "../utils/structuredData";

export default function FaqSection() {
  const [active, setActive] = useState(null);
  const toggle = (i) => setActive(i === active ? null : i);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12" aria-labelledby="faq-heading">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema(faqs))}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-tag justify-center">
            <span className="dot-live" />
            FAQ
          </span>
          <h2 id="faq-heading" className="text-white">
            Frequently asked questions
          </h2>
          <p className="mt-3 type-muted max-w-xl mx-auto">Quick answers to common questions.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1].map((col) => (
            <div key={col} className="space-y-2">
              {faqs.filter((_, i) => i % 2 === col).map((faq, i) => {
                const gi = i * 2 + col;
                const isOpen = active === gi;
                const panelId = `faq-panel-${gi}`;
                const buttonId = `faq-button-${gi}`;
                return (
                  <div key={gi} className="brand-card overflow-hidden">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(gi)}
                      className="w-full flex justify-between items-center text-left p-5 text-white font-semibold text-sm hover:text-orange-500 transition-colors gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50"
                    >
                      {faq.question}
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isOpen ? "bg-orange-500 text-white" : "bg-[#8700ff]/20 text-[#8700ff]"
                        }`}
                        aria-hidden
                      >
                        {isOpen ? <FaMinus className="w-2.5 h-2.5" /> : <FaPlus className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="px-5 pb-5 text-sm text-[#9b8cb5] leading-relaxed border-t border-[#8700ff]/10 pt-3"
                      >
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
