import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../config/axios.config";
import { FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";
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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Design",
    "Web & Mobile Development",
    "Latest Tech Trends",
    "Branding & Marketing",
    "Business & Startups",
    "Case Studies",
    "Company News"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("/blog/admin/all");
        setPosts(res.data || []);
        setFilteredPosts(res.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (statusFilter !== "All") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await instance.delete(`/blog/${id}`);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Blog deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed.");
    }
  };

  const togglePublishStatus = async (post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    
    try {
      await instance.put(`/blog/${post.id}`, {
        ...post,
        status: newStatus
      });
      
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, status: newStatus } : p
        )
      );
      
      toast.success(`Post ${newStatus === "published" ? "published" : "unpublished"} successfully.`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status.");
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

  const getStatusBadge = (status) => {
    return status === "published" 
      ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
      : "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
  };

  return (
    <section className="brand-card overflow-hidden">
      <div className={adminSectionHead}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={adminSectionTitle}>Blog Management</h1>
            <p className={adminSectionDesc}>Manage blog content and keep articles fresh.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/createblog")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus /> New Post
          </button>
        </div>
      </div>

      <div className={adminCardBody}>
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading posts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((blog) => (
              <article key={blog.id} className={`${adminNestedCard} p-5 bg-white`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    {blog.thumbnail || blog.thumbnailUrl ? (
                      <img
                        src={blog.thumbnailUrl || blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{blog.title}</h3>
                      <span className={getStatusBadge(blog.status)}>
                        {blog.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {blog.excerpt || stripHtml(blog.content)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>{formatDate(blog.created_at)}</span>
                      <span>•</span>
                      <span>{blog.view_count || 0} views</span>
                      <span>•</span>
                      <span>{blog.likes_count || 0} likes</span>
                      <span>•</span>
                      <span>{blog.comments_count || 0} comments</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      title="Preview"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublishStatus(blog)}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        blog.status === 'published' 
                          ? 'bg-orange-100 hover:bg-orange-200 text-orange-700' 
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                      title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/updateblog", {
                          state: {
                            postid: blog.id,
                            title: blog.title,
                            content: blog.content,
                            excerpt: blog.excerpt,
                            category: blog.category,
                            status: blog.status,
                            thumbnail: blog.thumbnailUrl || blog.thumbnail,
                            author_name: blog.author_name,
                            author_avatar: blog.author_avatar,
                          },
                        })
                      }
                      className={adminBtnSoft}
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBlog(blog.id)}
                      className={adminBtnDanger}
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!filteredPosts.length && !loading && (
              <div className={adminEmptyState}>
                <p className={adminEmptyText}>No blog posts found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
