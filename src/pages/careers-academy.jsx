// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   FaGraduationCap,
//   FaLaptopCode,
//   FaPalette,
//   FaBookOpen,
//   FaArrowRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import instance from "../config/axios.config";
// import SEO from "../utils/seo";
// import { LOGO } from "../components/images";

// /* Floating avatar images for hero – young tech African students / diverse learners */
// const HERO_AVATARS = [
//   { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=120&h=120&fit=crop", alt: "Young tech student", position: "top-left", lines: "up" },
//   { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop", alt: "Student with laptop", position: "top-right", lines: "oval" },
//   { src: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=120&h=120&fit=crop", alt: "Young learner with laptop", position: "bottom-left", lines: "down" },
//   { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&h=120&fit=crop", alt: "Tech student", position: "bottom-right", lines: "none" },
// ];

// const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";

// const whyLearn = [
//   {
//     icon: FaLaptopCode,
//     title: "Expert-Led Courses",
//     text: "Learn from industry experts with hands-on experience and up-to-date tech skills.",
//   },
//   {
//     icon: FaPalette,
//     title: "Comprehensive Curriculum",
//     text: "Wide range of tech-related courses tailored to your interests and career goals.",
//   },
//   {
//     icon: FaBookOpen,
//     title: "Practical Projects",
//     text: "Real-world projects that reinforce learning and build job-ready skills.",
//   },
// ];

// const HERO_STATS = [
//   { value: "20,000+", label: "Learners trained" },
//   { value: "40+", label: "Career-focused tracks" },
//   { value: "100%", label: "Practical projects" },
// ];

// const CareersAcademy = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     instance
//       .get("/lms/courses")
//       .then((res) => {
//         if (!cancelled && Array.isArray(res.data)) setCourses(res.data);
//       })
//       .catch(() => {
//         if (!cancelled) setCourses([]);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => { cancelled = true; };
//   }, []);

//   const featuredCourses = courses.filter((c) => c.isFeatured);
//   const otherCourses = courses.filter((c) => !c.isFeatured);
//   const displayCourses = featuredCourses.length ? [...featuredCourses, ...otherCourses] : courses;

//   return (
//     <div className="min-h-screen bg-bgcolor text-textcolor2">
//       <SEO
//         title="Learning Platform | Lasglowtech Academy – Courses & Training"
//         description="Grow your skills with Lasglowtech Academy. Expert-led courses in web development, design, and digital skills. Explore courses and start learning today."
//         keywords="Lasglowtech academy, tech courses Nigeria, learn web development, UI UX training, online courses, skills training"
//         url="https://www.lasglowtech.com.ng/careers"
//       />

