import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import instance from "../../config/axios.config";
import { exportCertificateToA4Pdf } from "../../utils/certificatePdfExport";
import { getAdminToken } from "../../utils/adminAuth";
import {
  adminBtnDanger,
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSoft,
  adminCardBody,
  adminDetailLabel,
  adminFieldLabel,
  adminInput,
  adminMuted,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
  adminSideNav,
  adminSideNavBtn,
  adminSideNavTitle,
  adminTextarea,
} from "../../utils/adminUi";
import { downloadQuizCsvTemplate, parseQuizCsv, quizCsvToFormQuestions } from "../../utils/quizCsvImport";
import CertificatePreview from "../../components/certificate-preview";
import { LmsCourseListSkeleton, OrderListSkeleton } from "../../components/skeletons/CardSkeletons";

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
const certificateAssetBaseUrl = (instance.defaults.baseURL || "").replace(/\/$/, "");
const buildCertificateAssetUrl = (filename, version = Date.now()) =>
  certificateAssetBaseUrl ? `${certificateAssetBaseUrl}/uploads/${filename}?t=${version}` : "";

const defaultCourse = {
  id: null,
  title: "",
  summary: "",
  description: "",
  level: "beginner",
  durationWeeks: 4,
  imageUrl: "",
  brochureUrl: "",
  isFeatured: false,
  isPublished: true,
  issueCertificateOnCompletion: true,
  scheduleStartDate: "",
};

const defaultModule = {
  id: null,
  courseId: "",
  title: "",
  moduleOrder: 1,
  weekNum: null,
  scheduledDate: "",
  scheduledTime: "",
  durationMinutes: 20,
  resourceUrl: "",
  slideUrl: "",
  videoUrl: "",
  moduleContent: "",
  referenceLinksText: "",
  isPreview: false,
};

const makeQuizOption = (isCorrect = false) => ({
  key: `opt-${Date.now()}-${Math.random()}`,
  optionText: "",
  isCorrect,
});

const makeQuizQuestion = () => ({
  key: `q-${Date.now()}-${Math.random()}`,
  questionText: "",
  options: [makeQuizOption(true), makeQuizOption(false)],
});

const defaultQuizForm = {
  courseId: "",
  moduleId: "",
  title: "Module quiz",
  questions: [makeQuizQuestion()],
};

