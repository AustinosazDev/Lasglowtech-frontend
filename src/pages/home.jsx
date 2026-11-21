import { Link } from "react-router-dom";
import { FaCheckCircle, FaCode, FaLightbulb, FaRocket } from "react-icons/fa";
import CompanySlider from "../utils/slideshow";
import Hero from "../components/sections/hero";
import OurServices from "../components/sections/ourservices";
import AboutSection from "../components/sections/AboutSection";
import FaqSection from "../components/Faq";
import Servicesslide from "../components/sections/Servicesslide";
import StatsSection from "../components/sections/BusinessSection";
import QuickContact from "../components/sections/Quickcontact";
import Subscription from "../components/sections/subscription";
import SEO from "../utils/seo";
import CataloguePreview from "../components/sections/CataloguePreview";
import TestimonialSection from "../components/sections/TestimonialSection";
import BrandedWorkBanner from "../components/sections/BrandedWorkBanner";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, SITE_URL } from "../utils/siteConfig";
import { defaultSiteSchemas } from "../utils/structuredData";

const pillars = [
  { title: "Product Strategy", text: "Clear discovery, scope definition, and execution roadmap aligned to your business goals.", Icon: FaLightbulb },
  { title: "Design & Experience", text: "Modern visual systems and user journeys built for trust, usability, and conversion.", Icon: FaCheckCircle },
  { title: "Engineering Delivery", text: "Scalable frontend/backend implementation with performance and quality assurance.", Icon: FaCode },
  { title: "Launch & Growth", text: "Post-launch support, optimization, and continuous improvements for measurable impact.", Icon: FaRocket },
];

const processFlow = [
  { step: "01", title: "Discovery Session", text: "We map your goals, audience, and product priorities to define a practical plan." },
  { step: "02", title: "Design & Build", text: "Our team designs and implements digital assets with quality checks at every stage." },
  { step: "03", title: "Deploy & Support", text: "We launch, monitor, and optimize with ongoing support based on data and feedback." },
];

export default function Home() {
  return (
    <div className="home-page bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        url={SITE_URL}
        schema={defaultSiteSchemas()}
      />

      <Hero />
      <CompanySlider />
      <AboutSection />
      <BrandedWorkBanner />
      <OurServices />

      <section className="py-20 md:py-28 px-6 md:px-12" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-tag justify-center"><span className="dot-live" />Why Lasglowtech</span>
            <h2 id="why-heading" className="text-white mb-4">Built for brands that want results</h2>
            <p className="type-muted max-w-2xl mx-auto">We combine product thinking, design excellence, and technical depth to help businesses launch and scale with confidence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map(({ title, text, Icon }) => (
              <article key={title} className="brand-card p-6 group">
                <div className="w-11 h-11 rounded-xl bg-[#8700ff]/15 flex items-center justify-center mb-5 group-hover:bg-[#8700ff]/25 transition-colors">
                  <Icon className="w-5 h-5 text-[#8700ff]" aria-hidden />
                </div>
                <h3 className="font-semibold text-white mb-3 group-hover:text-orange-500 transition-colors">{title}</h3>
                <p className="type-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto">
          <div className="brand-card overflow-hidden">
            <div className="px-6 md:px-10 py-6 border-b border-[#8700ff]/15">
              <span className="section-tag"><span className="dot-live" />Execution model</span>
              <h2 id="process-heading" className="text-white">How we deliver</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {processFlow.map((item, i) => (
                <article key={item.step} className={`p-6 md:p-8 ${i < processFlow.length - 1 ? "md:border-r border-[#8700ff]/15" : ""}`}>
                  <p className="font-bold text-2xl text-orange-500 mb-3" aria-hidden>{item.step}</p>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="type-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12" aria-labelledby="more-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="more-heading" className="text-white text-center mb-8">More ways to work with us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { to: "/careers", title: "Tutoring & training", desc: "Structured programmes to upskill your team or start a career in tech — with real-world projects and LMS access.", cta: "Explore careers & learning →" },
              { to: "/catalogues", title: "Service catalogue & instant checkout", desc: "Choose a fixed-price package, pay online, and get started. No lengthy quotes — browse and checkout instantly.", cta: "Browse catalogue →" },
            ].map(({ to, title, desc, cta }) => (
              <Link key={to} to={to} className="brand-card p-6 group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50">
                <h3 className="font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors">{title}</h3>
                <p className="type-muted mb-4">{desc}</p>
                <span className="text-sm font-semibold text-[#8700ff] group-hover:translate-x-1 inline-block transition-transform">{cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CataloguePreview />
      <Servicesslide />
      <TestimonialSection />
      <StatsSection />
      <QuickContact />
      <FaqSection />
      <Subscription />
    </div>
  );
}
