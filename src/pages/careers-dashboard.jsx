import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FaChartLine,
  FaFileAlt,
  FaBook,
  FaLayerGroup,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaCircle,
  FaDownload,
  FaExternalLinkAlt,
  FaPlay,
  FaList,
  FaStickyNote,
  FaPrint,
  FaArrowRight,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import instance from "../config/axios.config";
import { exportCertificateToA4Pdf } from "../utils/certificatePdfExport";
import { getToken, getUser } from "../utils/auth";
import SEO from "../utils/seo";
import CertificatePreview from "../components/certificate-preview";
import { CareersDashboardSkeleton } from "../components/skeletons/CardSkeletons";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};
const QUILL_FORMATS = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link"];

const downloadModuleNotesPdf = (module) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 6;
  let y = margin;

  doc.setFontSize(18);
  doc.text(`Module ${module.moduleOrder}: ${module.title}`, margin, y);
  y += 12;

  doc.setFontSize(10);
  const lines = doc.splitTextToSize(module.moduleContent || "", maxWidth);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  const filename = `module-${module.moduleOrder}-${String(module.title).replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
};

const statusClass = {
  new: "text-amber-800 border-amber-300 bg-amber-50",
  reviewing: "text-blue-800 border-blue-300 bg-blue-50",
  accepted: "text-emerald-800 border-emerald-300 bg-emerald-50",
  waitlist: "text-orange-800 border-orange-300 bg-orange-50",
  rejected: "text-red-800 border-red-300 bg-red-50",
};

const levelClass = {
  beginner: "text-emerald-800 border-emerald-300 bg-emerald-50",
  intermediate: "text-amber-800 border-amber-300 bg-amber-50",
  advanced: "text-rose-800 border-rose-300 bg-rose-50",
};

const courseFallbacks = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
];
const resolveAssetUrl = (url = "") => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${instance.defaults.baseURL}${url}`;
  return `${instance.defaults.baseURL}/${url}`;
};

/** True if URL looks like a PDF (admin-uploaded course note document). */
const isPdfResource = (url = "") => {
  if (!url || typeof url !== "string") return false;
  const u = url.trim().toLowerCase();
  return u.endsWith(".pdf") || u.includes(".pdf?");
};

/** Extract YouTube video ID for embed. Supports watch?v=, youtu.be/, embed/ */
const getYouTubeVideoId = (url = "") => {
  if (!url || typeof url !== "string") return null;
  const u = url.trim();
  const watchMatch = u.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch) return watchMatch[1];
  const shortMatch = u.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (shortMatch) return shortMatch[1];
  const embedMatch = u.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];
  return null;
};

const MODULES_PER_WEEK = 4;

const SIDEBAR_SECTIONS = [
  { id: "overview", label: "Overview", icon: FaChartLine },
  { id: "applications", label: "Applications", icon: FaFileAlt },
  { id: "learning", label: "My Learning", icon: FaBook },
  { id: "modules", label: "Course Modules", icon: FaLayerGroup },
  { id: "browse", label: "Browse Courses", icon: FaGraduationCap },
];

const SECTION_IDS = new Set(SIDEBAR_SECTIONS.map((s) => s.id));

const readInitialSection = () => {
  try {
    const s = new URLSearchParams(window.location.search).get("section");
    return s && SECTION_IDS.has(s) ? s : "overview";
  } catch {
    return "overview";
  }
};

