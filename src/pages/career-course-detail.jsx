import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaLayerGroup,
  FaRegCompass,
  FaSignal,
  FaUserGraduate,
} from "react-icons/fa";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { logoImg as LOGO } from "../components/images";
import BgPatternOverlay from "../components/BgPatternOverlay";
import { getToken, getUser, isAuthenticated } from "../utils/auth";
import { toast } from "react-toastify";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", href: "#course-overview" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const CareerCourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);
  const [error, setError] = useState(null);

  const authed = isAuthenticated();
  const user = getUser();
  const isLearner = ["learner", "student", "talent"].includes(user?.role);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Invalid course");
      return;
    }

    let cancelled = false;

    instance
      .get(`/lms/courses/by-slug/${slug}`)
      .then((res) => {
        if (!cancelled) setCourse(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || "Course not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loginUrl = `/auth/login?redirect=${encodeURIComponent(`/careers/courses/${slug}`)}`;
  const registerUrl = `/auth/register?redirect=${encodeURIComponent(`/careers/courses/${slug}`)}`;

  const courseHighlights = useMemo(() => {
    if (!course) return [];

    return [
      {
        label: "Skill level",
        value: course.level || "All levels",
        Icon: FaSignal,
      },
      {
        label: "Duration",
        value:
          course.durationWeeks > 0
            ? `${course.durationWeeks} week${course.durationWeeks !== 1 ? "s" : ""}`
            : "Flexible pace",
        Icon: FaClock,
      },
      {
        label: "Certificate",
        value: course.issueCertificateOnCompletion ? "Included on completion" : "Optional learning path",
        Icon: FaCertificate,
      },
      {
        label: "Training style",
        value: "Practical and career-focused",
        Icon: FaLayerGroup,
      },
    ];
  }, [course]);

  const learningOutcomes = useMemo(() => {
    if (!course) return [];

    return [
      `Build practical confidence as a ${course.level ? course.level.toLowerCase() : "career-ready"} learner.`,
      course.durationWeeks > 0
        ? `Follow a structured ${course.durationWeeks}-week learning path with clear momentum.`
        : "Learn with a flexible structure that still keeps your progress moving.",
      "Develop real skills through guided lessons and applied practice.",
      course.issueCertificateOnCompletion
        ? "Earn a certificate after successfully completing the course."
        : "Focus on hands-on outcomes and portfolio growth from start to finish.",
    ];
  }, [course]);

  const actionCopy = authed
    ? isLearner
      ? { primary: "Enroll now", secondary: "Go to dashboard" }
      : { primary: "Switch to learner account", secondary: "Browse courses" }
    : { primary: "Enroll now", secondary: "Apply / Register" };

  const brochureUrl = course?.brochureUrl || "";

  const handleEnroll = async () => {
    if (!course?.id || !isLearner) return;

    setEnrolling(true);
    try {
      const token = getToken();
      await instance.post(
        `/lms/enroll/${course.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Enrolled successfully. Redirecting to your dashboard.");
      navigate("/careers/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleDownloadBrochure = async () => {
    if (!brochureUrl || downloadingBrochure) return;

    setDownloadingBrochure(true);
    try {
      const res = await instance.get(brochureUrl, { responseType: "blob" });
      if (res.data.size === 0) {
        toast.error("The brochure file is empty. Please try re-uploading the brochure.");
        return;
      }
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      const fileName = brochureUrl.split("/").pop()?.split("?")[0] || `${course.slug || "course"}-brochure.pdf`;

      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (_) {
      window.open(brochureUrl, "_blank", "noopener,noreferrer");
      toast.info("Opened brochure in a new tab.");
    } finally {
      setDownloadingBrochure(false);
    }
  };

  if (loading) {
    return (
      <div className="relative careers-academy-light min-h-screen overflow-hidden bg-[#f8f7fb] text-slate-900">
        <BgPatternOverlay glow />
        <div className="relative z-10 mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6 md:py-16">
          <div className="h-5 w-40 rounded-full bg-slate-200" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_460px]">
            <div className="rounded-[2rem] bg-gradient-to-br from-bgcolor via-bgcolor2 to-[#2a1245] p-8">
              <div className="h-6 w-40 rounded-full bg-white/20" />
              <div className="mt-6 h-16 w-4/5 rounded-3xl bg-white/20" />
              <div className="mt-5 h-24 rounded-3xl bg-white/15" />
              <div className="mt-8 flex gap-4">
                <div className="h-12 w-36 rounded-2xl bg-white/20" />
                <div className="h-12 w-44 rounded-2xl bg-white/10" />
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="aspect-[4/3] rounded-[1.5rem] bg-slate-200" />
              <div className="mt-6 h-10 w-3/4 rounded-2xl bg-slate-200" />
              <div className="mt-4 h-6 w-32 rounded-full bg-slate-200" />
              <div className="mt-6 h-12 w-full rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="relative careers-academy-light min-h-screen overflow-hidden bg-[#f8f7fb] text-slate-900">
        <BgPatternOverlay glow />
        <div className="relative z-10">
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link to="/careers" className="flex items-center gap-3 text-slate-900 hover:text-Primarycolor">
              <img src={logoimg} width={34} height={34} alt="Lasglowtech" className="rounded-lg" />
              <span className="text-sm font-semibold">Lasglowtech Academy</span>
            </Link>
            <Link to="/careers" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-Primarycolor">
              <FaArrowLeft className="h-3.5 w-3.5" />
              Back to courses
            </Link>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
          <div className="brand-card w-full rounded-[2rem] p-8 text-center md:p-10">
            <span className="inline-flex rounded-full bg-Primarycolor/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-Primarycolor">
              Course unavailable
            </span>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">We could not load this course.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">{error || "Course not found."}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/careers"
                className="inline-flex items-center justify-center rounded-xl bg-Primarycolor px-6 py-3 text-sm font-semibold text-white transition hover:bg-Primarycolor1"
              >
                Browse all courses
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-Primarycolor hover:text-Primarycolor"
              >
                Visit main site
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative careers-academy-light min-h-screen overflow-x-hidden bg-[#f8f7fb] text-slate-900">
      <BgPatternOverlay glow />
      <div className="relative z-10">
      <SEO
        title={`${course.title} | Lasglowtech Academy`}
        description={course.summary || course.description || `Course: ${course.title}`}
        url={`https://lasglowtech.com.ng/careers/courses/${course.slug}`}
        image={course.imageUrl || undefined}
      />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO} width={38} height={38} alt="Lasglowtech" className="rounded-lg" />
            <span className="hidden text-base font-bold tracking-tight text-zinc-900 md:block">
              Lasglowtech Academy
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-zinc-100 px-2 py-1.5 md:flex">
            {NAV_LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-700 transition-all hover:bg-white hover:text-zinc-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-700 transition-all hover:bg-white hover:text-zinc-900"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={authed && isLearner ? "/careers/dashboard" : "/auth/login"}
              className="hidden text-sm font-medium text-zinc-700 transition-colors hover:text-Primarycolor sm:block"
            >
              {authed && isLearner ? "Dashboard" : "Login"}
            </Link>
            <Link
              to={authed && isLearner ? `/careers/courses/${course.slug}` : registerUrl}
              className="rounded-full bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-Primarycolor/30 transition-opacity hover:opacity-95"
            >
              {authed && isLearner ? "Apply Now" : "Apply Now"}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#0f0d16]">
          <div
            className="absolute inset-0 opacity-[0.18]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at center, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(circle at center, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "80px 80px, 80px 80px, 80px 80px, 80px 80px",
              backgroundPosition: "0 0, 0 0, 0 0, 40px 40px",
            }}
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,13,22,0.96)_0%,rgba(23,16,40,0.84)_40%,rgba(41,14,73,0.72)_72%,rgba(67,17,120,0.82)_100%)]"
            aria-hidden
          />
          <div
            className="absolute right-[-8%] top-[6%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(135,0,255,0.28),transparent_60%)]"
            aria-hidden
          />
          <div
            className="absolute bottom-[-18%] left-[16%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_62%)]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pb-16 md:pt-10">
            <Link to="/careers" className="inline-flex items-center gap-2 text-sm text-white/78 hover:text-white">
              <FaArrowLeft className="h-3.5 w-3.5" />
              Back to academy
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_460px] lg:items-center">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full bg-Secondarycolor/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-Secondarycolor">
                  {course.level || "Career Course"}
                </span>

                <h1 className="mt-5 text-white">
                   {course.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base  text-white/60  leading-8 text-white/88 sm:text-lg">
                  {course.summary ||
                    "Build practical digital skills through guided lessons, applied projects, and a clear learning path designed for real career growth."}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {!authed ? (
                    <>
                      <Link
                        to={registerUrl}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                      >
                        {actionCopy.primary}
                      </Link>
                      <Link
                        to={loginUrl}
                        className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        {actionCopy.secondary}
                      </Link>
                    </>
                  ) : isLearner ? (
                    <>
                      <button
                        type="button"
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {enrolling ? "Enrolling..." : actionCopy.primary}
                      </button>
                      <Link
                        to="/careers/dashboard"
                        className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        {actionCopy.secondary}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                      >
                        {actionCopy.primary}
                      </Link>
                      <Link
                        to="/careers"
                        className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        {actionCopy.secondary}
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 right-[-14%] hidden w-[78%] rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(135,0,255,0.22),rgba(135,0,255,0.08)_42%,transparent_74%)] blur-xl lg:block" aria-hidden />
                <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-4 shadow-[0_30px_70px_rgba(8,24,64,0.38)] backdrop-blur-sm">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                    <img
                      src={course.imageUrl || PLACEHOLDER_IMAGE}
                      alt={course.title}
                      className="h-full max-h-[360px] w-full object-cover"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-2 bg-[#f8f7fb]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
            <div className="mb-8 flex justify-center">
              {brochureUrl ? (
                <button
                  type="button"
                  onClick={handleDownloadBrochure}
                  disabled={downloadingBrochure}
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-Primarycolor/20 transition hover:opacity-95"
                >
                  <FaDownload className="h-4 w-4" />
                  {downloadingBrochure ? "Preparing brochure..." : "Download Course Brochure & Curriculum"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title="No brochure uploaded for this course yet."
                  className="inline-flex cursor-not-allowed items-center gap-3 rounded-xl bg-slate-300 px-6 py-4 text-sm font-semibold text-slate-600 shadow-sm"
                >
                  <FaDownload className="h-4 w-4" />
                  Brochure Coming Soon
                </button>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
              <div className="space-y-8">
                <article id="course-overview" className="brand-card rounded-[2rem] p-8 md:p-10">
                  <h2 className="text-Primarycolor">Course Overview</h2>
                  <div className="prose mt-6 max-w-none text-slate-700 prose-headings:text-slate-900 prose-p:leading-8 prose-li:leading-8">
                    {course.description ? (
                      <div dangerouslySetInnerHTML={{ __html: course.description }} />
                    ) : (
                      <>
                        <p>
                          This course is designed to move learners from curiosity to confidence with practical guidance,
                          structured lessons, and hands-on experience.
                        </p>
                        <p>
                          You will build usable skills, understand the thinking behind the work, and learn in a way
                          that prepares you for real opportunities.
                        </p>
                      </>
                    )}
                  </div>
                </article>

                <article className="brand-card rounded-[2rem] p-8 md:p-10">
                  <h2 className="text-Primarycolor">Learning Outcome</h2>
                  <div className="mt-6 space-y-5">
                    {learningOutcomes.map((item, index) => (
                      <div key={item} className="flex items-start gap-4">
                        <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-Primarycolor/10 text-sm font-bold text-Primarycolor">
                          {index + 1}
                        </span>
                        <p className="text-base leading-8 text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="grid gap-6 md:grid-cols-2">
                  <div className="brand-card rounded-[2rem] p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-Primarycolor">Who this is for</p>
                    <h3 className="mt-3 text-2xl font-bold text-slate-900">Learners ready to build with clarity</h3>
                    <div className="mt-5 space-y-4">
                      {[
                        "Beginners who want a guided path into digital skills.",
                        "Career switchers looking for a more structured training route.",
                        "Learners who want practical work, not just theory.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <FaRegCompass className="mt-1 h-4 w-4 flex-shrink-0 text-Secondarycolor" />
                          <p className="text-sm leading-7 text-slate-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="brand-card rounded-[2rem] p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-Primarycolor">Why it works</p>
                    <h3 className="mt-3 text-2xl font-bold text-slate-900">Built for momentum and completion</h3>
                    <div className="mt-5 space-y-4">
                      {[
                        "Structured lessons keep progress clear from the first week.",
                        "A focused curriculum helps you avoid scattered learning.",
                        "Dashboard access makes it easy to track your enrolled course.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <FaCheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-Secondarycolor" />
                          <p className="text-sm leading-7 text-slate-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24">
                <article className="brand-card overflow-hidden rounded-[2rem] p-6">
                  <div className="overflow-hidden rounded-[1.5rem]">
                    <img
                      src={course.imageUrl || PLACEHOLDER_IMAGE}
                      alt={course.title}
                      className="h-full max-h-[260px] w-full object-cover"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>

                  <h2 className="mt-6 text-Primarycolor">Start Here</h2>
                  <p className="mt-2 type-stat-lg text-Primarycolor">
                    {/* {course.durationWeeks > 0 ? `${course.durationWeeks} week${course.durationWeeks !== 1 ? "s" : ""}` : "Open now"} */}
                  </p>

                  <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                    {courseHighlights.map(({ label, value, Icon }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-Primarycolor/10 text-Primarycolor">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {!authed ? (
                      <>
                        <Link
                          to={registerUrl}
                          className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                        >
                          Enroll now
                        </Link>
                        <Link
                          to={loginUrl}
                          className="inline-flex flex-1 items-center justify-center rounded-xl border border-Primarycolor px-5 py-3 text-sm font-semibold text-Primarycolor transition hover:bg-Primarycolor hover:text-white"
                        >
                          Apply / Register
                        </Link>
                      </>
                    ) : isLearner ? (
                      <>
                        <button
                          type="button"
                          onClick={handleEnroll}
                          disabled={enrolling}
                          className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {enrolling ? "Enrolling..." : "Enroll now"}
                        </button>
                        <Link
                          to="/careers/dashboard"
                          className="inline-flex flex-1 items-center justify-center rounded-xl border border-Primarycolor px-5 py-3 text-sm font-semibold text-Primarycolor transition hover:bg-Primarycolor hover:text-white"
                        >
                          Open dashboard
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/auth/login"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                      >
                        Switch to learner account
                      </Link>
                    )}
                  </div>
                </article>

                <article className="brand-card rounded-[2rem] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-Primarycolor">What you get</p>
                  <div className="mt-5 space-y-4">
                    {learningOutcomes.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <FaCheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-Secondarycolor" />
                        <p className="text-sm leading-7 text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-Primarycolor">Take the next step</p>
              <h2 className="mt-3 text-slate-900">Ready to join this course?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Create your learner account, enroll, and continue the full experience from your academy dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!authed ? (
                <>
                  <Link
                    to={registerUrl}
                    className="inline-flex items-center justify-center rounded-xl bg-Primarycolor px-6 py-3 text-sm font-semibold text-white transition hover:bg-Primarycolor1"
                  >
                    Register now
                  </Link>
                  <Link
                    to={loginUrl}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-Primarycolor hover:text-Primarycolor"
                  >
                    Login
                  </Link>
                </>
              ) : isLearner ? (
                <>
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="inline-flex items-center justify-center rounded-xl bg-Primarycolor px-6 py-3 text-sm font-semibold text-white transition hover:bg-Primarycolor1 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {enrolling ? "Enrolling..." : "Start enrollment"}
                  </button>
                  <Link
                    to="/careers/dashboard"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-Primarycolor hover:text-Primarycolor"
                  >
                    Open dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-xl bg-Primarycolor px-6 py-3 text-sm font-semibold text-white transition hover:bg-Primarycolor1"
                >
                  Use learner login
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
};

export default CareerCourseDetail;
