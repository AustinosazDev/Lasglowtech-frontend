import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaUser, FaSave, FaTrash } from "react-icons/fa";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminCardBody,
  adminDetailLabel,
  adminDetailValue,
  adminEmptyState,
  adminEmptyText,
  adminFieldLabel,
  adminInput,
  adminLink,
  adminNestedCard,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
  adminSelect,
  adminSideNav,
  adminSideNavBtn,
  adminSideNavSelect,
  adminSideNavTitle,
  adminStatusBadge,
  adminTextarea,
} from "../../utils/adminUi";
import { CareerApplicationCardSkeletonList } from "../../components/skeletons/CardSkeletons";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "waitlist", label: "Waitlist" },
  { value: "rejected", label: "Rejected" },
];

const paymentOptions = [
  { value: "unpaid", label: "Unpaid" },
  { value: "part_paid", label: "Part paid" },
  { value: "paid", label: "Paid" },
  { value: "waived", label: "Waived" },
];

const CareersAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState({});

  const headers = useMemo(() => ({ Authorization: `Bearer ${getAdminToken()}` }), []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/careers/admin", { headers });
      setApplications(res.data || []);
      const nextDrafts = {};
      (res.data || []).forEach((app) => {
        nextDrafts[app.id] = {
          status: app.status || "new",
          adminNotes: app.admin_notes || "",
          feeAmount: app.fee_amount || 0,
          paymentStatus: app.payment_status || "unpaid",
          followUpDate: app.follow_up_date ? String(app.follow_up_date).slice(0, 10) : "",
          cohort: app.cohort || "",
        };
      });
      setDrafts(nextDrafts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load career applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id) => {
    const payload = drafts[id] || {};
    try {
      await instance.put(`/careers/admin/${id}`, payload, { headers });
      toast.success("Application updated.");
      fetchApplications();
    } catch (error) {
      toast.error("Unable to update application.");
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await instance.delete(`/careers/admin/${id}`, { headers });
      toast.success("Application deleted.");
      fetchApplications();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const careerNav = [{ id: "career-applications", label: "Applications" }];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <aside className="lg:w-52 flex-shrink-0">
        <nav className={`hidden lg:block ${adminSideNav}`}>
          <p className={adminSideNavTitle}>Jump to</p>
          {careerNav.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className={adminSideNavBtn}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="lg:hidden mb-2">
          <select
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              if (v) scrollToSection(v);
              e.target.value = "";
            }}
            className={adminSideNavSelect}
            aria-label="Jump to section"
          >
            <option value="">Jump to section…</option>
            {careerNav.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <section id="career-applications" className="brand-card overflow-hidden scroll-mt-6">
          <div className={adminSectionHead}>
            <h2 className={adminSectionTitle}>Career applications</h2>
            <p className={adminSectionDesc}>Review candidates, update admission status, fees, and cohort assignments.</p>
          </div>

          <div className={adminCardBody}>
            {loading && <CareerApplicationCardSkeletonList count={3} />}

            {!loading && (
              <div className="space-y-6">
                {applications.map((app) => {
                  const status = drafts[app.id]?.status || app.status;
                  return (
                    <article key={app.id} className={adminNestedCard}>
                      <div className="p-5 md:p-6 border-b border-slate-200/80 bg-white">
                        <div className="flex flex-col md:flex-row gap-5">
                          <div className="flex-shrink-0">
                            {app.picture_url ? (
                              <img
                                src={app.picture_url}
                                alt={app.full_name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#8700ff]/20 shadow-sm"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-2xl border-2 border-[#8700ff]/15 bg-violet-50 flex items-center justify-center text-[#8700ff]">
                                <FaUser className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              <h3 className="text-lg font-semibold text-slate-900">{app.full_name}</h3>
                              <span className={adminStatusBadge[status] || adminStatusBadge.new}>{status}</span>
                              <span className="text-xs text-slate-400 ml-auto">
                                Applied {new Date(app.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                              <div>
                                <dt className={adminDetailLabel}>Email</dt>
                                <dd className={adminDetailValue}>
                                  <a href={`mailto:${app.email}`} className={adminLink}>
                                    {app.email}
                                  </a>
                                </dd>
                              </div>
                              <div>
                                <dt className={adminDetailLabel}>Phone</dt>
                                <dd className={adminDetailValue}>{app.phone || "—"}</dd>
                              </div>
                              <div>
                                <dt className={adminDetailLabel}>Skill track</dt>
                                <dd className={adminDetailValue}>{app.skill_interest || "—"}</dd>
                              </div>
                              <div>
                                <dt className={adminDetailLabel}>Experience</dt>
                                <dd className={adminDetailValue}>{app.experience_level || "N/A"}</dd>
                              </div>
                              <div>
                                <dt className={adminDetailLabel}>Availability</dt>
                                <dd className={adminDetailValue}>{app.availability || "N/A"}</dd>
                              </div>
                              <div>
                                <dt className={adminDetailLabel}>Location</dt>
                                <dd className={adminDetailValue}>
                                  {[app.city, app.country].filter(Boolean).join(", ") || "—"}
                                </dd>
                              </div>
                              {app.portfolio_url && (
                                <div className="sm:col-span-2">
                                  <dt className={adminDetailLabel}>Portfolio</dt>
                                  <dd className={adminDetailValue}>
                                    <a href={app.portfolio_url} target="_blank" rel="noreferrer" className={adminLink}>
                                      {app.portfolio_url}
                                    </a>
                                  </dd>
                                </div>
                              )}
                              <div className="sm:col-span-2">
                                <dt className={adminDetailLabel}>Learning goal</dt>
                                <dd className="text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-wrap">
                                  {app.learning_goal || "—"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 md:p-6 bg-slate-50/60 border-t border-slate-200/80">
                        <p className={adminDetailLabel}>Admin actions</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                          <div>
                            <label className={adminFieldLabel}>Status</label>
                            <select
                              value={drafts[app.id]?.status || "new"}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [app.id]: { ...prev[app.id], status: e.target.value },
                                }))
                              }
                              className={adminSelect}
                            >
                              {statusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={adminFieldLabel}>Payment status</label>
                            <select
                              value={drafts[app.id]?.paymentStatus || "unpaid"}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [app.id]: { ...prev[app.id], paymentStatus: e.target.value },
                                }))
                              }
                              className={adminSelect}
                            >
                              {paymentOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={adminFieldLabel}>Training fee (NGN)</label>
                            <input
                              type="number"
                              value={drafts[app.id]?.feeAmount ?? 0}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [app.id]: { ...prev[app.id], feeAmount: e.target.value },
                                }))
                              }
                              className={adminInput}
                              placeholder="0"
                              min={0}
                            />
                          </div>
                          <div>
                            <label className={adminFieldLabel}>Follow-up date</label>
                            <input
                              type="date"
                              value={drafts[app.id]?.followUpDate || ""}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [app.id]: { ...prev[app.id], followUpDate: e.target.value },
                                }))
                              }
                              className={adminInput}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={adminFieldLabel}>Cohort</label>
                            <input
                              type="text"
                              value={drafts[app.id]?.cohort || ""}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [app.id]: { ...prev[app.id], cohort: e.target.value },
                                }))
                              }
                              className={adminInput}
                              placeholder="e.g. Cohort 2026-01"
                            />
                          </div>
                          <div className="sm:col-span-2 lg:col-span-4">
                            <label className={adminFieldLabel}>Admin notes</label>
                            <textarea
                              value={drafts[app.id]?.adminNotes || ""}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [app.id]: { ...prev[app.id], adminNotes: e.target.value },
                                }))
                              }
                              rows={3}
                              className={adminTextarea}
                              placeholder="Internal notes about this application"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-200/80">
                          <button type="button" onClick={() => updateStatus(app.id)} className={adminBtnPrimary}>
                            <FaSave className="w-4 h-4" /> Save changes
                          </button>
                          <button type="button" onClick={() => deleteApplication(app.id)} className={adminBtnDanger}>
                            <FaTrash className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {!applications.length && (
                  <div className={adminEmptyState}>
                    <p className={adminEmptyText}>No career applications yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareersAdmin;