const CareersDashboard = () => {
  const token = useMemo(() => getToken(), []);
  const user = useMemo(() => getUser(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [latest, setLatest] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moduleSidebarOpen, setModuleSidebarOpen] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState(() => new Set([1]));
  const [moduleSearch, setModuleSearch] = useState("");
  const [mobileModulesTab, setMobileModulesTab] = useState("content"); // "content" | "modules"
  const [activeSection, setActiveSection] = useState(readInitialSection);

  useEffect(() => {
    const s = searchParams.get("section");
    if (s && SECTION_IDS.has(s)) setActiveSection(s);
    else setActiveSection("overview");
  }, [searchParams]);

  const goSection = (id) => {
    setActiveSection(id);
    setSearchParams(id === "overview" ? {} : { section: id }, { replace: true });
  };
  const [modulesLoading, setModulesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");
  const [certificatePreviewData, setCertificatePreviewData] = useState(null);
  const [certificatePreviewOpen, setCertificatePreviewOpen] = useState(false);
  const [certificateActionKey, setCertificateActionKey] = useState("");
  const [certificateAssetBust, setCertificateAssetBust] = useState(() => Date.now());
  const certificatePreviewRef = useRef(null);

  const certificateAssetBaseUrl = useMemo(() => (instance.defaults.baseURL || "").replace(/\/$/, ""), []);
  const certificateLogoUrl = useMemo(
    () =>
      certificateAssetBaseUrl ? `${certificateAssetBaseUrl}/uploads/certificate-logo.png?t=${certificateAssetBust}` : "",
    [certificateAssetBaseUrl, certificateAssetBust]
  );
  const certificateSealUrl = useMemo(
    () =>
      certificateAssetBaseUrl ? `${certificateAssetBaseUrl}/uploads/certificate-seal.png?t=${certificateAssetBust}` : "",
    [certificateAssetBaseUrl, certificateAssetBust]
  );
  const certificateSignatureUrl = useMemo(
    () =>
      certificateAssetBaseUrl
        ? `${certificateAssetBaseUrl}/uploads/certificate-signature.png?t=${certificateAssetBust}`
        : "",
    [certificateAssetBaseUrl, certificateAssetBust]
  );

  const firstName = String(latest?.full_name || user?.username || "Learner").split(" ")[0];

  const personalNotesKey = (id) => `lms-notes-${id}`;
  useEffect(() => {
    if (!selectedModuleId) {
      setPersonalNotes("");
      return;
    }
    try {
      setPersonalNotes(localStorage.getItem(personalNotesKey(selectedModuleId)) || "");
    } catch {
      setPersonalNotes("");
    }
  }, [selectedModuleId]);
  const savePersonalNotes = (value) => {
    setPersonalNotes(value);
    if (selectedModuleId) {
      try {
        localStorage.setItem(personalNotesKey(selectedModuleId), value);
      } catch {
        // ignore
      }
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [careerRes, lmsRes, coursesRes] = await Promise.all([
        instance.get("/careers/me", { headers }),
        instance.get("/lms/my/dashboard", { headers }),
        instance.get("/lms/courses"),
      ]);

      setApplications(careerRes.data?.applications || []);
      setLatest(careerRes.data?.latest || null);
      const enrolled = lmsRes.data?.enrollments || [];
      setEnrollments(enrolled);
      setCourses(coursesRes.data || []);
      if (!enrolled.length) {
        setSelectedEnrollmentId("");
        setModules([]);
      } else {
        setSelectedEnrollmentId((prev) => {
          if (prev && enrolled.some((e) => String(e.enrollmentId) === String(prev))) {
            return String(prev);
          }
          return String(enrolled[0].enrollmentId);
        });
      }
    } catch (e) {
      setError("Unable to load your learner dashboard right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    const loadModules = async () => {
      if (!selectedEnrollmentId) {
        setModules([]);
        return;
      }
      setModulesLoading(true);
      try {
        const res = await instance.get(`/lms/my/enrollments/${selectedEnrollmentId}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loaded = res.data || [];
        setModules(loaded);
        setSelectedModuleId((prev) => {
          if (prev && loaded.some((m) => String(m.id) === String(prev))) return String(prev);
          return loaded[0] ? String(loaded[0].id) : "";
        });
      } catch (err) {
        setModules([]);
        setSelectedModuleId("");
      } finally {
        setModulesLoading(false);
      }
    };
    loadModules();
  }, [selectedEnrollmentId, token]);

  useEffect(() => {
    if (!selectedModuleId || !modules.length) return;
    const mod = modules.find((m) => String(m.id) === String(selectedModuleId));
    if (!mod) return;
    const weekNum = mod.week != null ? Number(mod.week) : Math.ceil(Number(mod.moduleOrder) / MODULES_PER_WEEK) || 1;
    setExpandedWeeks((prev) => (prev.has(weekNum) ? prev : new Set([...prev, weekNum])));
  }, [selectedModuleId, modules]);

  const toggleModuleComplete = async (module) => {
    if (!selectedEnrollmentId) return;
    try {
      await instance.put(
        `/lms/my/enrollments/${selectedEnrollmentId}/modules/${module.id}/progress`,
        {
          isCompleted: !module.isCompleted,
          lastPositionSeconds: module.lastPositionSeconds || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules((prev) =>
        prev.map((m) =>
          m.id === module.id
            ? { ...m, isCompleted: !m.isCompleted, completedAt: !m.isCompleted ? new Date().toISOString() : null }
            : m
        )
      );
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update module progress.");
    }
  };

  const enrolledIds = new Set(enrollments.map((e) => e.course.id));
  const selectedModule = modules.find((m) => String(m.id) === String(selectedModuleId)) || null;

  const modulesByWeek = useMemo(() => {
    const groups = {};
    modules.forEach((m) => {
      const order = Number(m.moduleOrder) || 0;
      const weekNum = m.week != null ? Number(m.week) : Math.ceil(order / MODULES_PER_WEEK) || 1;
      if (!groups[weekNum]) groups[weekNum] = [];
      groups[weekNum].push(m);
    });
    return Object.entries(groups)
      .map(([week, mods]) => ({ week: Number(week), modules: mods.sort((a, b) => (a.moduleOrder || 0) - (b.moduleOrder || 0)) }))
      .sort((a, b) => a.week - b.week);
  }, [modules]);

  const filteredModulesByWeek = useMemo(() => {
    const q = (moduleSearch || "").trim().toLowerCase();
    if (!q) return modulesByWeek;
    return modulesByWeek
      .map(({ week, modules: mods }) => ({
        week,
        modules: mods.filter((m) => (m.title || "").toLowerCase().includes(q)),
      }))
      .filter((g) => g.modules.length > 0);
  }, [modulesByWeek, moduleSearch]);

  const toggleWeek = (weekNum) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum);
      else next.add(weekNum);
      return next;
    });
  };

  const handleEnroll = async (courseId) => {
    try {
      await instance.post(
        `/lms/enroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || "Enrollment failed.");
    }
  };

  const waitForPreviewRender = () =>
    new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });

  const buildCertificateFilename = (certificateData, fallbackTitle = "course") => {
    const title = certificateData?.courseName || fallbackTitle || "course";
    const slug = String(title)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const code = String(certificateData?.certificateCode || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `${slug || "certificate"}${code ? `-${code}` : ""}-a4.pdf`;
  };

  const fetchCertificateData = async (enrollmentId) => {
    const res = await instance.get(`/lms/my/enrollments/${enrollmentId}/certificate-data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const downloadCertificatePdf = async (certificateData, fallbackTitle) => {
    setCertificatePreviewData(certificateData);
    await waitForPreviewRender();
    const element = certificatePreviewRef.current;
    if (!element) {
      throw new Error("Certificate preview could not be prepared.");
    }

    await exportCertificateToA4Pdf(element, buildCertificateFilename(certificateData, fallbackTitle));
  };

  const downloadCertificate = async (enrollmentId, courseTitle) => {
    try {
      setCertificateActionKey(`download-${enrollmentId}`);
      const certificateData = await fetchCertificateData(enrollmentId);
      setCertificateAssetBust(Date.now());
      await downloadCertificatePdf(certificateData, courseTitle);
    } catch (err) {
      toast.error(err.response?.data?.error || "Certificate not available yet.");
    } finally {
      setCertificateActionKey("");
    }
  };

  const previewCertificate = async (enrollmentId) => {
    try {
      setCertificateActionKey(`preview-${enrollmentId}`);
      const certificateData = await fetchCertificateData(enrollmentId);
      setCertificateAssetBust(Date.now());
      setCertificatePreviewData(certificateData);
      setCertificatePreviewOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Certificate not available yet.");
    } finally {
      setCertificateActionKey("");
    }
  };

  return (
    <div className="user-dashboard-light min-h-screen bg-white text-textcolor2 flex">
      <SEO
        title="Learner Dashboard | Lasglowtech"
        description="Track your career application and learning progress."
        url="https://www.lasglowtech.com.ng/careers/dashboard"
      />

      {/* Main collapsible sidebar – hidden on mobile; use bottom tabs instead */}
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-16"
        } hidden md:flex flex-shrink-0 border-r border-[#8700ff]/30 bg-gradient-to-b from-[#120b1f] via-[#150d24] to-[#1a1030] transition-all duration-300 ease-in-out flex-col shadow-[4px_0_32px_rgba(135,0,255,0.12)]`}
      >
        <div className="p-4 border-b border-[#8700ff]/25 flex items-center justify-between">
          {sidebarOpen && (
            <span className="text-sm font-semibold text-Secondarycolor truncate tracking-wide">Dashboard</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-lg text-[#9b8cb5] hover:text-white hover:bg-[#8700ff]/30 border border-transparent hover:border-[#8700ff]/40 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {SIDEBAR_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => goSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                activeSection === id
                  ? "bg-[#8700ff]/45 text-white border-[#8700ff]/60 shadow-[0_0_20px_rgba(135,0,255,0.25)]"
                  : "text-[#c4b5dc] border-transparent hover:text-white hover:bg-[#8700ff]/15 hover:border-[#8700ff]/25"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-[#8700ff]/25 space-y-2">
            <Link to="/careers" className="block text-center text-xs text-Secondarycolor font-semibold hover:underline">
              Explore courses
            </Link>
            <Link to="/" className="block text-center text-xs text-[#9b8cb5] hover:text-white transition-colors">
              Main site
            </Link>
          </div>
        )}
      </aside>

      {/* Main content – extra bottom padding on mobile for tab bar */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-white">
        <header className="sticky top-0 z-10 border-b-2 border-[#8700ff]/25 bg-white/95 backdrop-blur-sm px-4 md:px-8 py-4 shadow-sm shadow-slate-200/25">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-Primarycolor/35 bg-violet-100 flex items-center justify-center text-lg font-semibold text-Primarycolor">
                {latest?.picture_url ? (
                  <img src={latest.picture_url} alt={firstName} className="w-full h-full object-cover" />
                ) : (
                  <span>{firstName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Welcome, {firstName}</h1>
                <p className="text-xs text-slate-600">Your learning journey and progress</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/" className="text-sm text-slate-600 hover:text-Primarycolor transition-colors">
                Main site
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/35 bg-violet-50 hover:bg-violet-100 text-sm text-Primarycolor transition-colors"
              >
                Explore courses
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {loading && (
            <div className="py-6">
              <CareersDashboardSkeleton />
            </div>
          )}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Overview */}
              {activeSection === "overview" && (
                <section className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-textcolor2 mb-1">Overview</h2>
                    <p className="text-sm text-slate-500 mb-5">Your activity at a glance</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <article className="brand-card p-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Applications</p>
                        <p className="text-3xl font-bold text-textcolor2 mt-2 tabular-nums">{applications.length}</p>
                        <p className="text-sm text-slate-600 mt-1">Career applications submitted</p>
                      </article>
                      <article className="brand-card p-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Enrolled</p>
                        <p className="text-3xl font-bold text-textcolor2 mt-2 tabular-nums">{enrollments.length}</p>
                        <p className="text-sm text-slate-600 mt-1">Active courses</p>
                      </article>
                      <article className="brand-card p-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Latest status</p>
                        <p className="mt-2">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                              statusClass[latest?.status] || "text-muted border-Primarycolor/40"
                            }`}
                          >
                            {latest?.status || "—"}
                          </span>
                        </p>
                        <p className="text-sm text-slate-600 mt-2">Application status</p>
                      </article>
                    </div>
                  </div>
                  <div className="brand-card p-6">
                    <h2 className="text-lg font-semibold text-textcolor2 mb-1">Quick actions</h2>
                    <p className="text-sm text-slate-600 mb-5">Jump to a section from the sidebar or use the buttons below.</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => goSection("applications")}
                        className="px-4 py-2 rounded-lg border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm"
                      >
                        View Applications
                      </button>
                      <button
                        type="button"
                        onClick={() => goSection("modules")}
                        className="px-4 py-2 rounded-lg border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm"
                      >
                        Open Course Modules
                      </button>
                      <button
                        type="button"
                        onClick={() => goSection("browse")}
                        className="px-4 py-2 rounded-lg border border-Secondarycolor/50 text-Secondarycolor hover:bg-Secondarycolor/10 text-sm"
                      >
                        Browse Courses
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Applications */}
              {activeSection === "applications" && (
                <section className="brand-card overflow-hidden">
                  <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-Primarycolor/20 bg-bgcolor/30">
                    <div>
                      <h2 className="text-xl font-semibold text-textcolor2">Career application</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Admission and review status</p>
                    </div>
                    <Link
                      to="/careers/apply"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm transition-colors"
                    >
                      New Application
                    </Link>
                  </div>
                  <div className="p-6">
                  {!latest && <p className="text-slate-600">No application yet.</p>}
                  {!!latest && (
                    <div className="space-y-5">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-medium uppercase tracking-wider ${
                          statusClass[latest.status] || "text-muted border-Primarycolor/40"
                        }`}
                      >
                        {latest.status}
                      </span>
                      <p className="text-sm text-slate-600">
                        <span className="text-slate-500">Skill:</span> {latest.skill_interest} —{" "}
                        <span className="text-slate-500">Experience:</span> {latest.experience_level || "N/A"}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="text-slate-500">Learning goal:</span> {latest.learning_goal}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <p><span className="text-slate-500">Full name:</span> {latest.full_name}</p>
                        <p><span className="text-slate-500">Email:</span> {latest.email}</p>
                        <p><span className="text-slate-500">Phone:</span> {latest.phone}</p>
                        <p><span className="text-slate-500">Availability:</span> {latest.availability || "N/A"}</p>
                        <p><span className="text-slate-500">Country:</span> {latest.country || "N/A"}</p>
                        <p><span className="text-slate-500">City:</span> {latest.city || "N/A"}</p>
                        <p><span className="text-slate-500">Cohort:</span> {latest.cohort || "Not assigned"}</p>
                        <p><span className="text-slate-500">Fee:</span> NGN {Number(latest.fee_amount || 0).toLocaleString()}</p>
                        <p><span className="text-slate-500">Payment:</span> {latest.payment_status || "unpaid"}</p>
                        {latest.portfolio_url && (
                          <p className="md:col-span-2">
                            <span className="text-slate-500">Portfolio:</span>{" "}
                            <a href={latest.portfolio_url} target="_blank" rel="noreferrer" className="text-Secondarycolor hover:underline break-all">
                              {latest.portfolio_url}
                            </a>
                          </p>
                        )}
                        {!!latest.admin_notes && (
                          <p className="md:col-span-2"><span className="text-slate-500">Admin notes:</span> {latest.admin_notes}</p>
                        )}
                        <p className="md:col-span-2 text-xs text-slate-500">
                          Submitted: {new Date(latest.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  </div>
                </section>
              )}

              {/* My Learning */}
              {activeSection === "learning" && (
                <section className="brand-card overflow-hidden">
                  <div className="px-6 py-5 border-b border-Primarycolor/20 bg-bgcolor/30">
                    <h2 className="text-xl font-semibold text-textcolor2">My learning progress</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Progress across enrolled courses</p>
                  </div>
                  <div className="p-6">
                  {enrollments.length === 0 && (
                    <p className="text-slate-600">No enrolled courses yet. Browse courses and enroll to get started.</p>
                  )}
                  <div className="space-y-5">
                    {enrollments.map((en) => (
                      <article
                        key={en.enrollmentId}
                        className="brand-card p-6"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-textcolor2">{en.course.title}</p>
                          <span
                            className={`text-xs uppercase px-2.5 py-1 rounded-full border font-medium ${
                              levelClass[en.course.level] || "text-muted border-Primarycolor/30"
                            }`}
                          >
                            {en.course.level}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          {en.completedModules} / {en.totalModules} modules — {en.progressPercent}%
                        </p>
                        <div className="w-full h-2.5 bg-bgcolor2 rounded-full mt-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-Primarycolor to-Secondarycolor rounded-full transition-all duration-500"
                            style={{ width: `${en.progressPercent}%` }}
                          />
                        </div>
                        {Number(en.progressPercent) >= 100 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {!(latest?.payment_status === "paid" || latest?.payment_status === "waived") ? (
                              <p className="text-xs text-amber-400/90 w-full">
                                Certificate download is available only after your programme payment is verified. Please ensure your fee is marked as paid.
                              </p>
                            ) : (
                              <>
                                <p className="text-xs text-slate-500 w-full mb-1">
                                  Download is available after Lasglowtech verifies programme completion and issues your certificate.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => previewCertificate(en.enrollmentId)}
                                  disabled={certificateActionKey === `preview-${en.enrollmentId}` || certificateActionKey === `download-${en.enrollmentId}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor/10 text-sm transition-colors"
                                >
                                  <FaExternalLinkAlt /> {certificateActionKey === `preview-${en.enrollmentId}` ? "Loading..." : "Preview Certificate"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadCertificate(en.enrollmentId, en.course.title)}
                                  disabled={certificateActionKey === `download-${en.enrollmentId}` || certificateActionKey === `preview-${en.enrollmentId}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-sm transition-colors"
                                >
                                  <FaDownload /> {certificateActionKey === `download-${en.enrollmentId}` ? "Preparing PDF..." : "Download Certificate"}
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 mt-3">
                            Complete all {en.totalModules} modules to unlock your certificate.
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                  </div>
                </section>
              )}

              {/* Course Modules (LMS) – hierarchical weeks + mobile bottom tabs */}
              {activeSection === "modules" && (
                <section className="brand-card overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-Primarycolor/20 bg-bgcolor/30">
                    <div>
                      <h2 className="text-xl font-semibold text-textcolor2">Course modules</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Lessons, notes, and resources</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={selectedEnrollmentId}
                        onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-bgcolor border border-Primarycolor/30 text-textcolor2 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-Primarycolor/50"
                        disabled={!enrollments.length}
                      >
                        {!enrollments.length && <option value="">No enrollments</option>}
                        {enrollments.map((en) => (
                          <option key={en.enrollmentId} value={en.enrollmentId}>
                            {en.course.title}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setModuleSidebarOpen((o) => !o)}
                        className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm transition-colors"
                        disabled={!modules.length}
                        title={moduleSidebarOpen ? "Hide module list" : "Show module list"}
                      >
                        <FaList className="w-4 h-4" />
                        {moduleSidebarOpen ? "Hide modules" : "Show modules"}
                      </button>
                    </div>
                  </div>

                  {modulesLoading && <p className="px-6 text-slate-600 text-sm">Loading modules...</p>}
                  {!modulesLoading && !modules.length && (
                    <p className="px-6 text-slate-600 text-sm">No modules for this course yet, or select an enrolled course.</p>
                  )}

                  {!modulesLoading && modules.length > 0 && (
                    <>
                      {/* Mobile: Content | Modules toggle – single bottom bar is main nav only */}
                      <div className="md:hidden flex px-4 pb-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMobileModulesTab("content")}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            mobileModulesTab === "content"
                              ? "bg-Secondarycolor/15 text-Secondarycolor border border-Secondarycolor/40"
                              : "bg-bgcolor/50 text-muted border border-Primarycolor/20"
                          }`}
                        >
                          Content
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileModulesTab("modules")}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            mobileModulesTab === "modules"
                              ? "bg-Secondarycolor/15 text-Secondarycolor border border-Secondarycolor/40"
                              : "bg-bgcolor/50 text-muted border border-Primarycolor/20"
                          }`}
                        >
                          Modules
                        </button>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-4 pb-20 md:pb-0">
                        {/* Module sidebar – hidden on mobile when showing content; on mobile use bottom tab to switch */}
                        <aside
                          className={`${
                            moduleSidebarOpen ? "md:w-80 flex-shrink-0" : "md:w-0 md:overflow-hidden md:opacity-0"
                          } hidden md:block transition-all duration-300 ease-in-out`}
                        >
                          <div className="brand-card p-4 sticky top-24">
                            {enrollments.find((e) => String(e.enrollmentId) === String(selectedEnrollmentId)) && (
                              <>
                                <p className="text-sm font-semibold text-textcolor2 mb-1">
                                  {enrollments.find((e) => String(e.enrollmentId) === String(selectedEnrollmentId))?.course?.title}
                                </p>
                                <div className="w-full h-2 bg-bgcolor2 rounded-full overflow-hidden mb-4">
                                  <div
                                    className="h-full bg-gradient-to-r from-Primarycolor to-Secondarycolor rounded-full transition-all"
                                    style={{
                                      width: `${(modules.filter((m) => m.isCompleted).length / Math.max(modules.length, 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-muted mb-3">
                                  {modules.filter((m) => m.isCompleted).length} / {modules.length} complete
                                </p>
                              </>
                            )}
                            <input
                              type="text"
                              placeholder="Search by lesson title"
                              value={moduleSearch}
                              onChange={(e) => setModuleSearch(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-bgcolor border border-Primarycolor/25 text-textcolor2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-Primarycolor/50 mb-3"
                            />
                            <div className="space-y-0 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 border border-Primarycolor/15 rounded-lg divide-y divide-Primarycolor/15">
                              {filteredModulesByWeek.map(({ week, modules: weekModules }) => {
                                const completed = weekModules.filter((m) => m.isCompleted).length;
                                const total = weekModules.length;
                                const allDone = completed === total;
                                const someDone = completed > 0;
                                const isExpanded = expandedWeeks.has(week);
                                return (
                                  <div key={week} className="bg-bgcolor/30">
                                    <button
                                      type="button"
                                      onClick={() => toggleWeek(week)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-Primarycolor/5 transition-colors"
                                    >
                                      {allDone ? (
                                        <FaCheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                      ) : someDone ? (
                                        <FaCircle className="w-5 h-5 text-blue-500/80 flex-shrink-0" />
                                      ) : (
                                        <FaCircle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                                      )}
                                      <span className="font-medium text-textcolor2 flex-1">Week {week}</span>
                                      <span className="text-xs text-muted tabular-nums">{completed}/{total}</span>
                                      {isExpanded ? (
                                        <FaChevronUp className="w-4 h-4 text-muted flex-shrink-0" />
                                      ) : (
                                        <FaChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                                      )}
                                    </button>
                                    {isExpanded && (
                                      <div className="pl-4 pb-2 border-l-2 border-Primarycolor/20 ml-5 mr-2 space-y-0">
                                        {weekModules.map((module) => {
                                          const active = String(module.id) === String(selectedModuleId);
                                          return (
                                            <button
                                              key={module.id}
                                              type="button"
                                              onClick={() => {
                                                setSelectedModuleId(String(module.id));
                                                setMobileModulesTab("content");
                                              }}
                                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                                active ? "bg-gray-500/20 text-textcolor2" : "hover:bg-Primarycolor/5"
                                              }`}
                                            >
                                              {module.isCompleted ? (
                                                <FaCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                              ) : (
                                                <FaCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                              )}
                                              <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{module.title}</p>
                                                {module.moduleOrder && (
                                                  <p className="text-xs text-muted">Module {module.moduleOrder}</p>
                                                )}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </aside>

                        {/* Mobile: show either list or content based on tab */}
                        {mobileModulesTab === "modules" && (
                          <div className="md:hidden w-full brand-card p-4">
                            <p className="text-sm font-semibold text-textcolor2 mb-3">Lessons</p>
                            <input
                              type="text"
                              placeholder="Search by lesson title"
                              value={moduleSearch}
                              onChange={(e) => setModuleSearch(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-bgcolor border border-Primarycolor/25 text-textcolor2 text-sm mb-3"
                            />
                            <div className="space-y-0 max-h-[60vh] overflow-y-auto border border-Primarycolor/15 rounded-lg divide-y divide-Primarycolor/15">
                              {filteredModulesByWeek.map(({ week, modules: weekModules }) => {
                                const isExpanded = expandedWeeks.has(week);
                                const completed = weekModules.filter((m) => m.isCompleted).length;
                                const total = weekModules.length;
                                const allDone = completed === total;
                                const someDone = completed > 0;
                                return (
                                  <div key={week}>
                                    <button
                                      type="button"
                                      onClick={() => toggleWeek(week)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-Primarycolor/5"
                                    >
                                      {allDone ? <FaCheckCircle className="w-5 h-5 text-blue-500" /> : someDone ? <FaCircle className="w-5 h-5 text-blue-500/80" /> : <FaCircle className="w-5 h-5 text-slate-600" />}
                                      <span className="font-medium flex-1">Week {week}</span>
                                      <span className="text-xs text-muted">{completed}/{total}</span>
                                      {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                                    </button>
                                    {isExpanded && (
                                      <div className="pl-4 pb-2 border-l-2 border-Primarycolor/20 ml-5 space-y-0">
                                        {weekModules.map((module) => {
                                          const active = String(module.id) === String(selectedModuleId);
                                          return (
                                            <button
                                              key={module.id}
                                              type="button"
                                              onClick={() => {
                                                setSelectedModuleId(String(module.id));
                                                setMobileModulesTab("content");
                                              }}
                                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${active ? "bg-gray-500/20" : "hover:bg-Primarycolor/5"}`}
                                            >
                                              {module.isCompleted ? <FaCheckCircle className="w-4 h-4 text-blue-500" /> : <FaCircle className="w-4 h-4 text-slate-600" />}
                                              <span className="text-sm truncate flex-1">{module.title}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Module content – hidden on mobile when Modules tab is active */}
                        <article className={`flex-1 min-w-0 brand-card p-6 ${mobileModulesTab === "modules" ? "hidden md:block" : ""}`}>
                        {!selectedModule && (
                          <p className="text-slate-600 text-sm">Select a module from the list to view content.</p>
                        )}
                        {!!selectedModule && (
                          <div className="space-y-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Module {selectedModule.moduleOrder}</p>
                                <h3 className="text-xl font-semibold text-textcolor2 mt-1">{selectedModule.title}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleModuleComplete(selectedModule)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                  selectedModule.isCompleted
                                    ? "border-emerald-400/50 text-emerald-400 bg-emerald-400/10"
                                    : "border-Primarycolor/40 text-textcolor2 hover:bg-Primarycolor/20"
                                }`}
                              >
                                <FaCheckCircle className="w-4" />
                                {selectedModule.isCompleted ? "Completed" : "Mark complete"}
                              </button>
                            </div>

                            <p className="text-xs text-slate-500">
                              Estimated duration: {selectedModule.durationMinutes} mins
                            </p>

                            {/* PDF document viewer – admin-uploaded course note (reference-style) */}
                            {!!selectedModule.resourceUrl && isPdfResource(selectedModule.resourceUrl) && (
                              <div className="brand-card overflow-hidden">
                                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-Primarycolor/20 bg-bgcolor/50">
                                  <span className="text-sm font-semibold text-textcolor2 truncate pr-2">
                                    {selectedModule.title}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => window.open(resolveAssetUrl(selectedModule.resourceUrl), "_blank", "noopener,noreferrer")}
                                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-Primarycolor/30 hover:bg-Primarycolor/20 text-xs font-medium transition-colors"
                                    >
                                      <FaExternalLinkAlt className="w-3.5 h-3.5" /> View PDF
                                    </button>
                                    <a
                                      href={resolveAssetUrl(selectedModule.resourceUrl)}
                                      download
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-Primarycolor/30 hover:bg-Primarycolor/20 text-xs font-medium transition-colors"
                                    >
                                      <FaDownload className="w-3.5 h-3.5" /> Download
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => window.open(resolveAssetUrl(selectedModule.resourceUrl), "_blank", "noopener,noreferrer")}
                                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-Primarycolor/30 hover:bg-Primarycolor/20 text-xs font-medium transition-colors"
                                      title="Open in new tab to print"
                                    >
                                      <FaPrint className="w-3.5 h-3.5" /> Print
                                    </button>
                                  </div>
                                </div>
                                <div className="bg-bgcolor/30 px-4 py-4 rounded-b-xl border-t border-Primarycolor/15">
                                  <p className="text-xs text-slate-500 leading-relaxed">
                                    Use <strong className="text-slate-600">View PDF</strong> for the browser’s PDF viewer (new tab).
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Course notes – text/HTML (when no PDF or in addition) */}
                            {!!selectedModule.moduleContent && (
                              <div className="brand-card overflow-hidden">
                                <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-Primarycolor/20 bg-bgcolor/30">
                                  <span className="text-sm font-semibold text-textcolor2">Course notes</span>
                                  <button
                                    type="button"
                                    onClick={() => downloadModuleNotesPdf(selectedModule)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-Primarycolor/40 hover:bg-Primarycolor/20 text-xs font-medium transition-colors"
                                  >
                                    <FaDownload /> Download as PDF
                                  </button>
                                </div>
                                <div className="p-5 prose prose-invert prose-sm max-w-none">
                                  {/<[a-z][\s\S]*>/i.test(selectedModule.moduleContent) ? (
                                    <div
                                      className="lms-module-notes text-gray-200 leading-relaxed break-words [&_a]:text-Secondarycolor [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_ul,_ol]:pl-5 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm"
                                      dangerouslySetInnerHTML={{ __html: selectedModule.moduleContent }}
                                    />
                                  ) : (
                                    <p className="text-gray-200 leading-relaxed whitespace-pre-line break-words">
                                      {selectedModule.moduleContent}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Video – watch without leaving site (YouTube iframe) */}
                            {!!selectedModule.videoUrl && (() => {
                              const videoUrl = selectedModule.videoUrl;
                              const ytId = getYouTubeVideoId(videoUrl);
                              return (
                                <div className="brand-card p-4">
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Video – watch without leaving the site</p>
                                  {ytId ? (
                                    <div className="w-full rounded-lg overflow-hidden bg-black aspect-video">
                                      <iframe
                                        src={`https://www.youtube.com/embed/${ytId}`}
                                        title="Lesson video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full"
                                      />
                                    </div>
                                  ) : (
                                    <a
                                      href={resolveAssetUrl(videoUrl)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 text-Secondarycolor hover:underline text-sm font-medium"
                                    >
                                      <FaPlay /> Watch lesson video (opens in new tab)
                                    </a>
                                  )}
                                </div>
                              );
                            })()}

                            {/* My notes */}
                            <div className="brand-card overflow-hidden">
                              <div className="flex items-center gap-2 px-5 py-3 border-b border-Primarycolor/20 bg-bgcolor/30">
                                <FaStickyNote className="w-4 h-4 text-Secondarycolor" />
                                <span className="text-sm font-semibold text-textcolor2">My notes</span>
                              </div>
                              <div className="min-h-[180px] [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[160px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-toolbar_.ql-stroke]:stroke-slate-600 [&_.ql-toolbar_.ql-fill]:fill-slate-600 [&_.ql-toolbar_button]:text-slate-600 [&_.ql-editor]:text-slate-800 bg-white">
                                <ReactQuill
                                  theme="snow"
                                  value={personalNotes}
                                  onChange={savePersonalNotes}
                                  modules={QUILL_MODULES}
                                  formats={QUILL_FORMATS}
                                  placeholder="Add your own notes for this module..."
                                />
                              </div>
                            </div>

                            {/* Resource link (when not a PDF – e.g. doc, external) */}
                            {!!selectedModule.resourceUrl && !isPdfResource(selectedModule.resourceUrl) && (
                              <div className="flex flex-wrap gap-3">
                                <a
                                  href={resolveAssetUrl(selectedModule.resourceUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm font-medium transition-colors"
                                >
                                  <FaExternalLinkAlt /> Resource doc
                                </a>
                              </div>
                            )}

                            {/* References */}
                            {!!selectedModule.referenceLinks?.length && (
                              <div className="brand-card p-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">References</p>
                                <ul className="space-y-2">
                                  {selectedModule.referenceLinks.map((link) => (
                                    <li key={link}>
                                      <a
                                        href={resolveAssetUrl(link)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-Secondarycolor hover:underline break-all"
                                      >
                                        {link}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Bottom actions – Mark incomplete / Continue */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-Primarycolor/20">
                              <button
                                type="button"
                                onClick={() => toggleModuleComplete(selectedModule)}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                  selectedModule.isCompleted
                                    ? "border-slate-300 text-slate-600 hover:bg-slate-50"
                                    : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                                }`}
                              >
                                <FaCheckCircle className="w-4" />
                                {selectedModule.isCompleted ? "Mark incomplete" : "Mark complete"}
                              </button>
                              {(() => {
                                const idx = modules.findIndex((m) => String(m.id) === String(selectedModuleId));
                                const nextModule = idx >= 0 && idx < modules.length - 1 ? modules[idx + 1] : null;
                                return nextModule ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedModuleId(String(nextModule.id))}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-Primarycolor text-white hover:bg-Primarycolor/90 text-sm font-medium transition-colors"
                                  >
                                    Continue <FaArrowRight className="w-4 h-4" />
                                  </button>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        )}
                      </article>
                      {/* Mobile: Content vs Modules toggle inline (main nav is the only bottom bar) */}
                    </div>
                    </>
                  )}
                </section>
              )}

              {/* Browse Courses */}
              {activeSection === "browse" && (
                <section className="brand-card overflow-hidden">
                  <div className="px-6 py-5 border-b border-Primarycolor/20 bg-bgcolor/30">
                    <h2 className="text-xl font-semibold text-textcolor2">Available courses</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Enroll to start your learning path</p>
                  </div>
                  <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <article
                        key={course.id}
                        className="brand-card overflow-hidden"
                      >
                        <img
                          src={course.imageUrl || courseFallbacks[course.id % courseFallbacks.length]}
                          alt={course.title}
                          className="w-full h-44 object-cover border-b border-Primarycolor/20"
                        />
                        <div className="p-6">
                          <p className="font-semibold text-textcolor2 text-lg">{course.title}</p>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{course.summary}</p>
                          <p className="text-xs font-medium text-slate-500 mt-3 uppercase tracking-wider">
                            {course.level} · {course.durationWeeks} weeks
                          </p>
                          <button
                            type="button"
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrolledIds.has(course.id)}
                            className="mt-4 w-full py-2.5 rounded-lg border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {enrolledIds.has(course.id) ? "Enrolled" : "Enroll"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  {!courses.length && <p className="text-slate-600 text-sm">No courses published yet.</p>}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {certificatePreviewData && (
        <div className="fixed -left-[9999px] top-0 w-[1400px] pointer-events-none opacity-0">
          <CertificatePreview
            ref={certificatePreviewRef}
            logoUrl={certificateLogoUrl}
            sealUrl={certificateSealUrl}
            signatureImageUrl={certificateSignatureUrl}
            verifyUrl={certificatePreviewData.verifyUrl || ""}
            recipientName={certificatePreviewData.recipientName}
            courseName={certificatePreviewData.courseName}
            date={certificatePreviewData.date}
            certificateCode={certificatePreviewData.certificateCode}
            signatureLabel={certificatePreviewData.signatureLabel}
            bodyMessage={certificatePreviewData.bodyMessage}
          />
        </div>
      )}

      {certificatePreviewOpen && certificatePreviewData && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center">
          <div className="brand-card w-full max-w-6xl max-h-[95vh] overflow-auto p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-textcolor2">Certificate Preview</h3>
                <p className="text-sm text-slate-600">Print-ready A4 PDF (~300 DPI) and QR verification when your site URL is set on the server.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadCertificatePdf(certificatePreviewData, certificatePreviewData.courseName)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-sm transition-colors"
                >
                  <FaDownload /> Download A4 PDF
                </button>
                <button
                  type="button"
                  onClick={() => setCertificatePreviewOpen(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor/10 text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <CertificatePreview
              logoUrl={certificateLogoUrl}
              sealUrl={certificateSealUrl}
              signatureImageUrl={certificateSignatureUrl}
              verifyUrl={certificatePreviewData.verifyUrl || ""}
              recipientName={certificatePreviewData.recipientName}
              courseName={certificatePreviewData.courseName}
              date={certificatePreviewData.date}
              certificateCode={certificatePreviewData.certificateCode}
              signatureLabel={certificatePreviewData.signatureLabel}
              bodyMessage={certificatePreviewData.bodyMessage}
            />
          </div>
        </div>
      )}

      {/* Mobile bottom nav – icon tabs for more viewBox (reference style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#8700ff]/35 bg-gradient-to-t from-[#120b1f] to-[#1a1030] backdrop-blur-sm py-2 shadow-[0_-8px_32px_rgba(135,0,255,0.15)] safe-area-pb">
        {SIDEBAR_SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => goSection(id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl min-w-0 flex-1 transition-colors ${
                isActive
                  ? "text-white bg-[#8700ff]/50 border border-[#8700ff]/70 shadow-[0_0_16px_rgba(135,0,255,0.35)]"
                  : "text-[#9b8cb5] border border-transparent hover:text-white hover:bg-[#8700ff]/15"
              }`}
              aria-label={label}
              title={label}
            >
              <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-Secondarycolor" : ""}`} />
              <span className="text-[10px] font-medium truncate max-w-full">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CareersDashboard;

