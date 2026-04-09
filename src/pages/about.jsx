import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { Contactimg } from "../components/images";
import Subscription from "../components/sections/subscription";
import MeetTheTeam from "../components/meetheteam";
import CoreValues from "../components/sections/corevalues";
import FaqSection from "../components/Faq";
import SEO from "../utils/seo";

const ABOUT_IMG = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80";

const capabilities = [
  "Web development for business platforms, e-commerce, and high-converting websites that are fast, secure, and scalable.",
  "Mobile app development for Android and iOS with native and cross-platform options, from MVP to full product launch.",
  "UI/UX design systems focused on clarity, usability, and conversion—wireframes, prototypes, and design handoff.",
  "Brand and graphic design for campaigns, social content, and customer engagement that stays on-brand.",
  "Professional tutoring and IT training programmes to upskill your team or start a career in tech.",
  "Service catalogue with fixed-price packages and instant online checkout so you can get started without lengthy quotes.",
];

const process = [
  { title:"Discovery",     text:"We start by aligning on your business goals, audience, and success metrics. We map the customer journey and technical direction so every decision supports your vision." },
  { title:"Design & Build", text:"Our team turns the roadmap into production-ready design and code with iterative feedback loops so you see progress early and can steer as we go." },
  { title:"Launch & Growth", text:"We don't stop at launch. We deploy with care, monitor performance, and optimize based on real usage so your product continues to perform as you scale." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="About Lasglowtech | Digital Agency, Tutoring & Service Catalogue Nigeria"
        description="Lasglowtech: web and mobile development, UI/UX design, IT tutoring and training, and a service catalogue with instant checkout. Learn about our team, process, and how we help brands grow."
        keywords="About Lasglowtech, digital agency Nigeria, web development, tutoring, tech training, service catalogue, instant checkout"
        url="https://www.lasglowtech.com.ng/about"
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${Contactimg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120b1f]/80 to-[#120b1f]" />
        {/* Purple glow */}

        
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">

           <nav className="flex items-center justify-center gap-2 text-sm  pb-8 text-[#9b8cb5]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-orange-500">About</span>
          </nav>
        
          <h2 className="font-bold text-[clamp(2.8rem,7vw,4rem)]  mx-auto text-center max-w-5xl text-white leading-[1.02] tracking-tight mb-6">
            We build digital products<br className="hidden md:block"/> that drive growth
          </h2>
          <p className="text-[#9b8cb5] text-lg max-w-2xl mx-auto leading-relaxed ">
            From strategy and design to development and launch  we help brands compete confidently in a digital-first world with solutions that are useful, reliable, and built to scale.
          </p>
         
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="brand-card rounded-2xl overflow-hidden shadow-2xl shadow-[#8700ff]/10">
            <img src={ABOUT_IMG} alt="Lasglowtech team" className="w-full h-72 md:h-80 object-cover" />
          </div>
          <div>
            <span className="section-tag"><span className="dot-live"/>Who we are</span>
            <h2 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight leading-tight mb-5">
              A creative technology partner<br/>for modern brands
            </h2>
            <p className="text-[#9b8cb5] text-sm leading-relaxed mb-4">
              Lasglowtech began as a vision in 2020 and launched in 2021 with a clear mission: help businesses compete confidently in a digital-first world. We combine design, engineering, and strategy to deliver solutions that are not only beautiful, but useful, reliable, and growth-ready.
            </p>
            <p className="text-[#9b8cb5] text-sm leading-relaxed mb-4">
              We work with startups, founders, and established teams that want better digital products, stronger brand communication, and measurable business outcomes.
            </p>
            <p className="text-[#9b8cb5] text-sm leading-relaxed">
              Our team blends creative and technical skills — so you get one partner who can think in both design and code, communicate in plain language, and keep projects on track.
            </p>
          </div>
        </div>
      </section>

      {/* What we deliver & How we work */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Capabilities */}
          <div className="brand-card p-6 md:p-8">
            <h3 className="font-extrabold text-xl text-white mb-2">What we deliver</h3>
            <p className="text-[#9b8cb5] text-sm mb-6 leading-relaxed">We focus on the disciplines that move the needle for brands: strategy-backed design, solid engineering, and clear communication.</p>
            <ul className="space-y-3">
              {capabilities.map(item => (
                <li key={item} className="flex items-start gap-3 text-[#c4b3d8]">
                  <FaCheckCircle className="text-orange-500 mt-0.5 flex-shrink-0 w-4 h-4" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="brand-card p-6 md:p-8">
            <h3 className="font-extrabold text-xl text-white mb-2">How we work</h3>
            <p className="text-[#9b8cb5] text-sm mb-6 leading-relaxed">We follow a structured but flexible process so you always know where things stand.</p>
            <div className="space-y-4">
              {process.map((step, i) => (
                <div key={step.title} className="brand-card p-5">
                  <p className="text-orange-500 font-extrabold text-sm mb-1">{String(i+1).padStart(2,"0")}. {step.title}</p>
                  <p className="text-sm text-[#9b8cb5] leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="brand-card p-7 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="section-tag"><span className="dot-live"/>Why clients choose us</span>
              <h3 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-4">Practical, transparent,<br/>outcome-focused</h3>
              <p className="text-[#9b8cb5] text-sm leading-relaxed mb-3">Clients trust us because we stay practical, transparent, and outcome-focused. We communicate clearly, build with intent, and align every deliverable with your business priorities.</p>
              <p className="text-[#9b8cb5] text-sm leading-relaxed">Whether you're launching something new or improving what you have, we're here as a long-term partner invested in your success.</p>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {[["2021","Year founded"],["100+","Projects delivered"],["4.9★","Client rating"],["48h","Avg. delivery"]].map(([n,l]) => (
                <div key={l} className="flex items-center gap-4">
                  <span className="font-extrabold text-2xl text-orange-500 w-16">{n}</span>
                  <span className="text-sm text-[#9b8cb5]">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CoreValues />
      <MeetTheTeam />
      <Subscription />
      <FaqSection />
    </div>
  );
}
