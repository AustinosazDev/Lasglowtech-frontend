import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import { adminBtnDanger, adminBtnPrimary, adminBtnSoft, adminCardBody, adminEmptyState, adminEmptyText, adminInput, adminSectionDesc, adminSectionHead, adminSectionTitle } from "../../utils/adminUi";

const adminConfig = () => ({
  headers: { Authorization: `Bearer ${getAdminToken()}` },
});

export default function BlogCommentsAdmin() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("All");

  const load = async () => {
    try {
      const response = await instance.get("/blog/comments/admin/all", {
        ...adminConfig(),
        params: { status },
      });
      setComments(response.data || []);
    } catch {
      toast.error("Could not load comments.");
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const moderate = async (id, nextStatus) => {
    try {
      await instance.put(`/blog/comments/${id}/moderate`, { status: nextStatus }, adminConfig());
      setComments((list) => list.map((comment) => comment.id === id ? { ...comment, status: nextStatus } : comment));
      toast.success(`Comment ${nextStatus}.`);
    } catch {
      toast.error("Could not update comment.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await instance.delete(`/blog/comments/${id}`, adminConfig());
      setComments((list) => list.filter((comment) => comment.id !== id));
      toast.success("Comment deleted.");
    } catch {
      toast.error("Could not delete comment.");
    }
  };

  return (
    <section className="brand-card overflow-hidden">
      <div className={adminSectionHead}>
        <h1 className={adminSectionTitle}>Comment moderation</h1>
        <p className={adminSectionDesc}>Approve only comments that are suitable for public display.</p>
      </div>
      <div className={`${adminCardBody} space-y-5`}>
        <select className={`${adminInput} max-w-xs`} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="space-y-3">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{comment.author_name} <span className="font-normal text-slate-500">· {comment.post_title}</span></p>
                  <p className="text-xs text-slate-500 mt-1">{comment.author_email} · {new Date(comment.created_at).toLocaleDateString()}</p>
                </div>
                <span className="capitalize text-xs font-medium px-2 py-1 rounded-full bg-slate-100 h-fit">{comment.status}</span>
              </div>
              <p className="mt-3 text-slate-700 whitespace-pre-wrap">{comment.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {comment.status !== "approved" && <button className={adminBtnPrimary} onClick={() => moderate(comment.id, "approved")}>Approve</button>}
                {comment.status !== "rejected" && <button className={adminBtnSoft} onClick={() => moderate(comment.id, "rejected")}>Reject</button>}
                <button className={adminBtnDanger} onClick={() => remove(comment.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
        {!comments.length && <div className={adminEmptyState}><p className={adminEmptyText}>No comments to moderate.</p></div>}
      </div>
    </section>
  );
}
