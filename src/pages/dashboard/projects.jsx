import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSoft,
  adminCardBody,
  adminEmptyState,
  adminEmptyText,
  adminFieldLabel,
  adminInput,
  adminMuted,
  adminNestedCard,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
  adminSelect,
  adminTextarea,
} from "../../utils/adminUi";
import { PROJECT_IMAGE_HINT } from "../../utils/projects";

const DEFAULT_CATEGORIES = ["Websites", "Branding", "Graphics", "Web/UI"];

const defaultForm = {
  id: null,
  title: "",
  description: "",
  category: "",
  imageUrl: "",
  externalLink: "",
  sortOrder: 0,
  isFeatured: false,
  isPublished: true,
  isCaseStudy: false,
  summary: "",
  challenge: "",
  solution: "",
  result: "",
  ctaLabel: "View project",
};

const ProjectsAdmin = () => {
  const [form, setForm] = useState(defaultForm);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);

  const authHeader = useMemo(() => {
    const token = getAdminToken();
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        instance.get("/projects/admin/all", { headers: authHeader }),
        instance.get("/projects/admin/categories", { headers: authHeader }),
      ]);
      setItems(projectsRes.data || []);
      setCategoryOptions(
        Array.isArray(categoriesRes.data) && categoriesRes.data.length
          ? categoriesRes.data
          : DEFAULT_CATEGORIES
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;
    const q = (searchQuery || "").toLowerCase().trim();
    if (q) {
      list = list.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter((item) => item.category === categoryFilter);
    }
    return list;
  }, [items, searchQuery, categoryFilter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = (form.imageUrl || "").trim();

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await instance.post("/upload/images", formData);
        const filename = uploadRes.data;
        imageUrl = `${instance.defaults.baseURL}/uploads/images/${filename}`;
      }

      const payload = { ...form, imageUrl };

      if (form.id) {
        await instance.put(`/projects/admin/${form.id}`, payload, { headers: authHeader });
        toast.success("Project updated.");
      } else {
        await instance.post("/projects/admin", payload, { headers: authHeader });
        toast.success("Project created.");
      }

      setForm(defaultForm);
      setImageFile(null);
      setImagePreview("");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to save project.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Websites",
      imageUrl: item.imageUrl || "",
      externalLink: item.externalLink || "",
      sortOrder: item.sortOrder || 0,
      isFeatured: Boolean(item.isFeatured),
      isPublished: Boolean(item.isPublished),
      isCaseStudy: Boolean(item.isCaseStudy),
      summary: item.summary || "",
      challenge: item.challenge || "",
      solution: item.solution || "",
      result: item.result || "",
      ctaLabel: item.ctaLabel || "View project",
    });
    setImageFile(null);
    setImagePreview(item.imageUrl || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await instance.delete(`/projects/admin/${id}`, { headers: authHeader });
      toast.success("Project deleted.");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to delete project.");
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h2 className={adminSectionTitle}>Projects manager</h2>
          <p className={adminSectionDesc}>
            Add and manage portfolio projects shown on the public Projects page.
          </p>
        </div>
        <div className={adminCardBody}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Project title"
              className={adminInput}
              required
            />
            <div>
              <p className={adminFieldLabel}>Category</p>
              <input
                name="category"
                list="project-category-options"
                value={form.category}
                onChange={handleChange}
                placeholder="Type a new category or pick one"
                className={adminInput}
                required
              />
              <datalist id="project-category-options">
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className={`text-xs ${adminMuted} mt-1`}>
                You can enter any category name — it will appear as a filter on the Projects page.
              </p>
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description"
              className={`${adminTextarea} md:col-span-2`}
              rows={3}
            />

            <input
              name="externalLink"
              value={form.externalLink}
              onChange={handleChange}
              placeholder="External link (https://...)"
              className={adminInput}
            />
            <input
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
              placeholder="Sort order"
              className={adminInput}
            />

            <div className="md:col-span-2">
              <p className={adminFieldLabel}>Project image</p>
              <p className={`text-xs ${adminMuted} mb-2`}>
                Recommended upload: {PROJECT_IMAGE_HINT}. You can also paste an external image URL.
              </p>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={(e) => {
                  handleChange(e);
                  if (!imageFile) setImagePreview(e.target.value);
                }}
                placeholder="Image URL (https://example.com/image.jpg)"
                className={`${adminInput} mb-3`}
              />
              <p className={`text-xs ${adminMuted} mb-2`}>Or upload a file (upload overrides the URL above)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImageFile(file || null);
                  setImagePreview(file ? URL.createObjectURL(file) : form.imageUrl || "");
                }}
                className="block w-full text-sm text-slate-600"
              />
              {(imagePreview || form.imageUrl) && (
                <img
                  src={imagePreview || form.imageUrl}
                  alt="Preview"
                  className="mt-3 h-32 w-32 rounded-lg border border-slate-200 object-cover aspect-square"
                />
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              Featured (highlighted on grid)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
              <input type="checkbox" name="isCaseStudy" checked={form.isCaseStudy} onChange={handleChange} />
              Show as case study (detailed section at bottom of Projects page)
            </label>

            {form.isCaseStudy && (
              <div className={`${adminNestedCard} md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                <p className={`${adminFieldLabel} md:col-span-2`}>Case study details</p>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Summary"
                  className={`${adminTextarea} md:col-span-2`}
                  rows={2}
                />
                <textarea
                  name="challenge"
                  value={form.challenge}
                  onChange={handleChange}
                  placeholder="Challenge"
                  className={adminTextarea}
                  rows={3}
                />
                <textarea
                  name="solution"
                  value={form.solution}
                  onChange={handleChange}
                  placeholder="Solution"
                  className={adminTextarea}
                  rows={3}
                />
                <textarea
                  name="result"
                  value={form.result}
                  onChange={handleChange}
                  placeholder="Result"
                  className={`${adminTextarea} md:col-span-2`}
                  rows={2}
                />
                <input
                  name="ctaLabel"
                  value={form.ctaLabel}
                  onChange={handleChange}
                  placeholder="Button label (e.g. View site)"
                  className={adminInput}
                />
              </div>
            )}

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button type="submit" className={adminBtnPrimary}>
                {form.id ? "Update project" : "Add project"}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className={adminBtnSoft}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>All projects</h3>
          <p className={adminSectionDesc}>{filteredItems.length} project(s)</p>
        </div>
        <div className={adminCardBody}>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description…"
              className={`${adminInput} md:flex-1`}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={adminSelect}
            >
              <option value="">All categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className={adminMuted}>Loading projects…</p>
          ) : filteredItems.length === 0 ? (
            <div className={adminEmptyState}>
              <p className={adminEmptyText}>No projects yet. Add one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <article key={item.id} className={`${adminNestedCard} overflow-hidden`}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#8700ff]/10 text-[#8700ff]">
                        {item.category}
                      </span>
                      {item.isCaseStudy && (
                        <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                          Case study
                        </span>
                      )}
                      {!item.isPublished && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">Draft</span>
                      )}
                      {item.isFeatured && (
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {item.description || item.summary || "—"}
                    </p>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                      <button type="button" onClick={() => handleEdit(item)} className={`flex-1 ${adminBtnSoft} text-sm`}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className={`py-2 px-4 ${adminBtnDanger} text-sm`}
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
      </section>
    </div>
  );
};

export default ProjectsAdmin;
