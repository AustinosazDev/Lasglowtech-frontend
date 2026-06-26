import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import instance from "../../config/axios.config";
import PortfolioCard from "../portfoliocards";
import ProjectsLoadError from "../ProjectsLoadError";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop";

const ProjectsMessage = ({ icon: Icon, title, message, action }) => (
  <div className="col-span-full flex justify-center py-8 md:py-12">
    <div className="brand-card max-w-md w-full rounded-2xl border border-[#8700ff]/20 px-8 py-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8700ff]/15 border border-[#8700ff]/25 text-[#c084fc]">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#9b8cb5]">{message}</p>
      {action}
    </div>
  </div>
);

const ProjectTabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        instance.get("/projects"),
        instance.get("/projects/categories"),
      ]);
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch {
      setError(true);
      setProjects([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = useMemo(() => ["All", ...categories], [categories]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return projects;
    return projects.filter((item) => item.category === activeTab);
  }, [projects, activeTab]);

  const showCategoryTabs = !loading && !error && projects.length > 0;

  return (
    <div className="text-[#e8ddf8] w-full max-w-7xl mx-auto mt-2 py-8 md:py-16">
      {showCategoryTabs && (
      <div
        className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-6 md:mb-10 px-1"
        role="tablist"
        aria-label="Project categories"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={[
                "relative min-h-[44px] rounded-xl font-semibold tracking-wide transition-all duration-300",
                "text-xs sm:text-sm md:text-base px-4 py-2.5 sm:px-6 sm:py-3",
                "border active:scale-[0.97]",
                isActive
                  ? "border-transparent bg-gradient-to-r from-[#8700ff] via-[#7c3aed] to-[#c026d3] text-white shadow-[0_0_28px_rgba(135,0,255,0.42),0_4px_20px_rgba(249,115,22,0.15)] ring-2 ring-white/25 ring-offset-2 ring-offset-[#120b1f] sm:scale-[1.02]"
                  : "border-white/20 bg-white/[0.07] text-[#e8ddf8] backdrop-blur-md hover:border-[#8700ff]/55 hover:bg-[#8700ff]/20 hover:text-white hover:shadow-[0_8px_24px_rgba(135,0,255,0.2)]",
              ].join(" ")}
            >
              {isActive && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/10"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          );
        })}
      </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="brand-card rounded-2xl h-80 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <ProjectsLoadError onRetry={fetchData} />
      ) : (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 pt-2 pb-4 md:pt-4 md:pb-8 items-stretch">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <PortfolioCard
                key={item.id}
                image={item.imageUrl || PLACEHOLDER_IMAGE}
                alt={item.title}
                title={item.title}
                description={item.description}
                link={item.externalLink || "#"}
                delay={index * 0.1}
                featured={Boolean(item.isFeatured)}
              />
            ))
          ) : (
            <ProjectsMessage
              icon={FaFolderOpen}
              title="No projects here yet"
              message={
                activeTab === "All"
                  ? "New work will appear here once projects are published. Check back soon."
                  : `No projects in "${activeTab}" yet. Try another category or view all projects.`
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectTabs;
