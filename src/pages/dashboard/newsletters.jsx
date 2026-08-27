import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import RichTextEditor from "../../components/blog/RichTextEditor";
import { getAdminToken } from "../../utils/adminAuth";
import { adminBtnDanger, adminBtnGhost, adminBtnPrimary, adminCardBody, adminEmptyState, adminEmptyText, adminInput, adminSectionDesc, adminSectionHead, adminSectionTitle } from "../../utils/adminUi";

const config = () => ({ headers: { Authorization: `Bearer ${getAdminToken()}` } });
const emptyForm = { subject: "", content: "", recipientEmails: "" };

const NewsletterList = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("All");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const response = await instance.get("/admin/newsletters", { ...config(), params: { status } });
      setItems(response.data?.newsletters || []);
    } catch (error) { toast.error(error.response?.data?.message || "Could not load newsletters."); }
  };
  useEffect(() => { load(); }, [status]);

  const create = async () => {
    try {
      const response = await instance.post("/admin/newsletters", { subject: "Untitled newsletter", content: "<p>Start writing your newsletter...</p>" }, config());
      navigate(`/dashboard/newsletters/${response.data.id}`);
    } catch (error) { toast.error(error.response?.data?.message || "Could not create newsletter."); }
  };
  const duplicate = async (item) => {
    try {
      const response = await instance.post("/admin/newsletters", { subject: `Copy of ${item.subject}`, content: item.content, recipientEmails: item.recipient_emails || "" }, config());
      navigate(`/dashboard/newsletters/${response.data.id}`);
    } catch (error) { toast.error(error.response?.data?.message || "Could not duplicate newsletter."); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this draft?")) return;
    try { await instance.delete(`/admin/newsletters/${id}`, config()); setItems((list) => list.filter((item) => item.id !== id)); toast.success("Newsletter deleted."); }
    catch (error) { toast.error(error.response?.data?.message || "Could not delete newsletter."); }
  };

  return <section className="brand-card overflow-hidden"><div className={adminSectionHead}><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className={adminSectionTitle}>Newsletters</h1><p className={adminSectionDesc}>Create, schedule, and send updates to active subscribers.</p></div><button className={adminBtnPrimary} onClick={create}>New Newsletter</button></div></div><div className={`${adminCardBody} space-y-5`}><select className={`${adminInput} max-w-xs`} value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="sent">Sent</option><option value="failed">Failed</option></select>{items.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead><tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500"><th className="px-3 py-3">Subject</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Recipients</th><th className="px-3 py-3">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="px-3 py-4 font-semibold text-slate-800">{item.subject}</td><td className="px-3 py-4 capitalize text-slate-600">{item.status}</td><td className="px-3 py-4 text-slate-500">{new Date(item.sent_at || item.created_at).toLocaleDateString()}</td><td className="px-3 py-4 text-slate-600">{item.recipient_count || 0}</td><td className="px-3 py-4"><div className="flex flex-wrap gap-2">{item.status === "draft" && <Link className={adminBtnGhost} to={`/dashboard/newsletters/${item.id}`}>Edit</Link>}<button className={adminBtnGhost} onClick={() => duplicate(item)}>Duplicate</button>{item.status === "draft" && <button className={adminBtnDanger} onClick={() => remove(item.id)}>Delete</button>}</div></td></tr>)}</tbody></table></div> : <div className={adminEmptyState}><p className={adminEmptyText}>No newsletters found.</p></div>}</div></section>;
};

const NewsletterEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [newsletter, setNewsletter] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");
  const [attachments, setAttachments] = useState([]);

  const load = async () => {
    if (id === "new") return;
    try { const response = await instance.get(`/admin/newsletters/${id}`, config()); setNewsletter(response.data); setForm({ subject: response.data.subject, content: response.data.content, recipientEmails: response.data.recipient_emails || "" }); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load newsletter."); }
  };
  useEffect(() => { load(); }, [id]);

  const save = async (silent = false) => {
    if (!form.subject.trim() || !form.content.replace(/<[^>]+>/g, "").trim()) { if (!silent) toast.error("Subject and content are required."); return false; }
    setSaving(true);
    try {
      const response = id === "new" ? await instance.post("/admin/newsletters", form, config()) : await instance.put(`/admin/newsletters/${id}`, form, config());
      if (id === "new") navigate(`/dashboard/newsletters/${response.data.id}`, { replace: true });
      setNewsletter(response.data); if (!silent) toast.success("Draft saved."); return true;
    } catch (error) { if (!silent) toast.error(error.response?.data?.message || "Could not save draft."); return false; }
    finally { setSaving(false); }
  };
  useEffect(() => { const timer = setInterval(() => { if (id !== "new") save(true); }, 30000); return () => clearInterval(timer); }, [id, form.subject, form.content]);

  const makeAttachmentBody = (extra = {}) => { const body = new FormData(); Object.entries(extra).forEach(([key, value]) => body.append(key, value)); attachments.forEach((file) => body.append("attachments", file)); return body; };
  const sendTest = async () => { const email = window.prompt("Send a test copy to which email?"); if (!email || !(await save())) return; try { await instance.post(`/admin/newsletters/${id}/test`, makeAttachmentBody({ email }), { headers: { ...config().headers, "Content-Type": "multipart/form-data" } }); toast.success("Test email sent."); } catch (error) { toast.error(error.response?.data?.message || "Could not send test email."); } };
  const sendNow = async () => { if (!(await save())) return; if (!window.confirm("Sending is irreversible. Send this newsletter to all active subscribers now?")) return; setBusy(true); try { const response = await instance.post(`/admin/newsletters/${id}/send`, makeAttachmentBody(), { headers: { ...config().headers, "Content-Type": "multipart/form-data" } }); toast.success(`Newsletter sent to ${response.data.recipientCount} subscribers.`); setNewsletter((item) => ({ ...item, status: response.data.status })); } catch (error) { toast.error(error.response?.data?.message || "Could not send newsletter."); } finally { setBusy(false); } };
  const schedule = async () => { if (!scheduleAt || !(await save())) return; setBusy(true); try { const response = await instance.post(`/admin/newsletters/${id}/schedule`, { scheduledAt: scheduleAt }, config()); setNewsletter(response.data); toast.success("Newsletter scheduled."); } catch (error) { toast.error(error.response?.data?.message || "Could not schedule newsletter."); } finally { setBusy(false); } };

  const importCsv = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, recipientEmails: `${current.recipientEmails}${current.recipientEmails ? "\n" : ""}${reader.result}` }));
    reader.readAsText(file);
  };

  return <section className="brand-card overflow-hidden"><div className={adminSectionHead}><div className="flex flex-wrap items-center justify-between gap-3"><div><Link to="/dashboard/newsletters" className="text-sm font-medium text-[#8700ff] hover:underline">Back to newsletters</Link><h1 className={`${adminSectionTitle} mt-2`}>{id === "new" ? "New newsletter" : "Edit newsletter"}</h1><p className={adminSectionDesc}>Draft content, preview it, then send or schedule it.</p></div>{newsletter && <span className="capitalize rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-[#8700ff]">{newsletter.status}</span>}</div></div><div className={`${adminCardBody} space-y-5`}><input className={adminInput} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Newsletter subject" /><div><label className="mb-1 block text-sm font-semibold text-slate-700">Recipients</label><textarea className={`${adminInput} min-h-[110px] resize-y`} value={form.recipientEmails} onChange={(event) => setForm({ ...form, recipientEmails: event.target.value })} placeholder="Optional: add one or many emails, separated by commas, spaces, or new lines. Leave empty to send to all active subscribers." /><label className="mt-2 block text-xs font-medium text-slate-500">Import a CSV containing email addresses</label><input type="file" accept=".csv,text/csv" onChange={importCsv} className="mt-1 block text-sm text-slate-600" /></div><div><label className="mb-1 block text-sm font-semibold text-slate-700">Attachments</label><input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(event) => setAttachments(Array.from(event.target.files || []))} className="block text-sm text-slate-600" />{!!attachments.length && <p className="mt-1 text-xs text-slate-500">{attachments.length} file(s) will be attached to the test or immediate send.</p>}</div><RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} placeholder="Write your newsletter content here..." /><div className="flex flex-wrap items-end gap-3"><button className={adminBtnPrimary} disabled={saving || busy} onClick={() => save()}>{saving ? "Saving..." : "Save Draft"}</button><button className={adminBtnGhost} disabled={saving || busy || id === "new"} onClick={sendTest}>Send Test Email</button><div><label className="mb-1 block text-xs font-semibold text-slate-500">Schedule</label><input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} className={adminInput} /></div><button className={adminBtnGhost} disabled={saving || busy || id === "new"} onClick={schedule}>Schedule</button><button className={adminBtnDanger} disabled={saving || busy || id === "new"} onClick={sendNow}>{busy ? "Working..." : "Send Now"}</button></div></div></section>;
};

export default function Newsletters() { return useParams().id ? <NewsletterEditor /> : <NewsletterList />; }
