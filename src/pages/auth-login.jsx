import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import AuthFormShell, { authInputCls } from "../components/AuthFormShell";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from =
    location.state?.from ||
    (searchParams.get("redirect") ? decodeURIComponent(searchParams.get("redirect")) : null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/users/login", formData);
      saveSession({ token: res.data.token, user: res.data.user });
      toast.success("Welcome back.");
      navigate(from || getRoleHomePath(res.data?.user?.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell backTo="/" backLabel="Back to site">
      <div className="flex flex-col items-center text-center">
        <div
          className="w-12 h-12 rounded-xl bg-Primarycolor/25 border border-Primarycolor/35 flex items-center justify-center mb-5"
          aria-hidden
        >
          <FaSignInAlt className="w-6 h-6 text-Secondarycolor" />
        </div>
        <h1 className="text-xl font-bold text-textcolor2 tracking-tight">Sign in</h1>
        <p className="text-sm text-muted mt-1.5">Access your account, orders, and learning dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-textcolor2 mb-2">
            Email address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`${authInputCls} pl-10 pr-3 py-3`}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-textcolor2 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`${authInputCls} px-3 py-3 pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-Secondarycolor transition-colors p-1"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-xs text-muted hover:text-Secondarycolor transition-colors font-semibold"
          >
            Forgot password?
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-muted">or</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <GoogleAuthButton />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link to="/auth/register" className="text-Secondarycolor hover:underline font-semibold">
          Sign up free
        </Link>
      </p>
    </AuthFormShell>
  );
}
