import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FaChartLine,
  FaFileAlt,
  FaBook,
  FaLayerGroup,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaCircle,
  FaDownload,
  FaExternalLinkAlt,
  FaList,
  FaStickyNote,
  FaPrint,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import instance from "../config/axios.config";
import { exportCertificateToA4Pdf } from "../utils/certificatePdfExport";
import { clearSession, getToken, getUser } from "../utils/auth";
import { CACHE_KEYS, readCache, writeCache } from "../utils/localCache";
import SEO from "../utils/seo";
import CertificatePreview from "../components/certificate-preview";
import ModuleQuiz from "../components/ModuleQuiz";
import ModuleVideoEmbed from "../components/ModuleVideoEmbed";
import { CareersDashboardSkeleton, OrderListSkeleton } from "../components/skeletons/CardSkeletons";

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

const statusHelperText = {
  new: "Your application has been received and is awaiting review.",
  reviewing: "Our team is currently reviewing your application.",
  accepted: "Congratulations! You have been accepted into the programme.",
  waitlist: "You are on the waitlist. We will notify you if a spot opens.",
  rejected: "We were unable to offer you a place at this time.",
};

const paymentStatusClass = {
  paid: "text-emerald-800 border-emerald-300 bg-emerald-50",
  waived: "text-blue-800 border-blue-300 bg-blue-50",
  unpaid: "text-amber-800 border-amber-300 bg-amber-50",
};

const levelClass = {
  beginner: "text-emerald-800 border-emerald-300 bg-emerald-50",
  intermediate: "text-amber-800 border-amber-300 bg-amber-50",
  advanced: "text-rose-800 border-rose-300 bg-rose-50",
};

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


const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Quiz-focused module: has a quiz and no lesson PDF, video, notes, or references. */
const isQuizOnlyModule = (module) => {
  if (!module?.hasQuiz) return false;
  const hasNotes = Boolean(stripHtml(module.moduleContent));
  const hasResource = Boolean(String(module.resourceUrl || "").trim());
  const hasVideo = Boolean(String(module.videoUrl || "").trim());
  const hasRefs = Boolean(module.referenceLinks?.length);
  return !hasNotes && !hasResource && !hasVideo && !hasRefs;
};

const formatScheduleDate = (dateStr, options = {}) => {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...options,
  });
};

