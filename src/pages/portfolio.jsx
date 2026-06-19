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

      {/* Hero — short copy + gradient accent + framed panel */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-18 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500 opacity-[0.05] blur-[80px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <nav
            className="flex items-center justify-center gap-2 text-sm text-[#9b8cb5] mb-8"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-orange-500">Portfolio</span>
          </nav>

          <div className="relative rounded-[1.75rem] border border-[#8700ff]/25 bg-gradient-to-b from-[#1a1030]/95 to-[#120b1f]/60 px-6 py-10 sm:px-10 sm:py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_rgba(135,0,255,0.15)] backdrop-blur-md">
            <div
              className="pointer-events-none absolute -top-px left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#8700ff]/80 to-transparent"
              aria-hidden
            />
            <span className="section-tag justify-center">
            PROJECTS
            </span>
            <h1 className="mt-5 text-white">
              Sites & brands{" "}
              <span className="bg-gradient-to-r from-[#8700ff] via-[#c084fc] to-orange-500 bg-clip-text text-transparent">
                built to perform
              </span>
            </h1>
            <p className="mt-4 type-muted max-w-sm mx-auto">
            Websites, branding, and creative projects. Filter by category below.
            </p>
          </div>
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
            <h2 className="text-white">Selected projects in depth</h2>
            <p className="mt-3 type-muted max-w-2xl mx-auto">How we approach challenges and deliver outcomes for clients.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, i) => (
              <motion.article key={study.title}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.4, delay:i*0.1 }}
                className="brand-card p-6 md:p-7 flex flex-col">
                <span className="type-caption font-semibold text-orange-500 uppercase tracking-wider mb-2 block">{study.category}</span>
                <h3 className="text-white mb-3">{study.title}</h3>
                <p className="type-muted mb-4">{study.summary}</p>
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


