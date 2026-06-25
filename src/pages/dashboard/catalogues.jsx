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
import { AdminCatalogueCardSkeletonGrid } from "../../components/skeletons/CardSkeletons";
import { PRODUCT_COVER_IMAGE_HINT } from "../../utils/catalogue";

const defaultForm = {
  id: null,
  title: "",
  summary: "",
  description: "",
  imageUrl: "",
  price: "",
  packageTier: "standard",
  isPopular: false,
  featuresText: "",
  paymentType: "full",
  currency: "NGN",
  isPaymentEnabled: true,
  isPublished: true,
  sortOrder: 0,
  deliveryType: "service",
  deliverableFileUrl: "",
  deliverableFileName: "",
  deliverableExternalUrl: "",
};

const premiumPackageTemplates = [
  {
    key: "ecommerce-premium",
    label: "Premium Ecommerce Website",
    title: "Premium Ecommerce Website",
    summary: "Conversion-focused online store with seamless checkout and product management.",
    description:
      "Includes UI/UX design, product/catalog setup, payment gateway integration, order flow, responsive storefront, performance optimization, and analytics setup.",
    price: 450000,
    packageTier: "premium",
    paymentType: "deposit",
    currency: "NGN",
    isPaymentEnabled: true,
    isPublished: true,
    features: [
      "Custom homepage and product pages",
      "Payment gateway integration",
      "Cart and checkout optimization",
      "Order/admin management setup",
      "Mobile-first responsive design",
    ],
  },
  {
    key: "portfolio-pro",
    label: "Professional Portfolio Website",
    title: "Professional Portfolio Website",
    summary: "Modern portfolio website for creators, founders, and agencies.",
    description:
      "Includes custom layout, project showcase pages, contact integration, social links, mobile optimization, and SEO-ready structure.",
    price: 180000,
    packageTier: "standard",
    paymentType: "full",
    currency: "NGN",
    isPaymentEnabled: true,
    isPublished: true,
    features: [
      "Project/case study pages",
      "SEO-ready structure",
      "Contact and social links",
      "Mobile responsive design",
    ],
  },
  {
    key: "landing-page-growth",
    label: "Landing Page (Growth Package)",
    title: "Landing Page (Growth Package)",
    summary: "High-converting landing page for campaigns and product launches.",
    description:
      "Includes strategic copy layout, conversion-focused sections, CTA flows, responsive build, speed optimization, and lead form integration.",
    price: 120000,
    packageTier: "starter",
    paymentType: "full",
    currency: "NGN",
    isPaymentEnabled: true,
    isPublished: true,
    features: [
      "Conversion-oriented section flow",
      "Lead form integration",
      "Fast-loading implementation",
      "Analytics-ready setup",
    ],
  },
  {
    key: "branding-suite",
    label: "Branding Suite",
    title: "Branding Suite",
    summary: "Complete visual identity package for modern businesses.",
    description:
      "Includes logo system, color palette, typography style guide, social media branding assets, and brand usage guide.",
    price: 150000,
    packageTier: "standard",
    paymentType: "full",
    currency: "NGN",
    isPaymentEnabled: true,
    isPublished: true,
    features: [
      "Logo and visual identity",
      "Color and typography guide",
      "Social media brand assets",
      "Brand usage guide",
    ],
  },
  {
    key: "uiux-premium",
    label: "UI/UX Design Premium",
    title: "UI/UX Design Premium",
    summary: "Research-backed product design for web and mobile applications.",
    description:
      "Includes user flow mapping, wireframes, high-fidelity screens, design system components, and developer handoff documentation.",
    price: 220000,
    packageTier: "premium",
    paymentType: "deposit",
    currency: "NGN",
    isPaymentEnabled: true,
    isPublished: true,
    features: [
      "User flow and wireframes",
      "High-fidelity UI screens",
      "Component design system",
      "Developer handoff files",
    ],
  },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "starter", label: "Starter" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const CataloguesAdmin = () => {
  const [form, setForm] = useState(defaultForm);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deliverableFile, setDeliverableFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const authHeader = useMemo(() => {
    const token = getAdminToken();
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchCatalogues = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/catalogues/admin/all", { headers: authHeader });
      setItems(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load catalogues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;
    const q = (searchQuery || "").toLowerCase().trim();
    if (q) {
      list = list.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.summary || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter((item) => (item.packageTier || "standard") === categoryFilter);
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
      let imageUrl = form.imageUrl;
      let deliverableFileUrl = form.deliverableFileUrl;
      let deliverableFileName = form.deliverableFileName;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await instance.post("/upload/images", formData);
        const filename = uploadRes.data;
        imageUrl = `${instance.defaults.baseURL}/uploads/images/${filename}`;
      }

      if (deliverableFile && form.deliveryType === "digital_file") {
        const formData = new FormData();
        formData.append("file", deliverableFile);
        const uploadRes = await instance.post("/admin/upload/catalogue-deliverable", formData, {
          headers: authHeader,
        });
        deliverableFileUrl = uploadRes.data?.storedName || deliverableFileUrl;
        deliverableFileName = uploadRes.data?.originalName || deliverableFile.name;
      }

      const payload = {
        ...form,
        features: form.featuresText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        imageUrl,
        deliverableFileUrl,
        deliverableFileName,
      };

      if (form.id) {
        await instance.put(`/catalogues/admin/${form.id}`, payload, { headers: authHeader });
        toast.success("Catalogue updated.");
      } else {
        await instance.post("/catalogues/admin", payload, { headers: authHeader });
        toast.success("Catalogue created.");
      }
      setForm(defaultForm);
      setSelectedTemplate("");
      setImageFile(null);
      setImagePreview("");
      setDeliverableFile(null);
      fetchCatalogues();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to save catalogue.");
    }
  };

  const applyTemplate = (templateKey) => {
    const template = premiumPackageTemplates.find((item) => item.key === templateKey);
    if (!template) return;

    setForm((prev) => ({
      ...prev,
      title: template.title,
      summary: template.summary,
      description: template.description,
      price: template.price,
      packageTier: template.packageTier || "standard",
      isPopular: template.packageTier === "premium",
      featuresText: Array.isArray(template.features) ? template.features.join("\n") : "",
      paymentType: template.paymentType,
      currency: template.currency,
      isPaymentEnabled: template.isPaymentEnabled,
      isPublished: template.isPublished,
    }));
    toast.success(`${template.label} template applied.`);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title || "",
      summary: item.summary || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      price: item.price || "",
      packageTier: item.packageTier || "standard",
      isPopular: Boolean(item.isPopular),
      featuresText: Array.isArray(item.features) ? item.features.join("\n") : "",
      paymentType: item.paymentType || "full",
      currency: item.currency || "NGN",
      isPaymentEnabled: Boolean(item.isPaymentEnabled),
      isPublished: Boolean(item.isPublished),
      sortOrder: item.sortOrder || 0,
      deliveryType: item.deliveryType || "service",
      deliverableFileUrl: item.deliverableFileUrl || "",
      deliverableFileName: item.deliverableFileName || "",
      deliverableExternalUrl: item.deliverableExternalUrl || "",
    });
    setImageFile(null);
    setImagePreview(item.imageUrl || "");
    setDeliverableFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this catalogue?")) return;
    try {
      await instance.delete(`/catalogues/admin/${id}`, { headers: authHeader });
      toast.success("Catalogue deleted.");
      fetchCatalogues();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h2 className={adminSectionTitle}>Catalogue manager</h2>
          <p className={adminSectionDesc}>Create and publish service cards for the marketplace.</p>
        </div>
        <div className={adminCardBody}>
        <div className={`${adminNestedCard} mb-6 p-4`}>
          <p className={`${adminFieldLabel} mb-2`}>Quick package templates</p>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className={`${adminSelect} md:min-w-[320px]`}
            >
              <option value="">Select a package template</option>
              {premiumPackageTemplates.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => applyTemplate(selectedTemplate)}
              disabled={!selectedTemplate}
              className={`${adminBtnSoft} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Apply Template
            </button>
          </div>
          <p className={`text-xs ${adminMuted} mt-2`}>
            Template fills title, summary, description, price, and payment settings. You can edit before saving.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Service title"
            className={adminInput}
            required
          />
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Summary (one line)"
            className={adminInput}
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price in NGN (e.g 85000)"
            type="number"
            className={adminInput}
          />
          <select
            name="packageTier"
            value={form.packageTier}
            onChange={handleChange}
            className={adminInput}
          >
            <option value="starter">Starter tier</option>
            <option value="standard">Standard tier</option>
            <option value="premium">Premium tier</option>
          </select>
          <input
            name="sortOrder"
            value={form.sortOrder}
            onChange={handleChange}
            type="number"
            placeholder="Sort order"
            className={adminInput}
          />
          <select
            name="paymentType"
            value={form.paymentType}
            onChange={handleChange}
            className={adminInput}
          >
            <option value="full">Full payment</option>
            <option value="deposit">Deposit</option>
          </select>
          <select
            name="deliveryType"
            value={form.deliveryType}
            onChange={handleChange}
            className={adminInput}
          >
            <option value="service">Service (manual delivery)</option>
            <option value="digital_file">Digital file (PDF, ZIP, eBook upload)</option>
            <option value="digital_link">External link (Drive, WhatsApp, etc.)</option>
          </select>

          {form.deliveryType === "digital_file" && (
            <div className="md:col-span-2">
              <label className={adminFieldLabel}>Product file</label>
              <input
                type="file"
                accept=".pdf,.zip,.epub,.doc,.docx"
                onChange={(e) => setDeliverableFile(e.target.files?.[0] || null)}
                className={adminInput}
              />
              <p className={`text-xs ${adminMuted} mt-2`}>
                Customers download instantly after payment. Guest buyers receive a download link by email; signed-in customers use the success page or My Orders.
              </p>
              {(form.deliverableFileName || deliverableFile) && (
                <p className="text-sm text-emerald-700 mt-2">
                  Current file: {deliverableFile?.name || form.deliverableFileName}
                </p>
              )}
            </div>
          )}

          {form.deliveryType === "digital_link" && (
            <div className="md:col-span-2">
              <label className={adminFieldLabel}>External access URL</label>
              <input
                name="deliverableExternalUrl"
                value={form.deliverableExternalUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/... or WhatsApp group link"
                className={adminInput}
              />
              <p className={`text-xs ${adminMuted} mt-2`}>
                Link is emailed to the customer after payment and shown on the success page.
              </p>
            </div>
          )}

          <div className="md:col-span-2">
            <label className={adminFieldLabel}>Catalogue image</label>
            <p className={`text-xs ${adminMuted} mb-2`}>
              Best size: {PRODUCT_COVER_IMAGE_HINT}. Landscape photos fill the card without cropping awkwardly.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className={adminInput}
            />
            {(imagePreview || form.imageUrl) && (
              <img
                src={imagePreview || form.imageUrl}
                alt="Catalogue preview"
                className="mt-3 w-full max-w-sm aspect-[16/10] object-cover object-center rounded-2xl border border-Primarycolor/30"
              />
            )}
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Long description"
            rows={4}
            className={`md:col-span-2 ${adminTextarea}`}
          />
          <textarea
            name="featuresText"
            value={form.featuresText}
            onChange={handleChange}
            placeholder={"Feature list (one per line)\nCustom homepage\nSEO setup\nPayment integration"}
            rows={4}
            className={`md:col-span-2 ${adminTextarea}`}
          />

          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input type="checkbox" name="isPaymentEnabled" checked={form.isPaymentEnabled} onChange={handleChange} />
            Payment enabled
          </label>
          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input type="checkbox" name="isPopular" checked={form.isPopular} onChange={handleChange} />
            Most Popular
          </label>
          <label className={`flex items-center gap-2 text-sm ${adminMuted}`}>
            <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
            Published
          </label>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className={adminBtnPrimary}
            >
              {form.id ? "Update Catalogue" : "Create Catalogue"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => {
                  setForm(defaultForm);
                  setSelectedTemplate("");
                  setImageFile(null);
                  setImagePreview("");
                  setDeliverableFile(null);
                }}
                className={adminBtnSoft}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
        </div>
      </section>

      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h3 className={adminSectionTitle}>Catalogue items</h3>
          <p className={adminSectionDesc}>Search and filter your service packages.</p>
        </div>
        <div className={adminCardBody}>
          {!loading && items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, summary, or description…"
                  className={adminInput}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" aria-hidden>
                  ⌕
                </span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`${adminSelect} min-w-[180px]`}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {loading && <AdminCatalogueCardSkeletonGrid count={6} className="py-2" />}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="brand-card overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-bgcolor2 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${adminEmptyText}`}>
                        No image
                      </div>
                    )}
                    <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-Primarycolor/90 text-white text-xs font-medium capitalize">
                        {item.packageTier || "standard"}
                      </span>
                      {item.isPopular && (
                        <span className="px-2 py-0.5 rounded-md bg-Secondarycolor text-white text-xs font-medium">
                          Popular
                        </span>
                      )}
                      {item.isPublished ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-xs">Published</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-gray-600/90 text-white text-xs">Draft</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-semibold text-slate-900 text-lg">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.summary}</p>
                    <p className="text-sm font-medium text-[#8700ff] mt-2">
                      NGN {Number(item.price || 0).toLocaleString()}
                      <span className="text-slate-400 font-normal text-xs ml-1">· {item.paymentType}</span>
                      {item.isDigitalProduct && (
                        <span className="block text-emerald-600 text-xs mt-1 capitalize">
                          {item.deliveryType?.replace("_", " ")}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className={`flex-1 ${adminBtnSoft} text-sm`}
                      >
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
          {!loading && !filteredItems.length && (
            <p className={`${adminEmptyText} text-center py-12`}>
              {items.length ? "No items match your search or filter." : "No catalogue items yet."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CataloguesAdmin;