const formatScheduleTime = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = String(timeStr).split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const addDaysToDateStr = (dateStr, days) => {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const formatWeekRangeLabel = (courseStartDate, weekNum) => {
  if (!courseStartDate || !weekNum) return null;
  const start = addDaysToDateStr(courseStartDate, (weekNum - 1) * 7);
  const end = addDaysToDateStr(courseStartDate, (weekNum - 1) * 7 + 6);
  return `${formatScheduleDate(start)} – ${formatScheduleDate(end)}`;
};

const formatModuleScheduleLabel = (module) => {
  const parts = [];
  if (module?.scheduledDate) {
    parts.push(
      formatScheduleDate(module.scheduledDate, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
  }
  if (module?.scheduledTime) parts.push(formatScheduleTime(module.scheduledTime));
  return parts.length ? parts.join(" · ") : null;
};

const MODULES_PER_WEEK = 4;

const SIDEBAR_SECTIONS = [
  { id: "overview", label: "Overview", icon: FaChartLine },
  { id: "applications", label: "Applications", icon: FaFileAlt },
  { id: "learning", label: "My Learning", icon: FaBook },
  { id: "modules", label: "Course Modules", icon: FaLayerGroup },
];

const SECTION_TITLES = {
  overview: "Overview",
  applications: "Applications",
  learning: "My Learning",
  modules: "Course Modules",
};

const SECTION_IDS = new Set(SIDEBAR_SECTIONS.map((s) => s.id));

const readInitialSection = () => {
  try {
    const s = new URLSearchParams(window.location.search).get("section");
    return s && SECTION_IDS.has(s) ? s : "overview";
  } catch {
    return "overview";
  }
};

const matchEnrollmentToSkill = (enrolled, skillInterest) => {
  if (!enrolled?.length || !skillInterest) return null;
  const skill = String(skillInterest).trim().toLowerCase();
  const skillRoot = skill.split("/")[0].trim();
  return (
    enrolled.find((e) => {
      const title = String(e.course?.title || "").toLowerCase();
      return title.includes(skill) || (skillRoot && title.includes(skillRoot));
    }) || null
  );
};

const pickEnrollmentId = (enrolled, application) => {
  if (!enrolled?.length) return "";
  const matched = matchEnrollmentToSkill(enrolled, application?.skill_interest);
  return String((matched || enrolled[0]).enrollmentId);
};

const CareersDashboard = () => {
  const navigate = useNavigate();
  const token = useMemo(() => getToken(), []);
  const user = useMemo(() => getUser(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [latest, setLatest] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [navOpen, setNavOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [moduleSidebarOpen, setModuleSidebarOpen] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState(() => new Set([1]));
  const [moduleSearch, setModuleSearch] = useState("");
  const [mobileModulesTab, setMobileModulesTab] = useState("content"); // "content" | "modules"
  const [activeSection, setActiveSection] = useState(readInitialSection);

  useEffect(() => {
    const s = searchParams.get("section");
    if (s === "browse") {
      setActiveSection("overview");
      setSearchParams({}, { replace: true });
      return;
    }
    if (s && SECTION_IDS.has(s)) setActiveSection(s);
    else setActiveSection("overview");
  }, [searchParams, setSearchParams]);

  const goSection = (id) => {
    setActiveSection(id);
    setSearchParams(id === "overview" ? {} : { section: id }, { replace: true });
    if (typeof window !== "undefined" && window.innerWidth < 768) setNavOpen(false);
  };
  const [modulesLoading, setModulesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine
  );
  const [personalNotes, setPersonalNotes] = useState("");
  const [certificatePreviewData, setCertificatePreviewData] = useState(null);
  const [certificatePreviewOpen, setCertificatePreviewOpen] = useState(false);
  const [certificateActionKey, setCertificateActionKey] = useState("");
  const [certificateAssetBust, setCertificateAssetBust] = useState(() => Date.now());
  const certificatePreviewRef = useRef(null);

  const activeEnrollment = useMemo(() => {
    if (!enrollments.length) return null;
    const skillMatched = matchEnrollmentToSkill(enrollments, latest?.skill_interest);
    if (skillMatched) return skillMatched;
    if (selectedEnrollmentId) {
      const match = enrollments.find((e) => String(e.enrollmentId) === String(selectedEnrollmentId));
      if (match) return match;
    }
    return enrollments[0];
  }, [enrollments, selectedEnrollmentId, latest?.skill_interest]);

  const isAccepted = latest?.status === "accepted";
  const courseLabel =
    activeEnrollment?.course?.title ||
    latest?.skill_interest ||
    (isAccepted ? "Course access pending" : "Awaiting acceptance");

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

  const handleLogout = () => {
    clearSession();
    setProfileOpen(false);
    navigate("/auth/login", { replace: true });
  };

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
      const [careerRes, lmsRes] = await Promise.all([
        instance.get("/careers/me", { headers }),
        instance.get("/lms/my/dashboard", { headers }),
      ]);

      const applications = careerRes.data?.applications || [];
      const latestApp = careerRes.data?.latest || null;
      const enrolled = lmsRes.data?.enrollments || [];

      setApplications(applications);
      setLatest(latestApp);
      setEnrollments(enrolled);
      writeCache(CACHE_KEYS.learnerDashboard, { applications, latest: latestApp, enrollments: enrolled });

      if (!enrolled.length) {
        setSelectedEnrollmentId("");
        setModules([]);
      } else {
        setSelectedEnrollmentId(pickEnrollmentId(enrolled, latestApp));
      }
    } catch (e) {
      const cached = readCache(CACHE_KEYS.learnerDashboard);
      if (cached) {
        setApplications(cached.applications || []);
        setLatest(cached.latest || null);
        setEnrollments(cached.enrollments || []);
        if (cached.enrollments?.length) {
          setSelectedEnrollmentId(pickEnrollmentId(cached.enrollments, cached.latest));
        }
        setError("You're offline or the connection failed. Showing your last saved dashboard data.");
        toast.info("Showing saved data — reconnect to refresh.");
      } else {
        setError("Unable to load your learner dashboard right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = readCache(CACHE_KEYS.learnerDashboard);
    if (cached) {
      setApplications(cached.applications || []);
      setLatest(cached.latest || null);
      setEnrollments(cached.enrollments || []);
      if (cached.enrollments?.length) {
        setSelectedEnrollmentId(pickEnrollmentId(cached.enrollments, cached.latest));
      }
    }
    loadData();
  }, [token]);

  useEffect(() => {
    const loadModules = async () => {
      if (!selectedEnrollmentId) {
        setModules([]);
        return;
      }
      const cached = readCache(CACHE_KEYS.learnerModules(selectedEnrollmentId));
      if (cached?.length) {
        setModules(cached);
      }
      setModulesLoading(true);
      try {
        const res = await instance.get(`/lms/my/enrollments/${selectedEnrollmentId}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loaded = res.data || [];
        setModules(loaded);
        writeCache(CACHE_KEYS.learnerModules(selectedEnrollmentId), loaded);
        setSelectedModuleId((prev) => {
          if (prev && loaded.some((m) => String(m.id) === String(prev))) return String(prev);
          return loaded[0] ? String(loaded[0].id) : "";
        });
      } catch (err) {
        const cached = readCache(CACHE_KEYS.learnerModules(selectedEnrollmentId));
        if (cached?.length) {
          setModules(cached);
          setSelectedModuleId((prev) => {
            if (prev && cached.some((m) => String(m.id) === String(prev))) return String(prev);
            return cached[0] ? String(cached[0].id) : "";
          });
          toast.info("Offline — showing your last saved modules.");
        } else {
          toast.warn("Could not load modules. Check your connection and try again.");
        }
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

    if (!module.isCompleted && module.hasQuiz && !module.quizSubmitted) {
      toast.error("Submit the module quiz before marking this module as complete.");
      return;
    }

    try {
      await instance.put(
        `/lms/my/enrollments/${selectedEnrollmentId}/modules/${module.id}/progress`,
        {
          isCompleted: !module.isCompleted,
          lastPositionSeconds: module.lastPositionSeconds || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules((prev) => {
        const next = prev.map((m) =>
          m.id === module.id
            ? { ...m, isCompleted: !m.isCompleted, completedAt: !m.isCompleted ? new Date().toISOString() : null }
            : m
        );
        writeCache(CACHE_KEYS.learnerModules(selectedEnrollmentId), next);
        return next;
      });
      loadData();
    } catch (err) {
      const message = err.response?.data?.error || "Unable to update module progress.";
      toast.error(message);
      setError(message);
    }
  };

  const handleQuizSubmitted = (moduleId, result) => {
    setModules((prev) =>
      prev.map((m) =>
        String(m.id) === String(moduleId)
          ? {
              ...m,
              quizSubmitted: true,
              quizScore: result?.score ?? m.quizScore,
              quizPercent: result?.percent ?? m.quizPercent,
            }
          : m
      )
    );
  };

  const canMarkModuleComplete = (module) =>
    !module?.hasQuiz || Boolean(module?.quizSubmitted) || Boolean(module?.isCompleted);

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

      {/* Mobile overlay backdrop */}
      {navOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={() => setNavOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-[100dvh] flex-col border-r border-[#8700ff]/30 bg-gradient-to-b from-[#120b1f] via-[#150d24] to-[#1a1030] shadow-[4px_0_40px_rgba(135,0,255,0.2)] transition-all duration-300 ease-out overflow-hidden md:relative md:z-auto md:h-auto md:min-h-[100dvh] md:flex-shrink-0 ${
          navOpen
            ? "translate-x-0 w-72 max-w-[85vw] md:max-w-none md:w-72"
            : "-translate-x-full pointer-events-none w-72 max-w-[85vw] md:translate-x-0 md:w-0 md:border-r-0 md:shadow-none"
        }`}
        aria-hidden={!navOpen}
      >
        <div className="w-72 max-w-[85vw] md:max-w-none h-full flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-[#8700ff]/25 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-Secondarycolor tracking-wide">Dashboard menu</span>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            className="p-2 rounded-lg text-[#9b8cb5] hover:text-white hover:bg-[#8700ff]/30 border border-transparent hover:border-[#8700ff]/40 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {SIDEBAR_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => goSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border transition-colors ${
                activeSection === id
                  ? "bg-[#8700ff]/45 text-white border-[#8700ff]/60 shadow-[0_0_20px_rgba(135,0,255,0.25)]"
                  : "text-[#c4b5dc] border-transparent hover:text-white hover:bg-[#8700ff]/15 hover:border-[#8700ff]/25"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full min-w-0 overflow-auto bg-white min-h-[100dvh]">
        <header className="sticky top-0 z-20 border-b border-[#8700ff]/15 bg-white/95 backdrop-blur-sm px-4 md:px-8 py-3 md:py-3.5 shadow-sm shadow-violet-100/50">
          <div className="flex items-center justify-between max-w-6xl mx-auto gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setNavOpen((open) => !open)}
                className="flex-shrink-0 p-2.5 rounded-xl dash-btn-soft !px-2.5"
                aria-label={navOpen ? "Hide sidebar" : "Show sidebar"}
                aria-expanded={navOpen}
              >
                <FaBars className="w-4 h-4" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base font-semibold text-slate-900 truncate sm:hidden">
                  {SECTION_TITLES[activeSection] || "Dashboard"}
                </h1>
                <div className="hidden sm:block min-w-0">
                  <h1 className="text-lg font-semibold text-slate-900 truncate">Welcome, {firstName}</h1>
                  <p className="text-xs text-slate-500 truncate">
                    {activeEnrollment?.course?.title || "Your learning dashboard"}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex-shrink-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-[#8700ff]/35 bg-violet-100 flex items-center justify-center text-base font-semibold text-[#8700ff] hover:ring-2 hover:ring-[#8700ff]/25 transition-shadow"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                {latest?.picture_url ? (
                  <img src={latest.picture_url} alt={firstName} className="w-full h-full object-cover" />
                ) : (
                  <span>{firstName.charAt(0).toUpperCase()}</span>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-56 rounded-xl border border-[#8700ff]/20 bg-white shadow-[0_12px_40px_rgba(135,0,255,0.18)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-violet-50/50">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.username || firstName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email || latest?.email}</p>
                    {activeEnrollment?.course?.title && (
                      <p className="text-xs text-[#8700ff] font-medium truncate mt-2">{activeEnrollment.course.title}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      goSection("applications");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-violet-50 transition-colors text-left"
                  >
                    <FaUser className="w-4 h-4 text-[#8700ff]" />
                    My profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {loading && (
            <div className="py-6">
              <CareersDashboardSkeleton />
            </div>
          )}
          {!loading && (isOffline || error) && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm mb-4">
              {isOffline && !error && "You are offline. Showing saved data on this device."}
              {error}
            </div>
          )}

          {!loading && (
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
                        <p className="type-stat-lg text-textcolor2 mt-2 tabular-nums">{applications.length}</p>
                        <p className="text-sm text-slate-600 mt-1">Career applications submitted</p>
                      </article>
                      <article className="brand-card p-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Enrolled</p>
                        <p className="type-stat-lg text-textcolor2 mt-2 tabular-nums">{activeEnrollment ? 1 : 0}</p>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{courseLabel}</p>
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

                  {activeEnrollment && (
                    <article className="brand-card overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                        <img
                          src={
                            activeEnrollment.course.imageUrl ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                          }
                          alt={activeEnrollment.course.title}
                          className="w-full h-48 md:h-full min-h-[12rem] object-cover border-b md:border-b-0 md:border-r border-slate-200/80"
                        />
                        <div className="p-6 md:p-8">
                          <p className="text-xs font-semibold uppercase tracking-widest text-[#8700ff]">Your course</p>
                          <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mt-1">
                            {activeEnrollment.course.title}
                          </h3>
                          {activeEnrollment.course.summary && (
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                              {activeEnrollment.course.summary}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span
                              className={`text-xs uppercase px-2.5 py-1 rounded-full border font-medium ${
                                levelClass[activeEnrollment.course.level] || "text-muted border-Primarycolor/30"
                              }`}
                            >
                              {activeEnrollment.course.level}
                            </span>
                            {activeEnrollment.course.durationWeeks && (
                              <span className="text-xs text-slate-500">
                                {activeEnrollment.course.durationWeeks} weeks
                              </span>
                            )}
                          </div>
                          <div className="mt-5">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                              <span>Progress</span>
                              <span className="font-medium tabular-nums">
                                {activeEnrollment.completedModules} / {activeEnrollment.totalModules} modules ·{" "}
                                {activeEnrollment.progressPercent}%
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#8700ff] to-[#ff6b00] rounded-full transition-all duration-500"
                                style={{ width: `${activeEnrollment.progressPercent}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-6">
                            <button type="button" onClick={() => goSection("modules")} className="dash-btn-primary">
                              Continue learning
                            </button>
                            <button type="button" onClick={() => goSection("learning")} className="dash-btn-soft">
                              View progress
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )}

                  {!activeEnrollment && latest && (
                    <article className="brand-card p-6 md:p-8 border border-dashed border-[#8700ff]/25 bg-violet-50/30">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#8700ff]">Applied track</p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-1">{latest.skill_interest}</h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {isAccepted
                          ? "Your course access is being prepared. Refresh shortly or contact support if this persists."
                          : "Your chosen course will appear here once your application is accepted."}
                      </p>
                    </article>
                  )}

                  <div className="brand-card p-6">
                    <h2 className="text-lg font-semibold text-textcolor2 mb-1">Quick actions</h2>
                    <p className="text-sm text-slate-600 mb-5">Open the menu to jump to a section, or use the buttons below.</p>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => goSection("applications")} className="dash-btn-soft">
                        View Applications
                      </button>
                      <button type="button" onClick={() => goSection("learning")} className="dash-btn-soft">
                        My Learning
                      </button>
                      <button type="button" onClick={() => goSection("modules")} className="dash-btn-primary">
                        Open Course Modules
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Applications */}
              {activeSection === "applications" && (
                <section className="brand-card overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 px-6 py-5 border-b border-[#8700ff]/10 bg-gradient-to-r from-violet-50/80 to-white">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Career application</h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {latest ? "Your submitted application and admission status" : "Submit your application to join a programme"}
                      </p>
                    </div>
                    {!latest && (
                      <Link to="/careers/apply" className="dash-btn-primary !py-2.5 !px-5 text-sm shrink-0">
                        New Application
                      </Link>
                    )}
                  </div>

                  {!latest && (
                    <div className="p-8 md:p-12 text-center">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                        <FaFileAlt className="w-6 h-6 text-[#8700ff]" />
                      </div>
                      <p className="text-slate-700 font-medium">No application on file yet</p>
                      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                        Complete the application form to be considered for admission into a Lasglowtech programme.
                      </p>
                    </div>
                  )}

                  {!!latest && (
                    <>
                      <div className="px-6 py-6 md:py-8 border-b border-slate-100 bg-gradient-to-br from-violet-50/60 via-white to-orange-50/30">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Current status</p>
                            <span
                              className={`inline-flex px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wider ${
                                statusClass[latest.status] || "text-slate-600 border-slate-300 bg-slate-50"
                              }`}
                            >
                              {latest.status}
                            </span>
                            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                              {statusHelperText[latest.status] || "Your application status will be updated here."}
                            </p>
                          </div>
                          <div className="md:text-right shrink-0">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Submitted</p>
                            <p className="text-sm font-medium text-slate-800 mt-1">
                              {new Date(latest.created_at).toLocaleDateString(undefined, {
                                weekday: "short",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(latest.created_at).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 md:p-6">
                          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8700ff]" />
                            Programme interest
                          </h3>
                          <dl className="space-y-0">
                            <div className="flex flex-col gap-0.5 py-3 border-b border-slate-200/70">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skill track</dt>
                              <dd className="text-sm font-medium text-slate-800">{latest.skill_interest}</dd>
                            </div>
                            <div className="flex flex-col gap-0.5 py-3 border-b border-slate-200/70">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Experience level</dt>
                              <dd className="text-sm font-medium text-slate-800">{latest.experience_level || "N/A"}</dd>
                            </div>
                            <div className="flex flex-col gap-0.5 py-3">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Learning goal</dt>
                              <dd className="text-sm text-slate-700 leading-relaxed">{latest.learning_goal}</dd>
                            </div>
                          </dl>
                        </article>

                        <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 md:p-6">
                          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8700ff]" />
                            Contact details
                          </h3>
                          <dl className="space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-slate-200/70">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full name</dt>
                              <dd className="text-sm font-medium text-slate-800">{latest.full_name}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-slate-200/70">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</dt>
                              <dd className="text-sm font-medium text-slate-800 break-all">{latest.email}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-slate-200/70">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</dt>
                              <dd className="text-sm font-medium text-slate-800">{latest.phone}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-slate-200/70">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Availability</dt>
                              <dd className="text-sm font-medium text-slate-800">{latest.availability || "N/A"}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3">
                              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</dt>
                              <dd className="text-sm font-medium text-slate-800">
                                {[latest.city, latest.country].filter(Boolean).join(", ") || "N/A"}
                              </dd>
                            </div>
                          </dl>
                        </article>

                        <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 md:p-6 lg:col-span-2">
                          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8700ff]" />
                            Programme & payment
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-xl bg-white border border-slate-200/80 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cohort</p>
                              <p className="text-sm font-semibold text-slate-800 mt-1">{latest.cohort || "Not assigned"}</p>
                            </div>
                            <div className="rounded-xl bg-white border border-slate-200/80 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Programme fee</p>
                              <p className="text-sm font-semibold text-slate-800 mt-1">
                                NGN {Number(latest.fee_amount || 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-xl bg-white border border-slate-200/80 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Payment</p>
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                                  paymentStatusClass[latest.payment_status] ||
                                  paymentStatusClass.unpaid
                                }`}
                              >
                                {latest.payment_status || "unpaid"}
                              </span>
                            </div>
                          </div>
                        </article>

                        {latest.portfolio_url && (
                          <article className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 md:p-6 lg:col-span-2">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8700ff]" />
                              Portfolio
                            </h3>
                            <a
                              href={latest.portfolio_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-[#8700ff] hover:underline break-all"
                            >
                              <FaExternalLinkAlt className="w-3.5 h-3.5 shrink-0" />
                              {latest.portfolio_url}
                            </a>
                          </article>
                        )}

                        {!!latest.admin_notes && (
                          <article className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 md:p-6 lg:col-span-2">
                            <h3 className="text-sm font-semibold text-amber-900 mb-2">Message from admissions</h3>
                            <p className="text-sm text-amber-900/90 leading-relaxed">{latest.admin_notes}</p>
                          </article>
                        )}
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* My Learning */}
              {activeSection === "learning" && (
                <section className="brand-card overflow-hidden">
                  <div className="px-6 py-5 border-b border-Primarycolor/20 bg-bgcolor/30">
                    <h2 className="text-xl font-semibold text-textcolor2">My learning progress</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {activeEnrollment?.course?.title || "Your enrolled course"}
                    </p>
                  </div>
                  <div className="p-6">
                  {!activeEnrollment && (
                    <p className="text-slate-600">
                      {isAccepted
                        ? "Your course is being set up. Refresh the page shortly, or contact support if access does not appear."
                        : "Your course will be available here once your application is accepted."}
                    </p>
                  )}
                  {activeEnrollment && (
                  <article className="brand-card p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-textcolor2">{activeEnrollment.course.title}</p>
                          <span
                            className={`text-xs uppercase px-2.5 py-1 rounded-full border font-medium ${
                              levelClass[activeEnrollment.course.level] || "text-muted border-Primarycolor/30"
                            }`}
                          >
                            {activeEnrollment.course.level}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          {activeEnrollment.completedModules} / {activeEnrollment.totalModules} modules — {activeEnrollment.progressPercent}%
                        </p>
                        <div className="w-full h-2.5 bg-bgcolor2 rounded-full mt-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-Primarycolor to-Secondarycolor rounded-full transition-all duration-500"
                            style={{ width: `${activeEnrollment.progressPercent}%` }}
                          />
                        </div>
                        {Number(activeEnrollment.progressPercent) >= 100 ? (
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
                                  onClick={() => previewCertificate(activeEnrollment.enrollmentId)}
                                  disabled={certificateActionKey === `preview-${activeEnrollment.enrollmentId}` || certificateActionKey === `download-${activeEnrollment.enrollmentId}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor/10 text-sm transition-colors"
                                >
                                  <FaExternalLinkAlt /> {certificateActionKey === `preview-${activeEnrollment.enrollmentId}` ? "Loading..." : "Preview Certificate"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadCertificate(activeEnrollment.enrollmentId, activeEnrollment.course.title)}
                                  disabled={certificateActionKey === `download-${activeEnrollment.enrollmentId}` || certificateActionKey === `preview-${activeEnrollment.enrollmentId}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-sm transition-colors"
                                >
                                  <FaDownload /> {certificateActionKey === `download-${activeEnrollment.enrollmentId}` ? "Preparing PDF..." : "Download Certificate"}
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 mt-3">
                            Complete all {activeEnrollment.totalModules} modules to unlock your certificate.
                          </p>
                        )}
                  </article>
                  )}
                  </div>
                </section>
              )}

              {/* Course Modules (LMS) – hierarchical weeks + mobile bottom tabs */}
              {activeSection === "modules" && (
                <section className="brand-card overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-Primarycolor/20 bg-bgcolor/30">
                    <div>
                      <h2 className="text-xl font-semibold text-textcolor2">Course modules</h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {activeEnrollment?.course?.title || "Lessons, notes, and resources"}
                      </p>
                      {activeEnrollment?.course?.scheduleStartDate && (
                        <p className="text-xs text-slate-500 mt-1">
                          Programme starts{" "}
                          <strong className="text-slate-700">
                            {formatScheduleDate(activeEnrollment.course.scheduleStartDate, {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </strong>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeEnrollment?.course?.title && (
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-violet-50 border border-[#8700ff]/25 text-sm font-medium text-[#8700ff]">
                          {activeEnrollment.course.title}
                        </span>
                      )}
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

                  {modulesLoading && (
                    <div className="px-4 md:px-6 pb-4">
                      <OrderListSkeleton rows={4} />
                    </div>
                  )}
                  {!modulesLoading && !modules.length && (
                    <p className="px-6 text-slate-600 text-sm">No modules for this course yet.</p>
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
                            {activeEnrollment && (
                              <>
                                <p className="text-sm font-semibold text-textcolor2 mb-1">
                                  {activeEnrollment.course?.title}
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
                                      {formatWeekRangeLabel(activeEnrollment?.course?.scheduleStartDate, week) && (
                                        <span className="text-[11px] text-slate-500 hidden lg:inline truncate max-w-[140px]">
                                          {formatWeekRangeLabel(activeEnrollment?.course?.scheduleStartDate, week)}
                                        </span>
                                      )}
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
                                                {formatModuleScheduleLabel(module) ? (
                                                  <p className="text-[11px] text-[#8700ff] truncate">{formatModuleScheduleLabel(module)}</p>
                                                ) : module.moduleOrder ? (
                                                  <p className="text-xs text-muted">Module {module.moduleOrder}</p>
                                                ) : null}
                                              </div>
                                              {module.hasQuiz && (
                                                <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-violet-100 text-[#8700ff] text-[10px] font-semibold uppercase tracking-wide">
                                                  Quiz
                                                </span>
                                              )}
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
                                      {formatWeekRangeLabel(activeEnrollment?.course?.scheduleStartDate, week) && (
                                        <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                                          {formatWeekRangeLabel(activeEnrollment?.course?.scheduleStartDate, week)}
                                        </span>
                                      )}
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
                                              <div className="min-w-0 flex-1 text-left">
                                                <p className="text-sm truncate">{module.title}</p>
                                                {formatModuleScheduleLabel(module) && (
                                                  <p className="text-[11px] text-[#8700ff] truncate">{formatModuleScheduleLabel(module)}</p>
                                                )}
                                              </div>
                                              {module.hasQuiz && (
                                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-violet-100 text-[#8700ff] text-[10px] font-semibold uppercase">
                                                  Quiz
                                                </span>
                                              )}
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
                        <article
                          className={`flex-1 min-w-0 ${
                            selectedModule && isQuizOnlyModule(selectedModule)
                              ? "p-3 md:p-0"
                              : "brand-card p-4 md:p-6"
                          } ${mobileModulesTab === "modules" ? "hidden md:block" : ""}`}
                        >
                        {!selectedModule && (
                          <p className="text-slate-600 text-sm">Select a module from the list to view content.</p>
                        )}
                        {!!selectedModule && (
                          <div className="space-y-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Module {selectedModule.moduleOrder}</p>
                                <h3 className="text-xl font-semibold text-textcolor2 mt-1">{selectedModule.title}</h3>
                                {formatModuleScheduleLabel(selectedModule) && (
                                  <p className="text-sm learner-module-schedule font-medium mt-1">
                                    Scheduled: {formatModuleScheduleLabel(selectedModule)}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleModuleComplete(selectedModule)}
                                disabled={!selectedModule.isCompleted && !canMarkModuleComplete(selectedModule)}
                                title={
                                  !selectedModule.isCompleted && selectedModule.hasQuiz && !selectedModule.quizSubmitted
                                    ? "Submit the module quiz first"
                                    : undefined
                                }
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                  selectedModule.isCompleted
                                    ? "border border-emerald-300/60 text-emerald-700 bg-emerald-50"
                                    : canMarkModuleComplete(selectedModule)
                                      ? "dash-btn-soft"
                                      : "dash-btn-soft opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <FaCheckCircle className="w-4" />
                                {selectedModule.isCompleted ? "Completed" : "Mark complete"}
                              </button>
                            </div>

                            {selectedModule.hasQuiz && !selectedModule.quizSubmitted && !selectedModule.isCompleted && (
                              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                Complete and submit the module quiz before you can mark this module as done.
                              </p>
                            )}

                            {selectedModule.hasQuiz && selectedModule.quizSubmitted && (
                              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                                Quiz submitted
                                {selectedModule.quizPercent != null ? ` — ${selectedModule.quizPercent}%` : ""}.
                                You can now mark this module complete.
                              </p>
                            )}

                            {isQuizOnlyModule(selectedModule) && (
                              <>
                                <ModuleQuiz
                                  enrollmentId={selectedEnrollmentId}
                                  moduleId={selectedModuleId}
                                  token={token}
                                  moduleTitle={selectedModule.title}
                                  hasQuizHint
                                  onSubmitted={(result) => handleQuizSubmitted(selectedModuleId, result)}
                                />
                              </>
                            )}

                            {!isQuizOnlyModule(selectedModule) && (
                            <>
                            <p className="text-xs text-slate-500">
                              Estimated duration: {selectedModule.durationMinutes} mins
                            </p>

                            {selectedModule.hasQuiz && (
                              <button
                                type="button"
                                onClick={() => document.getElementById("module-quiz")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#8700ff]/30 bg-violet-50 text-[#8700ff] text-sm font-semibold hover:bg-violet-100 transition-colors"
                              >
                                Jump to module quiz ↓
                              </button>
                            )}

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
                            {!isQuizOnlyModule(selectedModule) && !!stripHtml(selectedModule.moduleContent) && (
                              <div className="brand-card overflow-hidden">
                                <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-Primarycolor/20 bg-bgcolor/30">
                                  <span className="text-sm font-semibold text-textcolor2">Course notes</span>
                                  <button
                                    type="button"
                                    onClick={() => downloadModuleNotesPdf(selectedModule)}
                                    className="dash-btn-soft !px-3 !py-2 text-xs"
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

                            {!!selectedModule.videoUrl && (
                              <ModuleVideoEmbed
                                url={selectedModule.videoUrl}
                                title={selectedModule.title || "Lesson video"}
                                baseApiUrl={instance.defaults.baseURL}
                              />
                            )}

                            {/* My notes */}
                            {!isQuizOnlyModule(selectedModule) && (
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
                            )}

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

                            {!isQuizOnlyModule(selectedModule) && (
                            <ModuleQuiz
                              enrollmentId={selectedEnrollmentId}
                              moduleId={selectedModuleId}
                              token={token}
                              moduleTitle={selectedModule.title}
                              hasQuizHint
                              onSubmitted={(result) => handleQuizSubmitted(selectedModuleId, result)}
                            />
                            )}
                            </>
                            )}

                            {/* Bottom actions – Mark incomplete / Continue */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-Primarycolor/20">
                              <button
                                type="button"
                                onClick={() => toggleModuleComplete(selectedModule)}
                                disabled={!selectedModule.isCompleted && !canMarkModuleComplete(selectedModule)}
                                title={
                                  !selectedModule.isCompleted && selectedModule.hasQuiz && !selectedModule.quizSubmitted
                                    ? "Submit the module quiz first"
                                    : undefined
                                }
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                  selectedModule.isCompleted
                                    ? "dash-btn-ghost border border-slate-200"
                                    : canMarkModuleComplete(selectedModule)
                                      ? "dash-btn-soft"
                                      : "dash-btn-soft opacity-50 cursor-not-allowed"
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
                                    className="dash-btn-primary !py-2.5"
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
    </div>
  );
};

export default CareersDashboard;

