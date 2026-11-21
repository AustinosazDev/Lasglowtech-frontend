import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSave } from "react-icons/fa";
import ServicesData from "../../assets/data/serviceslist";
import { saveLocalServices } from "../../utils/services";

export default function ServicesAdmin() {
  const [services, setServices] = useState(ServicesData);
  const [filteredServices, setFilteredServices] = useState(ServicesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  // Filter services based on search and pillar
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPillar !== "all") {
      const pillarServices = {
        digital: ["Web Development", "Mobile Development", "UI/UX Design", "Digital Marketing", "Social Media Management"],
        "brand-systems": ["Graphic Design", "Branding & Print", "Product Packaging Design"],
        "print-production": ["Branding & Print", "Apparel & T-Shirt Branding", "Vehicle Branding"]
      };
      filtered = filtered.filter(service => pillarServices[selectedPillar]?.includes(service.title));
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedPillar, services]);

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const handleDelete = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      const updatedServices = services.filter(s => s.title !== serviceToDelete.title);
      setServices(updatedServices);
      saveLocalServices(updatedServices);
      setShowDeleteModal(false);
      setServiceToDelete(null);
      setSaveMessage("Service deleted successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleSave = (updatedService) => {
    let updatedServices;
    if (currentService) {
      updatedServices = services.map(s => s.title === currentService.title ? updatedService : s);
    } else {
      updatedServices = [...services, updatedService];
    }
    setServices(updatedServices);
    saveLocalServices(updatedServices);
    setIsEditing(false);
    setCurrentService(null);
    setSaveMessage("Service saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCreate = () => {
    setCurrentService({
      title: "",
      description: "",
      link: "",
      features: [],
      Picture: ""
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
          <p className="text-slate-600 mt-1">Manage your service offerings and descriptions</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8700ff] text-white rounded-lg hover:bg-[#6a00cc] transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {saveMessage && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <FaSave className="w-4 h-4" />
          {saveMessage}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff]"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff] appearance-none bg-white"
          >
            <option value="all">All Pillars</option>
            <option value="digital">Digital</option>
            <option value="brand-systems">Brand Systems</option>
            <option value="print-production">Print & Production</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Features</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredServices.map((service) => (
                <tr key={service.title} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{service.title}</div>
                    <div className="text-sm text-slate-500">{service.link}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">{service.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                          +{service.features.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-slate-600 hover:text-[#8700ff] hover:bg-violet-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No services found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {currentService?.title ? "Edit Service" : "Add New Service"}
              </h2>
            </div>
            <ServiceForm
              service={currentService}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setCurrentService(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Service</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{serviceToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setServiceToDelete(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceForm({ service, onSave, onCancel }) {
  const [formData, setFormData] = useState(service || {
    title: "",
    description: "",
    link: "",
    features: [],
    Picture: ""
  });
  const [featureInput, setFeatureInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Service Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
        <input
          type="text"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="/services/service-name"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
        <input
          type="url"
          value={formData.Picture}
          onChange={(e) => setFormData({ ...formData, Picture: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Features</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            placeholder="Add a feature"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8700ff]/20 focus:border-[#8700ff]"
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-[#8700ff] text-white rounded-lg hover:bg-[#6a00cc] transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-violet-500 hover:text-violet-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#8700ff] text-white rounded-lg hover:bg-[#6a00cc] transition-colors"
        >
          Save Service
        </button>
      </div>
    </form>
  );
}