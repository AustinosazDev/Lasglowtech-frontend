import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaBriefcase, FaBookOpen, FaEnvelope, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import { Land1, Land2, Land3 } from "../components/images";
import AuthSplitShell from "../components/AuthSplitShell";

const slides = [
  { image: Land1, title: "Join the network", text: "One account for hiring and learning." },
  { image: Land2, title: "Built for growth", text: "Design, dev, and delivery in one place." },
  { image: Land3, title: "Quick setup", text: "Compare services and pay when you’re ready." },
];

const inputCls =
  "w-full rounded-xl bg-bgcolor border border-Primarycolor/25 text-textcolor2 placeholder-muted text-sm font-semibold focus:outline-none focus:border-Primarycolor focus:ring-1 focus:ring-Primarycolor/40 transition-all";

const roles = [
  { value: "client", label: "Client", Icon: FaBriefcase },
  { value: "learner", label: "Learner", Icon: FaBookOpen },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from || (searchParams.get("redirect") ? decodeURIComponent(searchParams.get("redirect")) : null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "client" });

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/users/register", formData);
      saveSession({ token: res.data.token, user: res.data.user });
      toast.success("Account created! Welcome to Lasglowtech.");
      navigate(from || getRoleHomePath(res.data?.user?.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitShell slides={slides} slideIdx={slideIdx} contentAlign="start">
      <div className="max-w-md mx-auto w-full shrink-0 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-Secondarycolor text-xs sm:text-sm font-semibold mb-2 sm:mb-3 transition-colors"
        >
          ← Back
        </Link>

        <div className="brand-card p-5 sm:p-6 md:p-7">
          <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-textcolor2 tracking-tight mb-3 sm:mb-4">
            Join Lasglowtech
          </h1>

          <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Account type">
            {roles.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: value }))}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                  formData.role === value
                    ? "border-Primarycolor/50 bg-Primarycolor/20 ring-1 ring-Primarycolor/30"
                    : "border-Primarycolor/20 hover:border-Primarycolor/40 bg-bgcolor/40"
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 ${formData.role === value ? "text-Secondarycolor" : "text-muted"}`} />
                <p className={`font-extrabold text-sm ${formData.role === value ? "text-textcolor2" : "text-muted"}`}>{label}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-textcolor2 mb-1">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  className={`${inputCls} pl-10 pr-3 py-2.5 text-sm`}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-textcolor2 mb-1">
                Email
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
                  className={`${inputCls} pl-10 pr-3 py-2.5 text-sm`}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-textcolor2 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputCls} px-3 py-2.5 pr-12 text-sm`}
                  required
                  minLength={8}
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
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-0.5 py-2.5 text-sm"
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p className="text-muted text-xs sm:text-sm text-center mt-4">
            Have an account?{" "}
            <Link to="/auth/login" className="text-Secondarycolor hover:underline font-semibold">
              Sign in
            </Link>
          </p>
          <p className="text-[11px] text-muted/90 text-center mt-2 leading-tight">
            <Link to="/legal/terms" className="text-Primarycolor hover:underline font-medium">
              Terms
            </Link>
            {" · "}
            <Link to="/legal/privacy" className="text-Primarycolor hover:underline font-medium">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitShell>
  );
}