//       {/* Minimal Academy Header */}
//       <header className="sticky top-0 z-50 border-b border-Primarycolor/20 bg-bgcolor2/95 backdrop-blur-sm">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-16">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor transition-colors"
//           >
//             <img src={LOGO} width={36} height={36} alt="Lasglowtech" className="rounded" />
//             <span className="font-semibold text-sm md:text-base">Lasglowtech Academy</span>
//           </Link>
//           <div className="flex items-center gap-3">
//             <Link
//               to="/"
//               className="text-sm text-muted hover:text-Secondarycolor transition-colors flex items-center gap-1"
//             >
//               <FaChevronLeft className="w-3.5 h-3.5" />
//               Back 
//             </Link>
//             <Link
//               to="/auth/login"
//               className="text-sm font-medium text-textcolor2 hover:text-Secondarycolor transition-colors"
//             >
//               Login
//             </Link>
//             <Link
//               to="/auth/register"
//               className="text-sm font-medium px-4 py-2 rounded-lg bg-Primarycolor text-white hover:bg-Primarycolor/90 transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero – interactive with floating avatars and decorative lines */}
//       <section className="relative border-b border-Primarycolor/20 bg-gradient-to-br from-Primarycolor/20 via-bgcolor2 to-Primarycolor1/20 overflow-hidden min-h-[420px] md:min-h-[520px] flex items-center">
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-Primarycolor/20 blur-3xl" />
//           <div className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-Primarycolor1/20 blur-3xl" />
//         </div>
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full relative">
//           {/* Floating avatars with decorative lines */}
//           {HERO_AVATARS.map((avatar, i) => (
//             <motion.div
//               key={avatar.position}
//               className="absolute z-0"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{
//                 opacity: 1,
//                 scale: 1,
//                 y: [0, -5, 0],
//               }}
//               transition={{
//                 opacity: { duration: 0.4, delay: i * 0.12 },
//                 scale: { duration: 0.4, delay: i * 0.12 },
//                 y: { duration: 3 + i * 0.5, repeat: Infinity, repeatDelay: 0.5 },
//               }}
//               style={
//                 avatar.position === "top-left"
//                   ? { top: "8%", left: "4%", maxWidth: "clamp(64px, 12vw, 88px)" }
//                   : avatar.position === "top-right"
//                   ? { top: "12%", right: "6%", maxWidth: "clamp(64px, 12vw, 88px)" }
//                   : avatar.position === "bottom-left"
//                   ? { bottom: "18%", left: "6%", maxWidth: "clamp(64px, 12vw, 88px)" }
//                   : { bottom: "12%", right: "8%", maxWidth: "clamp(64px, 12vw, 88px)" }
//               }
//             >
//               <motion.div
//                 className="relative"
//                 whileHover={{ scale: 1.08 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 {/* Decorative lines – radiating up */}
//                 {avatar.lines === "up" && (
//                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 -z-10">
//                     {[1, 2, 3].map((j) => (
//                       <motion.span
//                         key={j}
//                         className="block w-0.5 h-3 rounded-full bg-Primarycolor/70"
//                         initial={{ scaleY: 0, opacity: 0 }}
//                         animate={{ scaleY: 1, opacity: 1 }}
//                         transition={{ delay: 0.3 + j * 0.05 }}
//                         style={{ transformOrigin: "bottom" }}
//                       />
//                     ))}
//                   </div>
//                 )}
//                 {/* Decorative oval ring */}
//                 {avatar.lines === "oval" && (
//                   <motion.span
//                     className="absolute inset-0 rounded-full border-2 border-Primarycolor/60 -z-10"
//                     style={{ top: "-6px", left: "-6px", right: "-6px", bottom: "-6px" }}
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ delay: 0.25 }}
//                   />
//                 )}
//                 {/* Decorative lines – radiating down */}
//                 {avatar.lines === "down" && (
//                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 -z-10">
//                     {[1, 2, 3].map((j) => (
//                       <motion.span
//                         key={j}
//                         className="block w-0.5 h-3 rounded-full bg-Primarycolor/70"
//                         initial={{ scaleY: 0, opacity: 0 }}
//                         animate={{ scaleY: 1, opacity: 1 }}
//                         transition={{ delay: 0.35 + j * 0.05 }}
//                         style={{ transformOrigin: "top" }}
//                       />
//                     ))}
//                   </div>
//                 )}
//                 <img
//                   src={avatar.src}
//                   alt={avatar.alt}
//                   className="w-full  md:block hidden aspect-square rounded-full object-cover border-2 border-Primarycolor/30 shadow-lg"
//                   onError={(e) => {
//                     e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop";
//                   }}
//                 />
//               </motion.div>
//             </motion.div>
//           ))}

//           {/* Curved decorative line (smiley-style) near headline */}
//           <motion.svg
//             className="absolute hidden md:block pointer-events-none text-Primarycolor/50"
//             width="80"
//             height="40"
//             viewBox="0 0 80 40"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             style={{ right: "18%", top: "42%", zIndex: 0 }}
//             initial={{ pathLength: 0, opacity: 0 }}
//             animate={{ pathLength: 1, opacity: 1 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             <path d="M 10 30 Q 40 8 70 30" strokeLinecap="round" />
//           </motion.svg>

