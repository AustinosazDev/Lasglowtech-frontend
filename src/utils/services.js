import axios from 'axios';
import { getAdminToken } from './adminAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const servicesAPI = {
  // Get all services
  getAll: async () => {
    try {
      const token = getAdminToken();
      const response = await axios.get(`${API_BASE_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get single service by ID
  getById: async (id) => {
    try {
      const token = getAdminToken();
      const response = await axios.get(`${API_BASE_URL}/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Create new service
  create: async (serviceData) => {
    try {
      const token = getAdminToken();
      const response = await axios.post(`${API_BASE_URL}/services`, serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update existing service
  update: async (id, serviceData) => {
    try {
      const token = getAdminToken();
      const response = await axios.put(`${API_BASE_URL}/services/${id}`, serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service
  delete: async (id) => {
    try {
      const token = getAdminToken();
      const response = await axios.delete(`${API_BASE_URL}/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Upload service image
  uploadImage: async (file) => {
    try {
      const token = getAdminToken();
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_BASE_URL}/services/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

// Fallback to local data if API is not available
export const getLocalServices = () => {
  return import('../assets/data/serviceslist').then(module => module.default);
};

export const saveLocalServices = (services) => {
  // This would typically save to a backend or local storage
  // For now, we'll just log it
  console.log('Services to save:', services);
  localStorage.setItem('services_backup', JSON.stringify(services));
};