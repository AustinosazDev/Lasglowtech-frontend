import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import { adminBtnDanger, adminBtnPrimary, adminCardBody, adminEmptyState, adminEmptyText, adminInput, adminSectionDesc, adminSectionHead, adminSectionTitle } from "../../utils/adminUi";

const Subscriptions = () => {
  const [subscribers, setSubscribers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("subscribed");
    const [email, setEmail] = useState("");

    const load = async () => {
      try { const response = await instance.get("/admin/subscribers", { headers: { Authorization: `Bearer ${getAdminToken()}` }, params: { search, status } }); setSubscribers(response.data || []); }
      catch (error) { toast.error(error.response?.data?.message || "Could not load subscribers."); }
    };
    useEffect(() => { load(); }, [search, status]);

    const add = async (event) => {
      event.preventDefault();
      try { await instance.post("/admin/subscribers", { email }, { headers: { Authorization: `Bearer ${getAdminToken()}` } }); setEmail(""); toast.success("Subscriber added."); load(); }
      catch (error) { toast.error(error.response?.data?.message || "Could not add subscriber."); }
    };
    const remove = async (id) => {
      try { await instance.delete(`/admin/subscribers/${id}`, { headers: { Authorization: `Bearer ${getAdminToken()}` } }); setSubscribers((list) => list.filter((item) => item.id !== id)); toast.success("Subscriber unsubscribed."); }
      catch (error) { toast.error(error.response?.data?.message || "Could not update subscriber."); }
    };
    const exportCsv = () => {
      const csv = `email,status,subscribed_at\n${subscribers.map((item) => `${item.email},${item.active ? "subscribed" : "unsubscribed"},${item.subscribed_at}`).join("\n")}`;
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const link = document.createElement("a"); link.href = url; link.download = "lasglowtech-subscribers.csv"; link.click(); URL.revokeObjectURL(url);
    };

    return (
      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h1 className={adminSectionTitle}>Newsletter subscribers</h1>
          <p className={adminSectionDesc}>Manage the audience that receives your newsletters.</p>
        </div>
        <div className={`${adminCardBody} space-y-5`}>
          <form onSubmit={add} className="flex flex-wrap gap-3">
            <input className={`${adminInput} max-w-sm`} type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Add subscriber email" />
            <button className={adminBtnPrimary}>Add subscriber</button>
          </form>
          <div className="flex flex-wrap gap-3">
            <input className={`${adminInput} max-w-sm`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search email" />
            <select className={`${adminInput} max-w-xs`} value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="All">All</option>
            </select>
          </div>
          {subscribers.length ? (
            <div className="space-y-3">
              {subscribers.map((subscriber) => (
                <article key={subscriber.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{subscriber.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{subscriber.active ? "Subscribed" : "Unsubscribed"} · {new Date(subscriber.subscribed_at).toLocaleDateString()}</p>
                  </div>
                  {subscriber.active && <button className={adminBtnDanger} onClick={() => remove(subscriber.id)}>Unsubscribe</button>}
                </article>
              ))}
            </div>
          ) : (
            <div className={adminEmptyState}>
              <p className={adminEmptyText}>No subscribers found.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

export default Subscriptions;
