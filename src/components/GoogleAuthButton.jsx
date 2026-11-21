import { API_BASE_URL } from "../config/axios.config";

export default function GoogleAuthButton({ label = "Continue with Google" }) {
  return (
    <a
      href={`${API_BASE_URL}/auth/google`}
      className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
    >
      <img src="/search.png" alt="" className="w-4 h-4 object-contain" />
      {label}
    </a>
  );
}
