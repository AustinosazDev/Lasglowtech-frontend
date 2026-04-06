import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../utils/seo";
import Subscription from "../components/sections/subscription";
import QuickContact from "../components/sections/Quickcontact";
import PortfolioTabs from "../components/sections/portfoliotabs";
import CompanySlider from "../utils/slideshow";
import { FaExternalLinkAlt } from "react-icons/fa";

const caseStudies = [
  { title:"UR9 Group", category:"Websites", summary:"Corporate website for UR9 Group with modern layout, clear navigation, and brand-aligned design.", challenge:"Client needed a professional online presence to showcase services and build credibility.", solution:"Delivered a responsive website with clean UI, fast performance, and easy content updates.", result:"Improved brand visibility and lead generation through a polished digital presence.", link:"https://ur9group.com", cta:"View site" },
  { title:"Phoenixs Tech", category:"Websites", summary:"React/Vite-powered tech company site for Phoenixs Tech (Poland) with a global audience in mind.", challenge:"Tech company required a scalable, performant site that reflects their engineering standards.", solution:"Built with React and Vite for speed and maintainability; responsive and accessible.", result:"Fast load times and a professional platform that supports international reach.", link:"https://phoenixstech.com", cta:"View site" },
  { title:"BriteBerry Branding", category:"Branding", summary:"End-to-end packaging and brand identity for BriteBerry, from concept to final assets.", challenge:"New brand needed distinctive packaging and visual identity to stand out on shelf and online.", solution:"Created cohesive packaging design, color system, and brand guidelines for consistency.", result:"A recognizable brand identity ready for product launch and marketing campaigns.", link:"https://dribbble.com/shots/27016784-Brite-Berry-Branding", cta:"View project" },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Lasglowtech | Portfolio"
        description="Explore our portfolio of websites, branding, and design projects delivered for clients across Nigeria and globally."
        keywords="Portfolio, Lasglowtech, case studies, web design, branding Nigeria"
        url="https://www.lasglowtech.com.ng/portfolio"
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500 opacity-[0.05] blur-[80px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-tag justify-center"><span className="dot-live"/>Portfolio</span>
          <h1 className="font-extrabold text-4xl md:text-5xl text-white tracking-tight mb-5">Work we're proud of</h1>
          <p className="text-[#9b8cb5] text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Websites, branding, and creative projects delivered with style, precision, and a focus on results.
          </p>
          <nav className="flex items-center justify-center gap-2 text-sm text-[#9b8cb5]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-orange-500">Portfolio</span>
          </nav>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="max-w-3xl mx-auto text-center">
          <h2 className="font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-4">
            Discover who we've rendered creative services to
          </h2>
          <p className="text-[#9b8cb5] leading-relaxed">
            We've delivered results with style, precision, and a touch of sleek innovation. Filter by category below to explore our work.
          </p>
        </motion.div>
      </section>

      <CompanySlider />

      {/* Portfolio tabs */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <PortfolioTabs />
      </section>

      {/* Case studies */}
      <section className="border-t border-[#8700ff]/15 bg-[#1a1030]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="text-center mb-14">
            <span className="section-tag justify-center"><span className="dot-live"/>Case studies</span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight">Selected projects in depth</h2>
            <p className="mt-3 text-[#9b8cb5] max-w-2xl mx-auto">A closer look at how we approach challenges and deliver outcomes for our clients.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, i) => (
              <motion.article key={study.title}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.4, delay:i*0.1 }}
                className="brand-card p-6 md:p-7 flex flex-col">
                <span className="text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-2">{study.category}</span>
                <h3 className="font-extrabold text-lg text-white mb-3">{study.title}</h3>
                <p className="text-[#9b8cb5] text-sm mb-4 leading-relaxed">{study.summary}</p>
                <div className="space-y-2 text-sm flex-1">
                  {[["Challenge", study.challenge],["Solution", study.solution],["Result", study.result]].map(([k,v]) => (
                    <p key={k} className="text-[#9b8cb5]"><span className="font-bold text-[#c4b3d8]">{k}:</span> {v}</p>
                  ))}
                </div>
                <a href={study.link} target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-[#8700ff] font-bold text-sm hover:text-orange-500 transition-colors">
                  {study.cta} <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <QuickContact />
      <Subscription />
    </div>
  );
}