const LmsAdmin = () => {
  const headers = useMemo(() => ({ Authorization: `Bearer ${getAdminToken()}` }), []);
  const [courses, setCourses] = useState([]);
  const [courseModules, setCourseModules] = useState([]);
  const [courseForm, setCourseForm] = useState(defaultCourse);
  const [moduleForm, setModuleForm] = useState(defaultModule);
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentCourseFilter, setEnrollmentCourseFilter] = useState("");
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState([]);
  const [issuingId, setIssuingId] = useState(null);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [issueCertEnrollment, setIssueCertEnrollment] = useState(null);
  const [issueCertBatchMode, setIssueCertBatchMode] = useState(false);
  const [issueCertForm, setIssueCertForm] = useState({
    recipientFullName: "",
    bodyMessage: "",
    signedDate: new Date().toISOString().slice(0, 10),
    signatureLabel: "Authorized Signatory",
  });
  const [resourcePdfUploading, setResourcePdfUploading] = useState(false);
  const [brochurePdfUploading, setBrochurePdfUploading] = useState(false);
  const [certificateLogoUploading, setCertificateLogoUploading] = useState(false);
  const [certificateSealUploading, setCertificateSealUploading] = useState(false);
  const [certificateSignatureUploading, setCertificateSignatureUploading] = useState(false);
  const [certificateLogoVersion, setCertificateLogoVersion] = useState(Date.now());
  const [certificateSealVersion, setCertificateSealVersion] = useState(Date.now());
  const [certificateSignatureVersion, setCertificateSignatureVersion] = useState(Date.now());
  const [certificateSettings, setCertificateSettings] = useState({
    defaultMessage: "",
    defaultSignatureLabel: "Authorized Signatory",
  });
  const [certSettingsSaving, setCertSettingsSaving] = useState(false);
  const [quizForm, setQuizForm] = useState(defaultQuizForm);
  const [quizModules, setQuizModules] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizCsvPaste, setQuizCsvPaste] = useState("");
  const quizCsvInputRef = useRef(null);
  const selectedModuleCourseId = moduleForm.courseId || "";
  const certificatePreviewRef = useRef(null);
  const certificateLogoUrl = useMemo(() => buildCertificateAssetUrl("certificate-logo.png", certificateLogoVersion), [certificateLogoVersion]);
  const certificateSealUrl = useMemo(() => buildCertificateAssetUrl("certificate-seal.png", certificateSealVersion), [certificateSealVersion]);
  const certificateSignatureUrl = useMemo(
    () => buildCertificateAssetUrl("certificate-signature.png", certificateSignatureVersion),
    [certificateSignatureVersion]
  );

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/lms/admin/courses", { headers });
      setCourses(res.data || []);
    } catch (error) {
      toast.error("Unable to load LMS courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [headers]);

  const loadCertificateSettings = async () => {
    try {
      const res = await instance.get("/admin/certificate-settings", { headers });
      setCertificateSettings({
        defaultMessage: res.data?.defaultMessage ?? "",
        defaultSignatureLabel: res.data?.defaultSignatureLabel ?? "Authorized Signatory",
      });
    } catch (_) {
      // optional
    }
  };

  useEffect(() => {
    loadCertificateSettings();
  }, [headers]);

  const loadModulesForCourse = async (courseId) => {
    if (!courseId) {
      setCourseModules([]);
      return;
    }
    try {
      const res = await instance.get(`/lms/admin/courses/${courseId}/modules`, { headers });
      setCourseModules(res.data || []);
    } catch (error) {
      setCourseModules([]);
      toast.error("Unable to load modules for selected course.");
    }
  };

  useEffect(() => {
    if (selectedModuleCourseId) {
      loadModulesForCourse(selectedModuleCourseId);
    } else {
      setCourseModules([]);
    }
  }, [selectedModuleCourseId]);

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      if (courseForm.id) {
        await instance.put(`/lms/admin/courses/${courseForm.id}`, courseForm, { headers });
        toast.success("Course updated.");
      } else {
        await instance.post("/lms/admin/courses", courseForm, { headers });
        toast.success("Course created.");
      }
      setCourseForm(defaultCourse);
      loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save course.");
    }
  };

  const saveModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.courseId) return toast.error("Select a course.");
    try {
      const payload = {
        ...moduleForm,
        referenceLinks: moduleForm.referenceLinksText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean),
      };
      if (moduleForm.id) {
        await instance.put(`/lms/admin/courses/${moduleForm.courseId}/modules/${moduleForm.id}`, payload, { headers });
        toast.success("Module updated.");
      } else {
        await instance.post(`/lms/admin/courses/${moduleForm.courseId}/modules`, payload, { headers });
        toast.success("Module added.");
      }
      setModuleForm(defaultModule);
      loadModulesForCourse(moduleForm.courseId);
      loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save module.");
    }
  };

  const editModule = (module) => {
    setModuleForm({
      id: module.id,
      courseId: String(module.course_id || ""),
      title: module.title || "",
      moduleOrder: Number(module.module_order || 1),
      weekNum: module.week_num != null ? Number(module.week_num) : null,
      scheduledDate: module.scheduled_date ? String(module.scheduled_date).slice(0, 10) : "",
      scheduledTime: module.scheduled_time ? String(module.scheduled_time).slice(0, 5) : "",
      durationMinutes: Number(module.duration_minutes || 20),
      resourceUrl: module.resource_url || "",
      slideUrl: module.slide_url || "",
      videoUrl: module.video_url || "",
      moduleContent: module.module_content || "",
      referenceLinksText: (module.reference_links || []).join("\n"),
      isPreview: Boolean(module.is_preview),
    });
    document.getElementById("lms-modules")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const deleteModule = async (module) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await instance.delete(`/lms/admin/courses/${module.course_id}/modules/${module.id}`, { headers });
      toast.success("Module deleted.");
      if (moduleForm.id === module.id) {
        setModuleForm(defaultModule);
      }
      if (String(quizForm.moduleId) === String(module.id)) {
        setQuizForm(defaultQuizForm);
      }
      loadModulesForCourse(module.course_id);
      loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete module.");
    }
  };

  const loadQuizModulesForCourse = async (courseId) => {
    if (!courseId) {
      setQuizModules([]);
      return;
    }
    try {
      const res = await instance.get(`/lms/admin/courses/${courseId}/modules`, { headers });
      setQuizModules(res.data || []);
    } catch {
      setQuizModules([]);
    }
  };

  const loadQuizForModule = async (courseId, moduleId) => {
    if (!courseId || !moduleId) return;
    setQuizLoading(true);
    try {
      const res = await instance.get(`/lms/admin/courses/${courseId}/modules/${moduleId}/quiz`, { headers });
      const data = res.data || {};
      const questions = (data.questions || []).length
        ? data.questions.map((q) => ({
            key: `q-${q.id}`,
            questionText: q.questionText || "",
            options: (q.options || []).map((o) => ({
              key: `opt-${o.id}`,
              optionText: o.optionText || "",
              isCorrect: Boolean(o.isCorrect),
            })),
          }))
        : [makeQuizQuestion()];
      setQuizForm((prev) => ({
        ...prev,
        courseId: String(courseId),
        moduleId: String(moduleId),
        title: data.title || "Module quiz",
        questions,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to load quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  useEffect(() => {
    if (quizForm.courseId) {
      loadQuizModulesForCourse(quizForm.courseId);
    } else {
      setQuizModules([]);
    }
  }, [quizForm.courseId]);

  useEffect(() => {
    if (quizForm.courseId && quizForm.moduleId) {
      loadQuizForModule(quizForm.courseId, quizForm.moduleId);
    }
  }, [quizForm.moduleId]);

  const updateQuizQuestion = (questionKey, patch) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.key === questionKey ? { ...q, ...patch } : q)),
    }));
  };

  const updateQuizOption = (questionKey, optionKey, patch) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.key === questionKey
          ? {
              ...q,
              options: q.options.map((o) => (o.key === optionKey ? { ...o, ...patch } : o)),
            }
          : q
      ),
    }));
  };

  const setCorrectQuizOption = (questionKey, optionKey) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.key === questionKey
          ? {
              ...q,
              options: q.options.map((o) => ({ ...o, isCorrect: o.key === optionKey })),
            }
          : q
      ),
    }));
  };

  const addQuizQuestion = () => {
    setQuizForm((prev) => ({ ...prev, questions: [...prev.questions, makeQuizQuestion()] }));
  };

  const removeQuizQuestion = (questionKey) => {
    setQuizForm((prev) => {
      const next = prev.questions.filter((q) => q.key !== questionKey);
      return { ...prev, questions: next.length ? next : [makeQuizQuestion()] };
    });
  };

  const addQuizOption = (questionKey) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.key === questionKey ? { ...q, options: [...q.options, makeQuizOption(false)] } : q
      ),
    }));
  };

  const removeQuizOption = (questionKey, optionKey) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.key !== questionKey) return q;
        const next = q.options.filter((o) => o.key !== optionKey);
        if (next.length < 2) return q;
        if (!next.some((o) => o.isCorrect)) next[0].isCorrect = true;
        return { ...q, options: next };
      }),
    }));
  };

  const saveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.courseId || !quizForm.moduleId) {
      toast.error("Select a course and module.");
      return;
    }
    setQuizSaving(true);
    try {
      const payload = {
        title: quizForm.title,
        questions: quizForm.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options.map((o) => ({
            optionText: o.optionText,
            isCorrect: o.isCorrect,
          })),
        })),
      };
      await instance.put(`/lms/admin/courses/${quizForm.courseId}/modules/${quizForm.moduleId}/quiz`, payload, {
        headers,
      });
      const mod = quizModules.find((m) => String(m.id) === String(quizForm.moduleId));
      const modLabel = mod ? `Module ${mod.module_order}: ${mod.title}` : "this module";
      toast.success(
        `Quiz saved to ${modLabel}. Learners see it under Careers → Course Modules → ${mod?.title || "that module"}.`
      );
      loadQuizForModule(quizForm.courseId, quizForm.moduleId);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save quiz.");
    } finally {
      setQuizSaving(false);
    }
  };

  const deleteQuiz = async () => {
    if (!quizForm.courseId || !quizForm.moduleId) return;
    if (!window.confirm("Delete the quiz for this module?")) return;
    try {
      await instance.delete(`/lms/admin/courses/${quizForm.courseId}/modules/${quizForm.moduleId}/quiz`, { headers });
      toast.success("Quiz deleted.");
      setQuizForm((prev) => ({ ...defaultQuizForm, courseId: prev.courseId, moduleId: prev.moduleId }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete quiz.");
    }
  };

  const applyQuizCsvImport = (text, { replace = true } = {}) => {
    const { questions, errors, warnings } = parseQuizCsv(text);
    if (errors.length) {
      toast.error(errors.slice(0, 2).join(" "));
      return;
    }
    const imported = quizCsvToFormQuestions(questions);
    setQuizForm((prev) => ({
      ...prev,
      questions: replace ? imported : [...prev.questions, ...imported],
    }));
    if (warnings.length) {
      toast.warn(`${imported.length} questions imported. ${warnings.length} row(s) skipped.`);
    } else {
      toast.success(`${imported.length} question${imported.length === 1 ? "" : "s"} imported from CSV. Review and click Save quiz.`);
    }
  };

  const handleQuizCsvFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type && !file.type.includes("csv") && file.type !== "text/plain") {
      toast.error("Please upload a .csv file.");
      e.target.value = "";
      return;
    }
    try {
      const text = await file.text();
      applyQuizCsvImport(text, { replace: true });
      setQuizCsvPaste("");
    } catch {
      toast.error("Could not read CSV file.");
    } finally {
      e.target.value = "";
    }
  };

  const handleQuizCsvPasteImport = () => {
    if (!quizCsvPaste.trim()) {
      toast.error("Paste CSV content or upload a file first.");
      return;
    }
    applyQuizCsvImport(quizCsvPaste, { replace: true });
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course and modules?")) return;
    try {
      await instance.delete(`/lms/admin/courses/${id}`, { headers });
      toast.success("Course deleted.");
      loadCourses();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const loadEnrollments = async () => {
    setEnrollmentsLoading(true);
    try {
      const params = enrollmentCourseFilter ? { courseId: enrollmentCourseFilter } : {};
      const res = await instance.get("/lms/admin/enrollments", { headers, params });
      const next = res.data || [];
      setEnrollments(next);
      setSelectedEnrollmentIds((prev) =>
        prev.filter((id) => next.some((item) => item.enrollmentId === id && !item.certificateSentAt))
      );
    } catch (error) {
      toast.error("Unable to load enrollments.");
      setEnrollments([]);
      setSelectedEnrollmentIds([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [enrollmentCourseFilter]);

  const previewCertificate = async (enrollmentId) => {
    try {
      const res = await instance.get(`/lms/admin/enrollments/${enrollmentId}/certificate`, {
        headers,
        responseType: "text",
      });
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(res.data);
        w.document.close();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not load certificate.");
    }
  };

  const requestDeleteEnrollment = (en) => {
    setDeleteConfirm({
      enrollmentId: en.enrollmentId,
      learnerName: en.learnerName,
      courseTitle: en.courseTitle,
    });
  };

  const confirmDeleteEnrollment = async () => {
    if (!deleteConfirm) return;
    const { enrollmentId } = deleteConfirm;
    setDeletingEnrollmentId(enrollmentId);
    try {
      await instance.delete(`/lms/admin/enrollments/${enrollmentId}`, { headers });
      toast.success("Enrollment removed.");
      setDeleteConfirm(null);
      setSelectedEnrollmentIds((prev) => prev.filter((id) => id !== enrollmentId));
      loadEnrollments();
      loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not remove enrollment.");
    } finally {
      setDeletingEnrollmentId(null);
    }
  };

  const uploadModuleResourcePdf = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }
    setResourcePdfUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await instance.post("/admin/upload/module-resource", formData, {
        headers: { ...headers, "Content-Type": undefined },
      });
      const url = res.data?.url;
      if (url) {
        setModuleForm((p) => ({ ...p, resourceUrl: url }));
        toast.success("Course note PDF uploaded. Save the module to keep it.");
      } else {
        toast.error("Upload succeeded but no URL returned.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "PDF upload failed.");
    } finally {
      setResourcePdfUploading(false);
      e.target.value = "";
    }
  };

  const uploadCourseBrochurePdf = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }
    setBrochurePdfUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await instance.post("/admin/upload/module-resource", formData, {
        headers: { ...headers, "Content-Type": undefined },
      });
      const url = res.data?.url;
      if (url) {
        setCourseForm((p) => ({ ...p, brochureUrl: url }));
        toast.success("Course brochure uploaded. Save the course to keep it.");
      } else {
        toast.error("Upload succeeded but no URL returned.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Brochure upload failed.");
    } finally {
      setBrochurePdfUploading(false);
      e.target.value = "";
    }
  };

  const uploadCertificateSeal = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
      toast.error("Please select a PNG, JPG, or WEBP image.");
      return;
    }
    setCertificateSealUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await instance.post("/admin/upload/certificate-seal", formData, {
        headers: { ...headers, "Content-Type": undefined },
      });
      setCertificateSealVersion(Date.now());
      toast.success("Certificate seal updated.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Seal upload failed.");
    } finally {
      setCertificateSealUploading(false);
      e.target.value = "";
    }
  };

  const uploadCertificateSignature = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
      toast.error("Please select a PNG, JPG, or WEBP signature image.");
      return;
    }
    setCertificateSignatureUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await instance.post("/admin/upload/certificate-signature", formData, {
        headers: { ...headers, "Content-Type": undefined },
      });
      setCertificateSignatureVersion(Date.now());
      toast.success("Signature image updated.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signature upload failed.");
    } finally {
      setCertificateSignatureUploading(false);
      e.target.value = "";
    }
  };

  const uploadCertificateLogo = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
      toast.error("Please select a PNG, JPG, or WEBP logo.");
      return;
    }
    setCertificateLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await instance.post("/admin/upload/certificate-logo", formData, {
        headers: { ...headers, "Content-Type": undefined },
      });
      setCertificateLogoVersion(Date.now());
      toast.success("Certificate logo updated.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Logo upload failed.");
    } finally {
      setCertificateLogoUploading(false);
      e.target.value = "";
    }
  };

  const saveCertificateSettings = async (e) => {
    e?.preventDefault?.();
    setCertSettingsSaving(true);
    try {
      await instance.put(
        "/admin/certificate-settings",
        {
          defaultMessage: certificateSettings.defaultMessage,
          defaultSignatureLabel: certificateSettings.defaultSignatureLabel,
        },
        { headers }
      );
      toast.success("Certificate defaults saved.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed.");
    } finally {
      setCertSettingsSaving(false);
    }
  };

  const openIssueModal = (en) => {
    setIssueCertBatchMode(false);
    setIssueCertEnrollment(en);
    setIssueCertForm({
      recipientFullName: en.learnerName || "",
      bodyMessage: certificateSettings.defaultMessage || "",
      signedDate: new Date().toISOString().slice(0, 10),
      signatureLabel: certificateSettings.defaultSignatureLabel || "Authorized Signatory",
    });
  };

  const openBatchIssueModal = () => {
    if (!selectedEnrollmentIds.length) {
      toast.error("Select at least one enrollment first.");
      return;
    }
    setIssueCertBatchMode(true);
    setIssueCertEnrollment({
      learnerName: `${selectedEnrollmentIds.length} learners`,
      courseTitle: "Selected courses",
    });
    setIssueCertForm({
      recipientFullName: "",
      bodyMessage: certificateSettings.defaultMessage || "",
      signedDate: new Date().toISOString().slice(0, 10),
      signatureLabel: certificateSettings.defaultSignatureLabel || "Authorized Signatory",
    });
  };

  const downloadCertificatePreviewPdf = async () => {
    const element = certificatePreviewRef.current;
    if (!element) return;

    try {
      const name = `${issueCertBatchMode ? "batch" : (issueCertForm.recipientFullName || issueCertEnrollment?.learnerName || "certificate")
        .replace(/\s+/g, "-")
        .toLowerCase()}-certificate-a4.pdf`;
      await exportCertificateToA4Pdf(element, name);
    } catch (error) {
      toast.error("Could not generate PDF preview.");
    }
  };

  const toggleEnrollmentSelection = (enrollmentId) => {
    setSelectedEnrollmentIds((prev) =>
      prev.includes(enrollmentId) ? prev.filter((id) => id !== enrollmentId) : [...prev, enrollmentId]
    );
  };

  const toggleSelectAllEnrollments = () => {
    const selectableIds = enrollments.filter((item) => !item.certificateSentAt).map((item) => item.enrollmentId);
    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedEnrollmentIds.includes(id));
    setSelectedEnrollmentIds(allSelected ? [] : selectableIds);
  };

  const issueCertificate = async () => {
    if (!issueCertEnrollment) return;
    const enrollmentId = issueCertEnrollment.enrollmentId;
    setIssuingId(issueCertBatchMode ? "batch" : enrollmentId);
    try {
      if (issueCertBatchMode) {
        const res = await instance.post(
          "/lms/admin/enrollments/issue-certificates/batch",
          {
            enrollmentIds: selectedEnrollmentIds,
            bodyMessage: issueCertForm.bodyMessage.trim() || undefined,
            signedDate: issueCertForm.signedDate || undefined,
            signatureLabel: issueCertForm.signatureLabel.trim() || undefined,
          },
          { headers }
        );
        toast.success(res.data?.message || "Batch certificate generation completed.");
        setSelectedEnrollmentIds([]);
      } else {
        await instance.post(
          `/lms/admin/enrollments/${enrollmentId}/issue-certificate`,
          {
            recipientFullName: issueCertForm.recipientFullName.trim() || issueCertEnrollment.learnerName,
            bodyMessage: issueCertForm.bodyMessage.trim() || undefined,
            signedDate: issueCertForm.signedDate || undefined,
            signatureLabel: issueCertForm.signatureLabel.trim() || undefined,
          },
          { headers }
        );
        toast.success("Certificate issued and email sent. Learner can download only after this acknowledgment.");
      }
      setIssueCertEnrollment(null);
      setIssueCertBatchMode(false);
      loadEnrollments();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to issue certificate.");
    } finally {
      setIssuingId(null);
    }
  };

  const lmsNav = [
    { id: "lms-create-course", label: "Create course" },
    { id: "lms-modules", label: "Add module" },
    { id: "lms-quiz", label: "Module quiz" },
    { id: "lms-certificate", label: "Certificate" },
    { id: "lms-enrollments", label: "Enrollments" },
    { id: "lms-courses-list", label: "Courses list" },
  ];
  const [activeLmsView, setActiveLmsView] = useState("lms-create-course");
  const isCourseEditing = Boolean(courseForm.id);
  const showModulesPanel = activeLmsView === "lms-modules" || isCourseEditing;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <aside className="lg:w-52 flex-shrink-0">
        <nav className={`hidden lg:block sticky top-24 ${adminSideNav}`}>
          <p className={adminSideNavTitle}>LMS</p>
          {lmsNav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveLmsView(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeLmsView === item.id
                  ? "bg-violet-100 text-violet-900"
                  : "text-slate-600 hover:bg-violet-50 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
      {activeLmsView === "lms-create-course" && (
      <section id="lms-create-course" className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h2 className={adminSectionTitle}>LMS manager</h2>
          <p className={adminSectionDesc}>Create learning courses and structured modules.</p>
        </div>
        <div className="p-6">

        <form onSubmit={saveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={courseForm.title}
            onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Course title"
            className={adminInput}
            required
          />
          <input
            value={courseForm.summary}
            onChange={(e) => setCourseForm((p) => ({ ...p, summary: e.target.value }))}
            placeholder="Course summary"
            className={adminInput}
            required
          />
          <select
            value={courseForm.level}
            onChange={(e) => setCourseForm((p) => ({ ...p, level: e.target.value }))}
            className={adminInput}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="number"
            value={courseForm.durationWeeks}
            onChange={(e) => setCourseForm((p) => ({ ...p, durationWeeks: e.target.value }))}
            placeholder="Duration weeks"
            className={adminInput}
          />
          <div>
            <label className={adminFieldLabel}>Course start date (schedule)</label>
            <input
              type="date"
              value={courseForm.scheduleStartDate || ""}
              onChange={(e) => setCourseForm((p) => ({ ...p, scheduleStartDate: e.target.value }))}
              className={adminInput}
            />
            <p className={`text-xs ${adminSectionDesc} mt-1`}>
              Week dates on the learner dashboard are calculated from this start date.
            </p>
          </div>
          <input
            value={courseForm.imageUrl}
            onChange={(e) => setCourseForm((p) => ({ ...p, imageUrl: e.target.value }))}
            placeholder="Image URL (optional)"
            className={`md:col-span-2 ${adminInput}`}
          />
          <div className="md:col-span-2 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <input
              value={courseForm.brochureUrl}
              onChange={(e) => setCourseForm((p) => ({ ...p, brochureUrl: e.target.value }))}
              placeholder="Brochure PDF URL (optional)"
              className={adminInput}
            />
            <label className={`inline-flex cursor-pointer items-center justify-center ${adminBtnSoft} px-4 py-3 text-sm`}>
              <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={uploadCourseBrochurePdf} />
              {brochurePdfUploading ? "Uploading brochure..." : "Upload brochure PDF"}
            </label>
          </div>
          <textarea
            value={courseForm.description}
            onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description"
            rows={4}
            className={`md:col-span-2 ${adminInput}`}
          />
          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input
              type="checkbox"
              checked={courseForm.isFeatured}
              onChange={(e) => setCourseForm((p) => ({ ...p, isFeatured: e.target.checked }))}
            />
            Featured
          </label>
          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input
              type="checkbox"
              checked={courseForm.isPublished}
              onChange={(e) => setCourseForm((p) => ({ ...p, isPublished: e.target.checked }))}
            />
            Published
          </label>
          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input
              type="checkbox"
              checked={courseForm.issueCertificateOnCompletion !== false}
              onChange={(e) => setCourseForm((p) => ({ ...p, issueCertificateOnCompletion: e.target.checked }))}
            />
            Issue certificate on completion
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className={adminBtnPrimary}
            >
              {courseForm.id ? "Update Course" : "Create Course"}
            </button>
            {courseForm.id && (
              <button
                type="button"
                className={adminBtnSoft}
                onClick={() => {
                  setCourseForm(defaultCourse);
                  setModuleForm(defaultModule);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
        </div>
      </section>
      )}

      {showModulesPanel && (
      <section id="lms-modules" className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>
            {moduleForm.id ? "Edit module" : "Add module"}
          </h3>
          <p className={adminSectionDesc}>
            {moduleForm.id
              ? `Updating "${moduleForm.title}". Change fields and click Update Module, or Cancel to add a new one.`
              : isCourseEditing
                ? "This course is in edit mode. You can update the course details above and manage its modules here on the same screen."
                : "Create or edit course modules with notes and resources. You can update or delete any module from the list below."}
          </p>
        </div>
        <div className="p-6">
        <form onSubmit={saveModule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={moduleForm.courseId}
            onChange={(e) =>
              setModuleForm((p) => ({
                ...p,
                courseId: e.target.value,
                id: p.courseId === e.target.value ? p.id : null,
              }))
            }
            className={adminInput}
            required
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            value={moduleForm.title}
            onChange={(e) => setModuleForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Module title"
            className={adminInput}
            required
          />
          <input
            type="number"
            value={moduleForm.moduleOrder}
            onChange={(e) => setModuleForm((p) => ({ ...p, moduleOrder: e.target.value }))}
            placeholder="Order"
            className={adminInput}
          />
          <div>
            <label className={adminFieldLabel}>Week (optional)</label>
            <input
              type="number"
              min={1}
              value={moduleForm.weekNum ?? ""}
              onChange={(e) => setModuleForm((p) => ({ ...p, weekNum: e.target.value === "" ? null : e.target.value }))}
              placeholder="e.g. 1 for Week 1"
              className={adminInput}
            />
          </div>
          <div>
            <label className={adminFieldLabel}>Session date (optional)</label>
            <input
              type="date"
              value={moduleForm.scheduledDate || ""}
              onChange={(e) => setModuleForm((p) => ({ ...p, scheduledDate: e.target.value }))}
              className={adminInput}
            />
          </div>
          <div>
            <label className={adminFieldLabel}>Session time (optional)</label>
            <input
              type="time"
              value={moduleForm.scheduledTime || ""}
              onChange={(e) => setModuleForm((p) => ({ ...p, scheduledTime: e.target.value }))}
              className={adminInput}
            />
          </div>
          <input
            type="number"
            value={moduleForm.durationMinutes}
            onChange={(e) => setModuleForm((p) => ({ ...p, durationMinutes: e.target.value }))}
            placeholder="Duration (minutes)"
            className={adminInput}
          />
          <div className="md:col-span-2 space-y-2">
            <p className={adminFieldLabel}>Course note PDF or resource URL</p>
            <div className="flex flex-wrap gap-2 items-center">
              <label className={`inline-flex items-center gap-2 px-4 py-2.5 ${adminBtnSoft} text-sm cursor-pointer`}>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={uploadModuleResourcePdf}
                  disabled={resourcePdfUploading}
                  className="sr-only"
                />
                {resourcePdfUploading ? "Uploading…" : "Upload PDF"}
              </label>
              <span className={`text-xs ${adminSectionDesc} mt-0`}>or paste URL below. PDFs show in the learner viewer.</span>
            </div>
            <input
              value={moduleForm.resourceUrl}
              onChange={(e) => setModuleForm((p) => ({ ...p, resourceUrl: e.target.value }))}
              placeholder="Resource URL (e.g. /uploads/files/xxx.pdf or full URL)"
              className={adminInput}
            />
          </div>
          <input
            value={moduleForm.slideUrl}
            onChange={(e) => setModuleForm((p) => ({ ...p, slideUrl: e.target.value }))}
            placeholder="Slide PDF URL (optional)"
            className={adminInput}
          />
          <input
            value={moduleForm.videoUrl}
            onChange={(e) => setModuleForm((p) => ({ ...p, videoUrl: e.target.value }))}
            placeholder="Video URL (optional)"
            className={adminInput}
          />
          <div className="md:col-span-2">
            <label className={adminFieldLabel}>Module notes (rich content)</label>
            <div className="rounded-xl overflow-hidden border border-Primarycolor/20 bg-white [&_.ql-container]:min-h-[220px] [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-gray-800 [&_.ql-toolbar]:bg-gray-100 [&_.ql-toolbar]:border-Primarycolor/20 [&_.ql-container]:border-Primarycolor/20">
              <ReactQuill
                theme="snow"
                value={moduleForm.moduleContent}
                onChange={(value) => setModuleForm((p) => ({ ...p, moduleContent: value }))}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Write detailed module content, notes, and learning objectives. Use headings, lists, and formatting for better structure."
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={adminFieldLabel}>Reference links (one per line)</label>
            <textarea
              value={moduleForm.referenceLinksText}
              onChange={(e) => setModuleForm((p) => ({ ...p, referenceLinksText: e.target.value }))}
              placeholder={"https://example.com/doc-1\nhttps://example.com/doc-2"}
              rows={3}
              className={adminTextarea}
            />
          </div>
          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input
              type="checkbox"
              checked={moduleForm.isPreview}
              onChange={(e) => setModuleForm((p) => ({ ...p, isPreview: e.target.checked }))}
            />
            Preview module
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className={adminBtnPrimary}
            >
              {moduleForm.id ? "Update Module" : "Add Module"}
            </button>
            {moduleForm.id && (
              <button
                type="button"
                onClick={() => setModuleForm(defaultModule)}
                className={adminBtnSoft}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <div className="brand-card mt-6 p-5">
          <h4 className="text-lg font-semibold text-slate-900">Module library</h4>
          <p className={adminSectionDesc}>
            Select a course to list its modules. You can update or delete any module—click Edit to change it or Delete to remove it (with confirmation).
          </p>
          {!selectedModuleCourseId && <p className="text-sm text-gray-400">Select a course to manage modules.</p>}
          {!!selectedModuleCourseId && !courseModules.length && (
            <p className="text-sm text-gray-400">No modules found for this course yet.</p>
          )}
          {!!selectedModuleCourseId && !!courseModules.length && (
            <div className="space-y-3">
              {courseModules.map((module) => (
                <article key={module.id} className="brand-card rounded-lg p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {module.module_order}. {module.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {module.week_num != null ? `Week ${module.week_num} • ` : ""}
                        {module.scheduled_date
                          ? `Scheduled ${String(module.scheduled_date).slice(0, 10)}${module.scheduled_time ? ` at ${String(module.scheduled_time).slice(0, 5)}` : ""} • `
                          : ""}
                        {module.duration_minutes} mins
                        {module.slide_url ? " • Slide" : ""}
                        {module.video_url ? " • Video" : ""}
                        {module.resource_url ? " • Resource" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editModule(module)}
                        className={`${adminBtnSoft} text-sm`}
                        title="Update this module"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteModule(module)}
                        className="px-3 py-2 rounded-md border border-red-400/50 text-red-300 text-sm font-medium hover:bg-red-500/20 transition-colors"
                        title="Delete this module (progress for this module will be removed)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        </div>
      </section>
      )}

      {activeLmsView === "lms-quiz" && (
      <section id="lms-quiz" className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>Module quiz</h3>
          <p className={adminSectionDesc}>
            Attach a multiple-choice quiz to any module. Import many questions at once from CSV, or add them manually below.
          </p>
        </div>
        <div className="p-6">
          <div className="brand-card p-5 mb-6 space-y-4 border border-Primarycolor/20">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Bulk import from CSV</h4>
              <p className={`text-xs ${adminSectionDesc} mt-1`}>
                Use columns: <code className="text-Secondarycolor">question, option_a, option_b, option_c, option_d, correct</code>.
                Set <strong>correct</strong> to A/B/C/D, 1/2/3/4, or the exact correct answer text. Empty option columns are ignored.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadQuizCsvTemplate}
                className={`${adminBtnSoft} text-sm`}
              >
                Download template
              </button>
              <label className={`inline-flex items-center px-4 py-2 ${adminBtnPrimary} text-sm cursor-pointer`}>
                <input
                  ref={quizCsvInputRef}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleQuizCsvFile}
                  className="sr-only"
                />
                Upload CSV file
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Or paste CSV here</label>
              <textarea
                value={quizCsvPaste}
                onChange={(e) => setQuizCsvPaste(e.target.value)}
                rows={5}
                placeholder={`question,option_a,option_b,option_c,option_d,correct\n"What is HTML?",Structuring content,Styling pages,Database tool,Email client,A`}
                className={`w-full ${adminTextarea} text-sm font-mono`}
              />
              <button
                type="button"
                onClick={handleQuizCsvPasteImport}
                className={`${adminBtnSoft} text-sm mt-2`}
              >
                Import pasted CSV
              </button>
            </div>
          </div>

          <form onSubmit={saveQuiz} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={quizForm.courseId}
                onChange={(e) =>
                  setQuizForm((prev) => ({
                    ...defaultQuizForm,
                    courseId: e.target.value,
                  }))
                }
                className={adminInput}
                required
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <select
                value={quizForm.moduleId}
                onChange={(e) =>
                  setQuizForm((prev) => ({
                    ...prev,
                    moduleId: e.target.value,
                    questions: prev.moduleId === e.target.value ? prev.questions : [makeQuizQuestion()],
                  }))
                }
                className={adminInput}
                required
                disabled={!quizForm.courseId}
              >
                <option value="">Select module</option>
                {quizModules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.module_order}. {m.title}
                  </option>
                ))}
              </select>
              <input
                value={quizForm.title}
                onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Quiz title"
                className={`p-3 ${adminInput} md:col-span-2`}
              />
            </div>

            {quizForm.courseId && quizForm.moduleId && (
              <p className={`text-sm ${adminSectionDesc} rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3`}>
                Learners will see this quiz on the <strong className="text-slate-800">Careers dashboard → Course Modules</strong> tab,
                when they open{" "}
                <strong className="text-slate-800">
                  {quizModules.find((m) => String(m.id) === String(quizForm.moduleId))?.title || "the selected module"}
                </strong>
                . Scroll to the bottom of that module to take it.
              </p>
            )}

            {quizLoading && <p className="text-sm text-gray-400">Loading quiz…</p>}

            {!quizLoading && quizForm.questions.length > 0 && (
              <p className={adminSectionDesc}>
                {quizForm.questions.length} question{quizForm.questions.length === 1 ? "" : "s"} ready — edit below if needed, then save.
              </p>
            )}

            {!quizLoading &&
              quizForm.questions.map((question, qIndex) => (
                <article key={question.key} className="brand-card p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <label className={`block text-sm font-semibold text-slate-900 flex-1`}>
                      Question {qIndex + 1}
                      <input
                        value={question.questionText}
                        onChange={(e) => updateQuizQuestion(question.key, { questionText: e.target.value })}
                        placeholder="Enter the question"
                        className={`mt-2 w-full ${adminInput} font-normal`}
                        required
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeQuizQuestion(question.key)}
                      className="text-sm text-red-400 hover:text-red-300 shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Answer options</p>
                    {question.options.map((option, oIndex) => (
                      <div key={option.key} className="flex flex-wrap items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.key}`}
                          checked={option.isCorrect}
                          onChange={() => setCorrectQuizOption(question.key, option.key)}
                          title="Mark as correct answer"
                        />
                        <input
                          value={option.optionText}
                          onChange={(e) => updateQuizOption(question.key, option.key, { optionText: e.target.value })}
                          placeholder={`Option ${oIndex + 1}`}
                          className={`flex-1 min-w-[200px] ${adminInput}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeQuizOption(question.key, option.key)}
                          className="text-xs text-gray-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addQuizOption(question.key)}
                      className="text-sm text-Secondarycolor hover:underline"
                    >
                      + Add option
                    </button>
                  </div>
                </article>
              ))}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addQuizQuestion}
                className={`${adminBtnSoft} text-sm`}
              >
                + Add question
              </button>
              <button
                type="submit"
                disabled={quizSaving || !quizForm.courseId || !quizForm.moduleId}
                className={`${adminBtnPrimary} disabled:opacity-50`}
              >
                {quizSaving ? "Saving…" : "Save quiz"}
              </button>
              <button
                type="button"
                onClick={deleteQuiz}
                disabled={!quizForm.courseId || !quizForm.moduleId}
                className="px-4 py-2.5 rounded-md border border-red-400/50 text-red-300 text-sm disabled:opacity-50"
              >
                Delete quiz
              </button>
            </div>
          </form>
        </div>
      </section>
      )}

      {activeLmsView === "lms-certificate" && (
      <section id="lms-certificate" className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>Certificate design & defaults</h3>
          <p className={adminSectionDesc}>
            Certificates use the layout below on screen, in issued HTML, and in emails. Upload your logo, optional seal, and optional PNG signature; learners see a QR code that opens the public verify page when your site URL is configured on the API.
          </p>
        </div>
        <div className={`${adminCardBody} space-y-6`}>
          <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
            <div className="brand-card p-4 md:p-5 bg-white/5">
              <CertificatePreview
                recipientName="Precious Abdul"
                courseName="Freelancing and Client Acquisition"
                date="2026-04-09"
                certificateCode="LGT-CERT-2"
                signatureLabel={certificateSettings.defaultSignatureLabel || "Authorized Signatory"}
                bodyMessage={
                  certificateSettings.defaultMessage ||
                  "This professional has demonstrated initiative and a commitment to deepening their skills and advancing their career."
                }
                logoUrl={certificateLogoUrl}
                sealUrl={certificateSealUrl}
                signatureImageUrl={certificateSignatureUrl}
              />
            </div>
            <div className="brand-card p-5">
              <p className={`${adminFieldLabel} mb-2`}>Certificate assets</p>
              <p className="text-sm text-gray-400 mb-4">
                Logo, seal, and signature files are served from the API <code className="text-xs text-slate-500">/uploads/</code> and appear on every issued certificate and HTML download.
              </p>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor/10 text-sm transition-colors cursor-pointer w-fit">
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadCertificateLogo} />
                  {certificateLogoUploading ? "Uploading..." : "Upload certificate logo"}
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor/10 text-sm transition-colors cursor-pointer w-fit">
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadCertificateSeal} />
                  {certificateSealUploading ? "Uploading..." : "Upload seal image"}
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor/10 text-sm transition-colors cursor-pointer w-fit">
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadCertificateSignature} />
                  {certificateSignatureUploading ? "Uploading..." : "Upload signature (PNG)"}
                </label>
              </div>
              <p className={`text-xs ${adminSectionDesc} mt-3`}>
                Use a transparent PNG for the signature. Batch issuing is under Enrollments — select rows then &quot;Batch generate&quot;.
              </p>
            </div>
          </div>

          <div className="border-t border-Primarycolor/20 pt-6">
            <p className={`${adminFieldLabel} mb-3`}>Default certificate text</p>
            <p className={`text-xs ${adminSectionDesc} mb-3`}>These pre-fill when you issue a certificate; you can still edit per certificate.</p>
            <form onSubmit={saveCertificateSettings} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Default message on certificate</label>
                <textarea
                  value={certificateSettings.defaultMessage}
                  onChange={(e) => setCertificateSettings((p) => ({ ...p, defaultMessage: e.target.value }))}
                  placeholder="e.g. has successfully completed the programme. Completion and payment verified."
                  rows={3}
                  className={`w-full ${adminTextarea} text-sm border border-slate-200`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Default signature label</label>
                <input
                  type="text"
                  value={certificateSettings.defaultSignatureLabel}
                  onChange={(e) => setCertificateSettings((p) => ({ ...p, defaultSignatureLabel: e.target.value }))}
                  placeholder="Authorized Signatory"
                  className={`w-full ${adminInput} text-sm border border-slate-200`}
                />
              </div>
              <button
                type="submit"
                disabled={certSettingsSaving}
                className="px-4 py-2 rounded-lg bg-Primarycolor text-white text-sm font-medium hover:bg-Primarycolor/90 disabled:opacity-50"
              >
                {certSettingsSaving ? "Saving…" : "Save defaults"}
              </button>
            </form>
          </div>
        </div>
      </section>
      )}

      {activeLmsView === "lms-enrollments" && (
      <section id="lms-enrollments" className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>Enrollments & certificates</h3>
          <p className={adminSectionDesc}>
            View enrollments, issue certificates (emailed as PDF), preview issued HTML, or remove an enrollment to wipe its progress and certificate for that course.
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Filter by course:</label>
              <select
                value={enrollmentCourseFilter}
                onChange={(e) => setEnrollmentCourseFilter(e.target.value)}
                className="p-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm min-w-[200px] shadow-sm"
              >
                <option value="">All courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={loadEnrollments}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 text-sm font-medium shadow-sm hover:bg-slate-50"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={toggleSelectAllEnrollments}
                className="px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!enrollments.filter((item) => !item.certificateSentAt).length}
              >
                {enrollments.filter((item) => !item.certificateSentAt).every((item) => selectedEnrollmentIds.includes(item.enrollmentId)) &&
                selectedEnrollmentIds.length
                  ? "Clear selection"
                  : "Select all eligible"}
              </button>
            </div>
            <button
              type="button"
              onClick={openBatchIssueModal}
              disabled={!selectedEnrollmentIds.length || !!issuingId}
              className="w-full px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold shadow-md hover:bg-violet-700 sm:w-auto sm:ml-auto disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {issuingId === "batch" ? "Generating batch..." : `Batch generate (${selectedEnrollmentIds.length})`}
            </button>
          </div>
          {enrollmentsLoading && <OrderListSkeleton rows={5} />}
          {!enrollmentsLoading && enrollments.length === 0 && (
            <p className="text-gray-400 text-sm">No enrollments found.</p>
          )}
          {!enrollmentsLoading && enrollments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-700">
                    <th className="py-3 pr-4 font-semibold">Select</th>
                    <th className="py-3 pr-4 font-semibold">Learner</th>
                    <th className="py-3 pr-4 font-semibold">Course</th>
                    <th className="py-3 pr-4 font-semibold">Progress</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Certificate</th>
                    <th className="py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((en) => (
                    <tr key={en.enrollmentId} className="border-b border-slate-100 text-slate-800 hover:bg-violet-50/40">
                      <td className="py-2 pr-4">
                        <input
                          type="checkbox"
                          checked={selectedEnrollmentIds.includes(en.enrollmentId)}
                          disabled={!!en.certificateSentAt}
                          onChange={() => toggleEnrollmentSelection(en.enrollmentId)}
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <span className="font-medium">{en.learnerName}</span>
                        <span className={`block text-xs ${adminSectionDesc} mt-0`}>{en.learnerEmail}</span>
                      </td>
                      <td className="py-2 pr-4">{en.courseTitle}</td>
                      <td className="py-2 pr-4">{en.progressPercent}%</td>
                      <td className="py-2 pr-4 capitalize">{en.status}</td>
                      <td className="py-2 pr-4">
                        {en.certificateSentAt
                          ? <span className="text-xs font-semibold text-emerald-700">Issued</span>
                          : <span className="text-slate-400 text-xs">—</span>}
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => previewCertificate(en.enrollmentId)}
                            disabled={!en.certificateSentAt}
                            title={
                              en.certificateSentAt
                                ? "Open issued certificate in a new tab"
                                : "Issue a certificate first; then preview becomes available here."
                            }
                            className="px-3 py-1.5 rounded-md border-2 border-violet-600 bg-violet-50 text-violet-800 text-xs font-semibold hover:bg-violet-100 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500"
                          >
                            Preview
                          </button>
                          {!en.certificateSentAt && (
                            <button
                              type="button"
                              onClick={() => openIssueModal(en)}
                              disabled={issuingId === en.enrollmentId}
                              className="px-3 py-1.5 rounded-md bg-violet-600 text-white text-xs font-semibold shadow-sm hover:bg-violet-700 disabled:opacity-50"
                            >
                              Issue certificate
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => requestDeleteEnrollment(en)}
                            disabled={deletingEnrollmentId === en.enrollmentId || !!issuingId}
                            title="Delete this enrollment and all its progress / certificate data for this course"
                            className="px-3 py-1.5 rounded-md border border-red-300 bg-red-50 text-red-800 text-xs font-semibold hover:bg-red-100 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      )}

      {activeLmsView === "lms-courses-list" && (
      <section id="lms-courses-list" className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>Courses</h3>
          <p className={adminSectionDesc}>All LMS courses and their modules.</p>
        </div>
        <div className="p-6">
        {loading && <LmsCourseListSkeleton count={4} />}
        {!loading && (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="brand-card p-5 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-slate-900 font-semibold">{course.title}</p>
                    <p className="text-sm text-gray-400">{course.summary}</p>
                    <p className={`text-xs ${adminSectionDesc} mt-1`}>
                      {course.level} • {course.durationWeeks} weeks
                      {course.scheduleStartDate ? ` • Starts ${course.scheduleStartDate}` : ""}
                      {" • "}
                      Modules: {course.modulesCount} • Enrollments:{" "}
                      {course.enrollmentsCount}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCourseForm({
                          id: course.id,
                          title: course.title || "",
                          summary: course.summary || "",
                          description: course.description || "",
                          level: course.level || "beginner",
                          durationWeeks: course.durationWeeks || 4,
                          imageUrl: course.imageUrl || "",
                          brochureUrl: course.brochureUrl || "",
                          isFeatured: Boolean(course.isFeatured),
                          isPublished: Boolean(course.isPublished),
                          issueCertificateOnCompletion: course.issueCertificateOnCompletion !== false,
                          scheduleStartDate: course.scheduleStartDate || "",
                        });
                        setModuleForm({
                          ...defaultModule,
                          courseId: String(course.id),
                        });
                        setActiveLmsView("lms-create-course");
                        setTimeout(() => {
                          document.getElementById("lms-create-course")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 0);
                      }}
                      className={`${adminBtnSoft} text-sm`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCourse(course.id)}
                      className="px-4 py-2 rounded-md border border-red-400/50 text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!courses.length && <p className="text-gray-400">No LMS courses yet.</p>}
          </div>
        )}
        </div>
      </section>
      )}

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
          onClick={() => {
            if (!deletingEnrollmentId) setDeleteConfirm(null);
          }}
        >
          <div
            className="brand-card w-full max-w-md rounded-xl p-6 shadow-2xl border border-slate-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Remove this enrollment?</h4>
            <p className="text-sm font-medium text-slate-800 mb-3">
              {deleteConfirm.learnerName || "Learner"} <span className="text-slate-400">—</span>{" "}
              {deleteConfirm.courseTitle || "Course"}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              All module progress and any certificate data for this enrollment will be permanently deleted. The user
              account is not deleted — they can enroll again later.
            </p>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={!!deletingEnrollmentId}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteEnrollment}
                disabled={!!deletingEnrollmentId}
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {deletingEnrollmentId ? "Removing…" : "Yes, remove enrollment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {issueCertEnrollment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => {
            if (!issuingId) {
              setIssueCertEnrollment(null);
              setIssueCertBatchMode(false);
            }
          }}
        >
          <div className="brand-card rounded-xl max-w-6xl w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              {issueCertBatchMode ? "Batch certificate generation" : "Issue certificate"}
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              {issueCertBatchMode
                ? `Generate certificates for ${selectedEnrollmentIds.length} selected enrollments using the shared date, message, and signature below.`
                : <>Acknowledge completion and payment for <strong>{issueCertEnrollment.learnerName}</strong> ({issueCertEnrollment.courseTitle}). The learner can download the certificate only after you issue it.</>}
            </p>
            <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-6 items-start">
              <div className="space-y-3">
                {!issueCertBatchMode && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Recipient full name</label>
                    <input
                      type="text"
                      value={issueCertForm.recipientFullName}
                      onChange={(e) => setIssueCertForm((p) => ({ ...p, recipientFullName: e.target.value }))}
                      placeholder="Name as on certificate"
                      className={`w-full ${adminInput} text-sm`}
                    />
                  </div>
                )}
                {issueCertBatchMode && (
                  <div className="brand-card p-3">
                    <p className={`text-xs ${adminDetailLabel} mb-1`}>Recipients</p>
                    <p className="text-sm text-slate-800">{selectedEnrollmentIds.length} selected enrollments</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message on certificate (optional)</label>
                  <textarea
                    value={issueCertForm.bodyMessage}
                    onChange={(e) => setIssueCertForm((p) => ({ ...p, bodyMessage: e.target.value }))}
                    placeholder="e.g. has successfully completed the programme. Completion and payment verified."
                    rows={3}
                    className={`w-full ${adminTextarea} text-sm`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={issueCertForm.signedDate}
                      onChange={(e) => setIssueCertForm((p) => ({ ...p, signedDate: e.target.value }))}
                      className={`w-full ${adminInput} text-sm`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Signature label</label>
                    <input
                      type="text"
                      value={issueCertForm.signatureLabel}
                      onChange={(e) => setIssueCertForm((p) => ({ ...p, signatureLabel: e.target.value }))}
                      placeholder="Authorized Signatory"
                      className={`w-full ${adminInput} text-sm`}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setIssueCertEnrollment(null);
                      setIssueCertBatchMode(false);
                    }}
                    disabled={!!issuingId}
                    className={`flex-1 py-2.5 ${adminBtnSoft} text-sm`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={downloadCertificatePreviewPdf}
                    className={`flex-1 py-2.5 ${adminBtnSoft} text-sm`}
                  >
                    Print-ready A4 PDF
                  </button>
                  <button
                    type="button"
                    onClick={issueCertificate}
                    disabled={!!issuingId}
                    className={`flex-1 py-2.5 ${adminBtnPrimary} text-sm disabled:opacity-50`}
                  >
                    {issuingId ? "Generating..." : issueCertBatchMode ? "Generate batch" : "Issue certificate"}
                  </button>
                </div>
              </div>

              <div className="brand-card p-4 bg-white/5">
                <CertificatePreview
                  ref={certificatePreviewRef}
                  logoUrl={certificateLogoUrl}
                  sealUrl={certificateSealUrl}
                  signatureImageUrl={certificateSignatureUrl}
                  recipientName={
                    issueCertBatchMode
                      ? `${selectedEnrollmentIds.length} Learners`
                      : issueCertForm.recipientFullName || issueCertEnrollment.learnerName
                  }
                  courseName={issueCertBatchMode ? "Lasglowtech Programmes" : issueCertEnrollment.courseTitle}
                  date={issueCertForm.signedDate}
                  certificateCode={issueCertBatchMode ? `LGT-BATCH-${selectedEnrollmentIds.length}` : `LGT-CERT-${issueCertEnrollment.enrollmentId || "PREVIEW"}`}
                  signatureLabel={issueCertForm.signatureLabel || "Authorized Signatory"}
                  bodyMessage={
                    issueCertForm.bodyMessage ||
                    "This professional has demonstrated initiative and a commitment to deepening their skills and advancing their career."
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default LmsAdmin;
