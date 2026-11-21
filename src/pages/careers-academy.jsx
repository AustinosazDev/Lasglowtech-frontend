

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaPalette,
  FaBookOpen,
  FaArrowRight,
  FaChevronLeft,
  FaBriefcase,
  FaUserGraduate,
} from "react-icons/fa";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { logoImg as LOGO } from "../components/images";
import careerImage from "../assets/images/careerimage.png";
import { CourseCardSkeletonGrid } from "../components/skeletons/CardSkeletons";
import BgPatternOverlay from "../components/BgPatternOverlay";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";

const whyLearn = [
  {
    icon: FaLaptopCode,
    title: "Expert-Led Courses",
    text: "Learn from industry experts with hands-on experience and up-to-date tech skills.",
  },
  {
    icon: FaPalette,
    title: "Comprehensive Curriculum",
    text: "Wide range of tech-related courses tailored to your interests and career goals.",
  },
  {
    icon: FaBookOpen,
    title: "Practical Projects",
    text: "Real-world projects that reinforce learning and build job-ready skills.",
  },
];

const HERO_STATS = [
  { value: "Actively", label: "Training ", Icon: FaUserGraduate },
  { value: "6+", label: "Career-Focused Tracks", Icon: FaBriefcase },
  { value: "100%", label: "Practical Projects", Icon: FaBookOpen },
];

/* ─── Nav links (mirrors TSAcademy structure) ──────────────────── */
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", href: "#courses" },
  { label: "About Us", to: "/about" },
 
  { label: "Contact", to: "/contact" },
];

