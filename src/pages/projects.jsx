import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import SEO from "../utils/seo";
import { breadcrumbSchema } from "../utils/structuredData";
import Subscription from "../components/sections/subscription";
import QuickContact from "../components/sections/Quickcontact";
import ProjectTabs from "../components/sections/projecttabs";
import CompanySlider from "../utils/slideshow";
import instance from "../config/axios.config";

export default function ProjectsPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loadingStudies, setLoadingStudies] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoadingStudies(true);
      try {
        const res = await instance.get("/projects/case-studies");
        setCaseStudies(Array.isArray(res.data) ? res.data : []);
      } catch {
        setCaseStudies([]);
      } finally {
        setLoadingStudies(false);
      }
    };

    fetchCaseStudies();
  }, []);

  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Projects | Lasglowtech — Case Studies & Portfolio"
        description="See websites, mobile apps, branding, and digital products Lasglowtech has delivered for clients across Nigeria and globally."
        url="/projects"
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ])}
      />

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
            <span className="text-orange-500">Projects</span>
          </nav>

          <div className="relative rounded-[1.75rem] border border-[#8700ff]/25 bg-gradient-to-b from-[#1a1030]/95 to-[#120b1f]/60 px-6 py-10 sm:px-10 sm:py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_rgba(135,0,255,0.15)] backdrop-blur-md">
            <div
              className="pointer-events-none absolute -top-px left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#8700ff]/80 to-transparent"
              aria-hidden
            />
            <span className="section-tag justify-center">PROJECTS</span>
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

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <ProjectTabs />
      </section>

      <section className="border-t border-[#8700ff]/15 bg-[#1a1030]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="text-center mb-14">
            <span className="section-tag justify-center">
              <span className="dot-live" />
              Case studies
            </span>
            <h2 className="text-white">Selected projects in depth</h2>
            <p className="mt-3 type-muted max-w-2xl mx-auto">
              How we approach challenges and deliver outcomes for clients.
            </p>
          </div>

          {loadingStudies ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="brand-card h-72 animate-pulse bg-white/5 rounded-2xl" />
              ))}
            </div>
          ) : caseStudies.length === 0 ? (
            <p className="text-center text-[#9b8cb5]">Case studies will appear here once added in admin.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {caseStudies.map((study, i) => (
                <motion.article
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="brand-card p-6 md:p-7 flex flex-col"
                >
                  <span className="type-caption font-semibold text-orange-500 uppercase tracking-wider mb-2 block">
                    {study.category}
                  </span>
                  <h3 className="text-white mb-3">{study.title}</h3>
                  <p className="type-muted mb-4">{study.summary}</p>
                  <div className="space-y-2 text-sm flex-1">
                    {[
                      ["Challenge", study.challenge],
                      ["Solution", study.solution],
                      ["Result", study.result],
                    ].map(([key, value]) =>
                      value ? (
                        <p key={key} className="text-[#9b8cb5]">
                          <span className="font-bold text-[#c4b3d8]">{key}:</span> {value}
                        </p>
                      ) : null
                    )}
                  </div>
                  {study.externalLink && (
                    <a
                      href={study.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-[#8700ff] font-bold text-sm hover:text-orange-500 transition-colors"
                    >
                      {study.ctaLabel || "View project"} <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <QuickContact />
      <Subscription />
    </div>
  );
}
