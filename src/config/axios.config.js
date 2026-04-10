

// import axios from "axios";
// const isLocalhost = Boolean(
//     window.location.hostname === "localhost" ||
//     // [::1] is the IPv6 localhost address.
//     window.location.hostname === "[::1]" ||
//     // 127.0.0.1/8 is considered localhost for IPv4.
//     window.location.hostname.match(
//         /^127\.(?:\d{1,3}\.){2}\d{1,3}$/
//     )
// );
// const API_URL = isLocalhost
//     ? "http://localhost:5000"
//     : "https://lasglowserver.phoenixstech.com";
// // const API_URL = "http://localhost:5000";

// const instance = axios.create({
//     withCredentials: true,
//     baseURL: API_URL
// });

// export default instance;

import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  /^127\.(?:\d{1,3}\.){2}\d{1,3}$/.test(window.location.hostname);

// Production: set VITE_API_URL at build time when the API is on another host.
// If missing, requests use same origin (works with a reverse proxy). Set
// VITE_API_USE_SAME_ORIGIN=true in that case to silence the devtools warning.
const envApiUrl = import.meta.env.VITE_API_URL;
const hasViteApiUrl = typeof envApiUrl === "string" && envApiUrl.trim() !== "";
const explicitSameOrigin = import.meta.env.VITE_API_USE_SAME_ORIGIN === "true";

export const API_BASE_URL =
  (hasViteApiUrl ? envApiUrl.trim() : null) ||
  (isLocalhost ? "http://localhost:5000" : window.location.origin);

if (!isLocalhost && !hasViteApiUrl && !explicitSameOrigin) {
  console.warn(
    "[Lasglowtech] VITE_API_URL was not set at build time. API requests use:",
    API_BASE_URL,
    "— set VITE_API_URL for your API host, or VITE_API_USE_SAME_ORIGIN=true if you proxy on the same domain. See .env.example."
  );
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default instance;
