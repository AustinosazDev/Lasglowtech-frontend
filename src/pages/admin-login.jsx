import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { saveAdminSession } from "../utils/adminAuth";

const inputCls =
  "w-full rounded-xl bg-bgcolor border border-Primarycolor/25 text-textcolor2 placeholder-muted text-sm font-semibold focus:outline-none focus:border-Primarycolor focus:ring-1 focus:ring-Primarycolor/40 transition-all";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/admin/login", formData);
      saveAdminSession({
        token: res.data?.token,
        admin: res.data?.admin,
      });
      toast.success("Admin login successful.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login as admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 py-12 overflow-hidden text-textcolor2 bg-gradient-to-br from-bgcolor2 via-bgcolor to-bgcolor">
      <div
        className="absolute top-[-100px] right-[-60px] w-[min(520px,90vw)] h-[min(520px,90vw)] rounded-full bg-Primarycolor1 opacity-[0.14] blur-[100px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-[-80px] left-[-40px] w-[min(400px,75vw)] h-[min(400px,75vw)] rounded-full bg-Primarycolor opacity-[0.1] blur-[95px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,120vw)] h-[min(640px,120vw)] rounded-full bg-Secondarycolor opacity-[0.05] blur-[110px] pointer-events-none"
        aria-hidden
      />

      <div className="brand-card w-full max-w-md p-8 md:p-9 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-xl bg-Primarycolor/25 border border-Primarycolor/35 flex items-center justify-center mb-5"
            aria-hidden
          >
            <FaShieldAlt className="w-6 h-6 text-Secondarycolor" />
          </div>
          <h1 className="text-xl font-bold text-textcolor2 tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted mt-1.5">Lasglowtech — Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-textcolor2 mb-2">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@lasglowtech.com.ng"
                autoComplete="email"
                className={`${inputCls} pl-10 pr-3 py-3`}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-textcolor2 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${inputCls} px-3 py-3 pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-Secondarycolor transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Signing in…" : "Sign In as Admin"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Not an admin?{" "}
          <Link to="/auth/login" className="text-Secondarycolor hover:underline font-semibold transition-colors">
            Back to user login
          </Link>
        </p>
        <Link
          to="/"
          className="block text-center text-xs text-muted hover:text-Secondarycolor mt-4 transition-colors"
        >
          Back to main site
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
