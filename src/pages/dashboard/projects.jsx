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

const FormField = ({ label, hint, children, className = "" }) => (
  <div className={className}>
    <label className={adminFieldLabel}>{label}</label>
    {hint ? <p className={`text-xs ${adminMuted} mb-2`}>{hint}</p> : null}
    {children}
  </div>
);

const ToggleOption = ({ name, checked, onChange, label, description }) => (
  <label
    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
      checked
        ? "border-[#8700ff]/40 bg-violet-50/80 ring-1 ring-[#8700ff]/20"
        : "border-slate-200 bg-white hover:border-slate-300"
    }`}
  >
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#8700ff] focus:ring-[#8700ff]/30"
    />
    <span className="min-w-0">
      <span className="block text-sm font-medium text-slate-800">{label}</span>
      {description ? <span className="block text-xs text-slate-500 mt-0.5">{description}</span> : null}
    </span>
  </label>
);

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
          {form.id ? (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-[#8700ff]">
              Editing project #{form.id}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic details */}
            <div className={`${adminNestedCard} p-5 md:p-6 space-y-5`}>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Project details</h3>
                <p className={`text-xs ${adminMuted} mt-1`}>Title, category, and short description shown on the grid.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Title" className="md:col-span-2">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. UR9 Group website"
                    className={adminInput}
                    required
                  />
                </FormField>
                <FormField
                  label="Category"
                  hint="Type a new name or pick a suggestion. New categories appear as filters on the Projects page."
                >
                  <input
                    name="category"
                    list="project-category-options"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Websites, Branding, Graphics…"
                    className={adminInput}
                    required
                  />
                  <datalist id="project-category-options">
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </FormField>
                <FormField label="Sort order" hint="Lower numbers appear first.">
                  <input
                    name="sortOrder"
                    type="number"
                    value={form.sortOrder}
                    onChange={handleChange}
                    placeholder="0"
                    className={adminInput}
                  />
                </FormField>
                <FormField label="Description" className="md:col-span-2">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief summary of the project"
                    className={adminTextarea}
                    rows={3}
                  />
                </FormField>
              </div>
            </div>

            {/* Link */}
            <div className={`${adminNestedCard} p-5 md:p-6`}>
              <FormField label="Project link" hint="Opens when visitors click View project.">
                <input
                  name="externalLink"
                  value={form.externalLink}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className={adminInput}
                />
              </FormField>
            </div>

            {/* Image */}
            <div className={`${adminNestedCard} p-5 md:p-6 space-y-4`}>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Cover image</h3>
                <p className={`text-xs ${adminMuted} mt-1`}>
                  Recommended: {PROJECT_IMAGE_HINT}. Paste a URL or upload a file.
                </p>
              </div>
              <FormField label="Image URL">
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={adminInput}
                />
              </FormField>
              <FormField label="Or upload file" hint="Upload overrides the URL above.">
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white px-4 py-5 hover:border-[#8700ff]/35 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImageFile(file || null);
                      setImagePreview(file ? URL.createObjectURL(file) : form.imageUrl || "");
                    }}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#8700ff] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#7c3aed]"
                  />
                </div>
              </FormField>
              {(imagePreview || form.imageUrl) && (
                <div className="flex items-start gap-4 pt-2">
                  <img
                    src={imagePreview || form.imageUrl}
                    alt="Preview"
                    className="h-28 w-28 rounded-xl border border-slate-200 object-cover shadow-sm"
                  />
                  <p className={`text-xs ${adminMuted} pt-2`}>Preview of the cover image.</p>
                </div>
              )}
            </div>

            {/* Visibility toggles */}
            <div className={`${adminNestedCard} p-5 md:p-6 space-y-4`}>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Visibility</h3>
                <p className={`text-xs ${adminMuted} mt-1`}>Control how this project appears on the site.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <ToggleOption
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  label="Published"
                  description="Visible on the public Projects page"
                />
                <ToggleOption
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  label="Featured"
                  description="Highlighted at the top of the grid"
                />
                <ToggleOption
                  name="isCaseStudy"
                  checked={form.isCaseStudy}
                  onChange={handleChange}
                  label="Case study"
                  description="Shown in the detailed section below the grid"
                />
              </div>
            </div>

            {form.isCaseStudy && (
              <div className={`${adminNestedCard} p-5 md:p-6 space-y-5`}>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Case study details</h3>
                  <p className={`text-xs ${adminMuted} mt-1`}>Challenge, solution, and result for the in-depth card.</p>
                </div>
                <FormField label="Summary">
                  <textarea
                    name="summary"
                    value={form.summary}
                    onChange={handleChange}
                    placeholder="One paragraph overview"
                    className={adminTextarea}
                    rows={2}
                  />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Challenge">
                    <textarea
                      name="challenge"
                      value={form.challenge}
                      onChange={handleChange}
                      placeholder="What problem did the client face?"
                      className={adminTextarea}
                      rows={4}
                    />
                  </FormField>
                  <FormField label="Solution">
                    <textarea
                      name="solution"
                      value={form.solution}
                      onChange={handleChange}
                      placeholder="How did you solve it?"
                      className={adminTextarea}
                      rows={4}
                    />
                  </FormField>
                </div>
                <FormField label="Result">
                  <textarea
                    name="result"
                    value={form.result}
                    onChange={handleChange}
                    placeholder="Outcome and impact"
                    className={adminTextarea}
                    rows={2}
                  />
                </FormField>
                <FormField label="Button label">
                  <input
                    name="ctaLabel"
                    value={form.ctaLabel}
                    onChange={handleChange}
                    placeholder="View site"
                    className={adminInput}
                  />
                </FormField>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
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
