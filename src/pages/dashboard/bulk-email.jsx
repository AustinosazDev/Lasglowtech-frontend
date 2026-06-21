import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminCardBody,
  adminFieldLabel,
  adminInput,
  adminNestedCard,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
  adminTextarea,
} from "../../utils/adminUi";

const BulkEmailAdmin = () => {
  const headers = useMemo(() => ({ Authorization: `Bearer ${getAdminToken()}` }), []);
  const [form, setForm] = useState({
    subject: "",
    message: "",
    emails: "",
    includeSubscribers: false,
  });
  const [csvFile, setCsvFile] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const loadCampaigns = async () => {
    try {
      const res = await instance.get("/admin/bulk-email/campaigns", { headers });
      setCampaigns(res.data || []);
    } catch (error) {
      setCampaigns([]);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const sendManual = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const hasAttachments = attachments.length > 0;
      const endpoint = hasAttachments ? "/admin/bulk-email/send-with-files" : "/admin/bulk-email/send";
      const payload = hasAttachments ? new FormData() : form;

      if (hasAttachments) {
        payload.append("subject", form.subject);
        payload.append("message", form.message);
        payload.append("emails", form.emails);
        payload.append("includeSubscribers", String(form.includeSubscribers));
        attachments.forEach((file) => payload.append("attachments", file));
      }

      const res = await instance.post(endpoint, payload, {
        headers: hasAttachments ? { ...headers, "Content-Type": "multipart/form-data" } : headers,
      });
      toast.success(
        `Campaign sent. Sent: ${res.data.totalSent}, Failed: ${res.data.totalFailed}`
      );
      setForm((prev) => ({ ...prev, emails: "" }));
      setAttachments([]);
      loadCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || "Bulk send failed.");
    } finally {
      setSending(false);
    }
  };

  const sendCsv = async (e) => {
    e.preventDefault();
    if (!csvFile) return toast.error("Select a CSV file first.");
    setSending(true);
    try {
      const body = new FormData();
      body.append("subject", form.subject);
      body.append("message", form.message);
      body.append("file", csvFile);
      attachments.forEach((file) => body.append("attachments", file));
      const res = await instance.post("/admin/bulk-email/send-csv", body, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      toast.success(
        `CSV campaign sent. Sent: ${res.data.totalSent}, Failed: ${res.data.totalFailed}`
      );
      setCsvFile(null);
      setAttachments([]);
      loadCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || "CSV send failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h1 className={adminSectionTitle}>Bulk email campaigns</h1>
          <p className={adminSectionDesc}>Send updates to manual emails or CSV exported from Excel.</p>
        </div>
        <div className={adminCardBody}>
        <form onSubmit={sendManual} className="grid grid-cols-1 gap-4">
          <input
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            placeholder="Email subject"
            className={adminInput}
            required
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            placeholder="Campaign message"
            rows={6}
            className={adminTextarea}
            required
          />
          <textarea
            value={form.emails}
            onChange={(e) => setForm((p) => ({ ...p, emails: e.target.value }))}
            placeholder="Manual recipient emails (comma, space or newline separated)"
            rows={4}
            className={adminTextarea}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.includeSubscribers}
              onChange={(e) => setForm((p) => ({ ...p, includeSubscribers: e.target.checked }))}
              className="rounded border-slate-300 text-[#8700ff] focus:ring-[#8700ff]"
            />
            Include subscribers + users + career applicants
          </label>
          <div>
            <label className={adminFieldLabel}>Attachments (PDF, Word, image)</label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
              className="text-sm"
            />
            {!!attachments.length && (
              <p className="text-xs text-gray-400 mt-1">{attachments.length} attachment(s) selected.</p>
            )}
          </div>
          <div>
            <button type="submit" disabled={sending} className={adminBtnPrimary}>
              {sending ? "Sending..." : "Send manual campaign"}
            </button>
          </div>
        </form>
        </div>
      </section>

      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h2 className={adminSectionTitle}>Send from CSV (Excel export)</h2>
          <p className={adminSectionDesc}>Upload a .csv file with any column containing emails.</p>
        </div>
        <div className={adminCardBody}>
        <form onSubmit={sendCsv} className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <button
            type="submit"
            disabled={sending || !csvFile}
            className={adminBtnGhost}
          >
            {sending ? "Sending…" : "Send CSV campaign"}
          </button>
        </form>
        </div>
      </section>

      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>Recent campaigns</h3>
          <p className={adminSectionDesc}>History of sent bulk emails.</p>
        </div>
        <div className={adminCardBody}>
        {!campaigns.length && <p className="text-sm text-slate-500">No campaigns sent yet.</p>}
        {!!campaigns.length && (
          <div className="space-y-4">
            {campaigns.map((item) => (
              <article key={item.id} className={`${adminNestedCard} p-4 bg-white`}>
                <p className="font-semibold text-slate-900">{item.subject}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Recipients: {item.total_recipients} · Sent: {item.total_sent} · Failed: {item.total_failed}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleString()} · {item.created_by}
                </p>
              </article>
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export default BulkEmailAdmin;

