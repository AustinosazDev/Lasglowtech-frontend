import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../config/axios.config";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  adminBtnDanger,
  adminBtnSoft,
  adminCardBody,
  adminEmptyState,
  adminEmptyText,
  adminNestedCard,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
} from "../../utils/adminUi";

const stripHtml = (html = "") => (html || "").replace(/<[^>]+>/g, "").trim();

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("/posts");
        setPosts(res.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const deleteBlog = async (id) => {
    try {
      await instance.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Blog deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="brand-card overflow-hidden">
      <div className={adminSectionHead}>
        <h1 className={adminSectionTitle}>Blog list</h1>
        <p className={adminSectionDesc}>Manage blog content and keep articles fresh.</p>
      </div>

      <div className={adminCardBody}>
        <div className="space-y-4">
          {posts.map((blog) => (
            <article key={blog.id} className={`${adminNestedCard} p-5 bg-white`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-lg">{blog.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">{stripHtml(blog.content)}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(blog.timestamp)}</p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/dashboard/updateblog", {
                        state: {
                          postid: blog.id,
                          title: blog.title,
                          content: blog.content,
                          shares: blog.shares,
                          cover: blog.coverUrl || blog.cover,
                        },
                      })
                    }
                    className={adminBtnSoft}
                    title="Edit"
                  >
                    <FaEdit className="w-4 h-4" /> Edit
                  </button>
                  <button type="button" onClick={() => deleteBlog(blog.id)} className={adminBtnDanger} title="Delete">
                    <FaTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!posts.length && (
            <div className={adminEmptyState}>
              <p className={adminEmptyText}>No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogList;