const CareersAcademy = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    instance
      .get("/lms/courses")
      .then((res) => {
        if (!cancelled && Array.isArray(res.data)) setCourses(res.data);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredCourses = courses.filter((c) => c.isFeatured);
  const otherCourses = courses.filter((c) => !c.isFeatured);
  const displayCourses = featuredCourses.length
    ? [...featuredCourses, ...otherCourses]
    : courses;

  return (
    <div className="relative min-h-screen bg-bgcolor text-textcolor2 overflow-hidden">
      <BgPatternOverlay glow />
      <div className="relative z-10">
      <SEO
        title="Academy | Lasglowtech — IT Training & Courses"
        description="Expert-led courses in web development, design, and digital skills. Build job-ready skills with practical projects from Lasglowtech Academy."
        url="/careers"
        image={LOGO}
      />

      {/* ─── HEADER ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO} width={38} height={38} alt="Lasglowtech" className="rounded-lg" />
            <span className="font-bold hidden md:block text-base text-zinc-900 tracking-tight">
              Lasglowtech Academy
            </span>
          </Link>

          {/* Pill nav – matches TSAcademy style */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100 rounded-full px-2 py-1.5">
            {NAV_LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-zinc-700 hover:bg-white hover:text-zinc-900 transition-all"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-zinc-700 hover:bg-white hover:text-zinc-900 transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="hidden sm:block text-sm font-medium text-zinc-700 hover:text-Primarycolor transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-gradient-to-r from-Primarycolor to-Primarycolor1 hover:opacity-95 transition-opacity shadow-md shadow-Primarycolor/30"
            >
              Apply Now
            </Link>
            {/* Mobile back */}
            <Link
              to="/"
              className="md:hidden text-sm text-zinc-500 flex items-center gap-1"
            >
              <FaChevronLeft className="w-3 h-3" />
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-visible min-h-[min(90vh,820px)] bg-gradient-to-br from-zinc-950 via-bgcolor to-[#1a0d2e]">
        <div
          className="absolute inset-0 bg-gradient-to-tr from-Primarycolor/35 via-transparent to-Secondarycolor/20 pointer-events-none"
          aria-hidden
        />
        {/* Brand glow — right, behind image */}
        <div
          className="absolute right-0 top-0 w-[55%] h-full pointer-events-none bg-[radial-gradient(ellipse_70%_85%_at_92%_48%,rgba(135,0,255,0.38),transparent_68%)]"
          aria-hidden
        />
        <div
          className="absolute right-[10%] bottom-[15%] w-[45%] h-[50%] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12),transparent_65%)]"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col overflow-x-visible">
          {/* ~48% image column so full PNG isn’t squeezed (narrow 0.52fr was clipping the figure) */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] gap-5 max-lg:gap-6 lg:gap-8 xl:gap-12 items-center w-full min-w-0 py-10 max-lg:pt-6 lg:py-16 xl:py-20 flex-1 overflow-visible">
            {/* ── LEFT: copy (wider column) ───────────────────────────── */}
            <motion.div
              className="text-white order-1 lg:order-1 max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-textcolor2 mb-5 mt-6 [text-wrap:balance] font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05]">
                <span className="block text-white">Launch Your Career</span>
                <span className="block mt-1.5 sm:mt-2 text-white">
                  for{"\u00a0"}the{" "}
                  <span className="bg-gradient-to-r from-Secondarycolor via-Secondarycolor to-Secondarycolor2 bg-clip-text text-transparent">
                    Future Workforce
                  </span>
                </span>
              </h1>

              <p className="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
              Learn from experts, build portfolio projects, and grow with mentorship designed to move you
               from beginner to confident professional.
              </p>

             

              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[0.9375rem] font-semibold text-white bg-gradient-to-r from-Primarycolor to-Primarycolor1 shadow-xl shadow-Primarycolor/35 hover:opacity-95 transition-opacity"
                  >
                    Apply now
                  </Link>
                </motion.div>

                <motion.a
                  href="#courses"
                  className="inline-flex items-center bg-white/10 backdrop-blur-sm gap-2 px-6 py-3.5 rounded-full text-[0.9375rem] font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore our Courses
                  <FaArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>

            {/* ── RIGHT: hero image (larger); mobile: lower + soft bottom feather into stats bar ─ */}
            <motion.div
              className="order-2 lg:order-2 relative flex min-w-0 justify-center lg:justify-center items-end select-none overflow-visible min-h-[280px] max-lg:min-h-[min(52vh,420px)] lg:min-h-[min(560px,70vh)] max-lg:pt-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <div
                className="absolute inset-x-[-12%] lg:inset-x-[-8%] top-[2%] bottom-0 max-lg:inset-x-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] pointer-events-none bg-[radial-gradient(ellipse_80%_88%_at_50%_45%,rgba(135,0,255,0.2),transparent_72%)]"
                aria-hidden
              />

              {/* Bottom feather (mobile + desktop); mobile: shift figure lower toward stats card */}
              <div className="relative z-[1] flex w-full min-w-0 justify-center max-lg:translate-y-8 sm:max-lg:translate-y-10 max-lg:mt-2 lg:translate-y-0 lg:justify-center">
                <style>
                  {`
                    .academy-hero-mask {
                      -webkit-mask-size: 100% 100%;
                      mask-size: 100% 100%;
                      -webkit-mask-repeat: no-repeat;
                      mask-repeat: no-repeat;
                    }
                    @media (max-width: 1023px) {
                      .academy-hero-mask {
                        -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.82) 64%, rgba(0,0,0,0.25) 82%, transparent 100%);
                        mask-image: linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.82) 64%, rgba(0,0,0,0.25) 82%, transparent 100%);
                      }
                    }
                    @media (min-width: 1024px) {
                      .academy-hero-mask {
                        -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.55) 86%, rgba(0,0,0,0.12) 94%, transparent 100%);
                        mask-image: linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.55) 86%, rgba(0,0,0,0.12) 94%, transparent 100%);
                      }
                    }
                  `}
                </style>
                <div className="academy-hero-mask relative flex w-full max-w-full min-w-0 justify-center lg:max-w-[min(100%,640px)] xl:max-w-[min(100%,720px)]">
                  <img
                    src={careerImage}
                    alt="Lasglowtech Academy learner"
                    className="relative mx-auto h-auto w-auto max-w-full object-contain object-bottom drop-shadow-[0_40px_80px_rgba(0,0,0,0.48)] max-w-[min(92vw,480px)] sm:max-w-[min(90vw,540px)] lg:max-w-[min(100%,720px)] max-h-[min(64vh,520px)] sm:max-h-[min(70vh,600px)] md:max-h-[min(76vh,680px)] lg:max-h-[min(82vh,880px)] xl:max-h-[min(84vh,920px)] 2xl:max-h-[min(86vh,960px)]"
                    width={1610}
                    height={1080}
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating stats bar (reference-style white card + circular icons) */}
          <div className="relative z-30 mx-auto w-full max-w-6xl px-0 sm:px-2 max-lg:-mt-[4.5rem] lg:-mt-14 mb-2 md:mb-4">
            <motion.div
              className="rounded-3xl border border-zinc-200/90 bg-white px-6 py-8 md:px-12 md:py-10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55, ease: "easeOut" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
                {HERO_STATS.map((stat) => {
                  const StatIcon = stat.Icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex flex-row sm:flex-col items-center gap-4 sm:gap-4 py-7 sm:py-2 first:pt-0 sm:first:pt-2 sm:px-6 sm:first:pl-2 sm:last:pr-2"
                    >
                      <div className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-Primarycolor/15 to-Secondarycolor/10 text-Primarycolor ring-2 ring-Primarycolor/20">
                        <StatIcon className="h-6 w-6" aria-hidden />
                      </div>
                      <div className="text-left sm:text-center flex-1 sm:flex-none min-w-0">
                        <p className="type-stat-lg tabular-nums text-zinc-900">
                          {stat.value}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1 font-medium leading-snug">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave → site background */}
        <div className="absolute bottom-0 left-0 right-0 z-[5] overflow-hidden leading-none pointer-events-none" aria-hidden>
          <svg
            viewBox="0 0 1440 56"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block fill-bgcolor"
            preserveAspectRatio="none"
          >
            <path d="M0,32 C360,56 1080,0 1440,32 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>

      {/* ─── WHY LEARN WITH US ───────────────────────────────────────── */}
      <section className="pt-12 md:pt-16 pb-14 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-textcolor2 mb-2">
            Why learn with us?
          </h2>
          <p className="text-muted mb-10 max-w-2xl">
            Practical, industry-aligned courses to build skills and career confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyLearn.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="brand-card p-6">
                  <span className="inline-flex w-12 h-12 rounded-xl bg-Primarycolor/20 text-Secondarycolor items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-textcolor2 mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── COURSES LIST ────────────────────────────────────────────── */}
      <section
        id="courses"
        className="py-12 md:py-16  border-Primarycolor/15 bg-bgcolor2/20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-textcolor2 mb-2">
            {featuredCourses.length ? "Most popular" : "Courses"}
          </h2>
          <p className="text-muted mb-10">
            Click a course to see full details. Sign in or register to enroll.
          </p>

          {loading ? (
            <CourseCardSkeletonGrid count={6} />
          ) : displayCourses.length === 0 ? (
            <div className="brand-card p-12 text-center">
              <p className="text-muted">No courses published yet. Check back later.</p>
              <Link to="/" className="inline-block mt-4 text-Secondarycolor hover:underline">
                Back to main site
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/careers/courses/${course.slug || course.id}`}
                  className="group brand-card rounded-2xl overflow-hidden"
                >
                  <div className="aspect-video bg-bgcolor/60 relative overflow-hidden">
                    <img
                      src={course.imageUrl || PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    {course.isFeatured && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-Secondarycolor/90 text-white text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                      {course.level || "All levels"}
                    </span>
                    <h3 className="text-lg font-semibold text-textcolor2 mt-1 group-hover:text-Secondarycolor transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted mt-2 line-clamp-2">{course.summary || ""}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-Secondarycolor font-medium mt-3">
                      View course
                      <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
};

export default CareersAcademy;