//           {/* Main content – centered */}
//           <div className="relative z-10 text-center max-w-4xl mx-auto">
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-Primarycolor/30 bg-bgcolor/70 text-sm text-Secondarycolor mb-6">
//               <FaGraduationCap className="w-4 h-4" />
//               Scholarship and Career Pathways
//             </div>
//             <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-textcolor2 tracking-tight leading-[1.05]">
//               <span className="block">Redefine Your Future with</span>
//               <span className="block mt-2 bg-gradient-to-r from-Primarycolor to-Secondarycolor bg-clip-text text-transparent">
//                 Job-Ready Tech Skills
//               </span>
//             </h1>
//             <p className="mt-5 text-base md:text-lg text-muted max-w-3xl mx-auto leading-relaxed">
//               Learn from experts, build portfolio projects, and grow with mentorship designed to move you
//               from beginner to confident professional.
//             </p>
//             <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//               <span className="px-3 py-1 rounded-full text-xs md:text-sm border border-Primarycolor/30 bg-bgcolor/60 text-textcolor2">
//                 Beginner-friendly
//               </span>
//               <span className="px-3 py-1 rounded-full text-xs md:text-sm border border-Primarycolor/30 bg-bgcolor/60 text-textcolor2">
//                 Live guidance and support
//               </span>
//               <span className="px-3 py-1 rounded-full text-xs md:text-sm border border-Primarycolor/30 bg-bgcolor/60 text-textcolor2">
//                 Flexible learning schedule
//               </span>
//             </div>
//             <div className="mt-8 flex flex-wrap gap-4 justify-center">
//               <motion.a
//                 href="#courses"
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-semibold hover:opacity-95 transition-opacity"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Explore Programs
//                 <FaArrowRight className="w-4 h-4" />
//               </motion.a>
//               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                 <Link
//                   to="/auth/register"
//                   className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-Primarycolor/40 bg-bgcolor/70 text-Secondarycolor font-semibold hover:bg-Primarycolor/15 transition-colors"
//                 >
//                   Apply for Scholarship
//                 </Link>
//               </motion.div>
//             </div>
//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
//               {HERO_STATS.map((stat) => (
//                 <div
//                   key={stat.label}
//                   className="rounded-xl border border-Primarycolor/25 bg-bgcolor/65 px-4 py-3 backdrop-blur-sm"
//                 >
//                   <p className="text-xl md:text-2xl font-bold text-Secondarycolor">{stat.value}</p>
//                   <p className="text-xs md:text-sm text-muted">{stat.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Why learn with us */}
//       <section className="py-12 md:py-16">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6">
//           <h2 className="text-2xl md:text-3xl font-bold text-textcolor2 mb-2">
//             Why learn with us?
//           </h2>
//           <p className="text-muted mb-10 max-w-2xl">
//             Practical, industry-aligned courses to build skills and career confidence.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {whyLearn.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={item.title}
//                   className="brand-card p-6"
//                 >
//                   <span className="inline-flex w-12 h-12 rounded-xl bg-Primarycolor/20 text-Secondarycolor items-center justify-center">
//                     <Icon className="w-6 h-6" />
//                   </span>
//                   <h3 className="text-lg font-semibold text-textcolor2 mt-4 mb-2">{item.title}</h3>
//                   <p className="text-sm text-muted leading-relaxed">{item.text}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Courses list */}
//       <section id="courses" className="py-12 md:py-16 border-t border-Primarycolor/15 bg-bgcolor2/20">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6">
//           <h2 className="text-2xl md:text-3xl font-bold text-textcolor2 mb-2">
//             {featuredCourses.length ? "Most popular" : "Courses"}
//           </h2>
//           <p className="text-muted mb-10">
//             Click a course to see full details. Sign in or register to enroll.
//           </p>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="brand-card h-64 animate-pulse"
//                 />
//               ))}
//             </div>
//           ) : displayCourses.length === 0 ? (
//             <div className="brand-card p-12 text-center">
//               <p className="text-muted">No courses published yet. Check back later.</p>
//               <Link to="/" className="inline-block mt-4 text-Secondarycolor hover:underline">
//                 Back to main site
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {displayCourses.map((course) => (
//                 <Link
//                   key={course.id}
//                   to={`/careers/courses/${course.slug || course.id}`}
//                   className="group brand-card rounded-2xl overflow-hidden"
//                 >
//                   <div className="aspect-video bg-bgcolor/60 relative overflow-hidden">
//                     <img
//                       src={course.imageUrl || PLACEHOLDER_IMAGE}
//                       alt=""
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       onError={(e) => {
//                         e.target.src = PLACEHOLDER_IMAGE;
//                       }}
//                     />
//                     {course.isFeatured && (
//                       <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-Secondarycolor/90 text-white text-xs font-medium">
//                         Popular
//                       </span>
//                     )}
//                   </div>
//                   <div className="p-5">
//                     <span className="text-xs font-medium text-muted uppercase tracking-wider">
//                       {course.level || "All levels"}
//                     </span>
//                     <h3 className="text-lg font-semibold text-textcolor2 mt-1 group-hover:text-Secondarycolor transition-colors line-clamp-2">
//                       {course.title}
//                     </h3>
//                     <p className="text-sm text-muted mt-2 line-clamp-2">{course.summary || ""}</p>
//                     <span className="inline-flex items-center gap-1 text-sm text-Secondarycolor font-medium mt-3">
//                       View course
//                       <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Footer strip - academy only */}
//       <footer className="border-t border-Primarycolor/20 py-8 bg-bgcolor2/30">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor">
//             <img src={LOGO} width={28} height={28} alt="" className="rounded" />
//             <span className="text-sm font-medium">Lasglowtech Academy</span>
//           </Link>
//           <div className="flex items-center gap-6 text-sm">
//             <Link to="/careers" className="text-muted hover:text-Secondarycolor">
//               Courses
//             </Link>
//             <Link to="/auth/login" className="text-muted hover:text-Secondarycolor">
//               Login
//             </Link>
//             <Link to="/auth/register" className="text-muted hover:text-Secondarycolor">
//               Register
//             </Link>
//             <Link to="/" className="text-muted hover:text-Secondarycolor">
//               Main site
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default CareersAcademy;

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
import academyHeroPng from "../assets/images/academy-hero.png";

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
    <div className="min-h-screen bg-bgcolor text-textcolor2">
      <SEO
        title="Learning Platform | Lasglowtech Academy – Courses & Training"
        description="Grow your skills with Lasglowtech Academy. Expert-led courses in web development, design, and digital skills. Explore courses and start learning today."
        keywords="Lasglowtech academy, tech courses Nigeria, learn web development, UI UX training, online courses, skills training"
        url="https://www.lasglowtech.com.ng/careers"
      />

      {/* ─── HEADER ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO} width={38} height={38} alt="Lasglowtech" className="rounded-lg" />
            <span className="font-bold text-base text-zinc-900 tracking-tight">
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
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='35' fill='none' stroke='%23ffffff' stroke-width='0.6'/%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23ffffff' stroke-width='0.6'/%3E%3Cline x1='0' y1='40' x2='80' y2='40' stroke='%23ffffff' stroke-width='0.4'/%3E%3Cline x1='40' y1='0' x2='40' y2='80' stroke='%23ffffff' stroke-width='0.4'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }}
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
              className="text-white order-2 lg:order-1 max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="font-extrabold leading-[1.1] sm:leading-[1.12] tracking-tight text-[2rem] sm:text-[2.65rem] md:text-[3.05rem] lg:text-[3.35rem] xl:text-[3.65rem] mb-5 [text-wrap:balance]">
                <span className="block text-white">Launch Your  Career </span>
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

              <div className="flex flex-wrap gap-2 mb-8">
                {["Beginner-friendly", "Live guidance", "Flexible schedule"].map((t) => (
                  <span
                    key={t}
                    className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-white/90 border border-white/20 bg-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

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
              className="order-1 lg:order-2 relative flex min-w-0 justify-center lg:justify-center items-end select-none overflow-visible min-h-[280px] max-lg:min-h-[min(52vh,420px)] lg:min-h-[min(560px,70vh)] max-lg:pt-1"
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
                    src={academyHeroPng}
                    alt="Lasglowtech Academy learner"
                    className="relative mx-auto h-auto w-auto max-w-full object-contain object-bottom drop-shadow-[0_40px_80px_rgba(0,0,0,0.48)] max-w-[min(92vw,480px)] sm:max-w-[min(90vw,540px)] lg:max-w-[min(100%,720px)] max-h-[min(64vh,520px)] sm:max-h-[min(70vh,600px)] md:max-h-[min(76vh,680px)] lg:max-h-[min(82vh,880px)] xl:max-h-[min(84vh,920px)] 2xl:max-h-[min(86vh,960px)]"
                    width={900}
                    height={1020}
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
                        <p className="text-[1.65rem] md:text-3xl font-extrabold tabular-nums text-zinc-900 tracking-tight">
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
          <h2 className="text-2xl md:text-3xl font-bold text-textcolor2 mb-2">
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
          <h2 className="text-2xl md:text-3xl font-bold text-textcolor2 mb-2">
            {featuredCourses.length ? "Most popular" : "Courses"}
          </h2>
          <p className="text-muted mb-10">
            Click a course to see full details. Sign in or register to enroll.
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="brand-card h-64 animate-pulse" />
              ))}
            </div>
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

      {/* ─── FOOTER STRIP ────────────────────────────────────────────── */}
      <footer className="border-t border-Primarycolor/20 py-8 bg-bgcolor2/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor">
            <img src={LOGO} width={28} height={28} alt="" className="rounded" />
            <span className="text-sm font-medium">Lasglowtech Academy</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/careers" className="text-muted hover:text-Secondarycolor">Courses</Link>
            <Link to="/auth/login" className="text-muted hover:text-Secondarycolor">Login</Link>
            <Link to="/auth/register" className="text-muted hover:text-Secondarycolor">Register</Link>
            <Link to="/" className="text-muted hover:text-Secondarycolor">Main site</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareersAcademy;