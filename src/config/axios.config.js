import axios from "axios";
import { getToken } from "../utils/auth";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  /^127\.(?:\d{1,3}\.){2}\d{1,3}$/.test(window.location.hostname);

// Production: set VITE_API_URL at build time when the API is on another host.
// If omitted, requests use same origin (reverse proxy). No production console noise;
// see .env.example for CI/host env vars.
const envApiUrl = import.meta.env.VITE_API_URL;
const hasViteApiUrl = typeof envApiUrl === "string" && envApiUrl.trim() !== "";

export const API_BASE_URL = (
  (hasViteApiUrl ? envApiUrl.trim() : null) ||
  (isLocalhost ? "http://localhost:5000" : window.location.origin)
).replace(/\/+$/, "");

if (import.meta.env.DEV && !hasViteApiUrl) {
  console.info(
    "[Lasglowtech] VITE_API_URL not set; API base:",
    API_BASE_URL,
    "(set VITE_API_URL if the API is on another host — see .env.example)"
  );
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Add auth token to requests if available
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
