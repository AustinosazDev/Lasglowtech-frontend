import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaBriefcase, FaBookOpen, FaEnvelope, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import { Land1, Land2, Land3 } from "../components/images";
import AuthSplitShell from "../components/AuthSplitShell";

const slides = [
  { image: Land1, title: "Join the Network", text: "Create your profile and start connecting with opportunities in minutes." },
  { image: Land2, title: "Built for Business Growth", text: "From design to development, we offer modern solutions tailored to your business goals." },
  { image: Land3, title: "Simple Onboarding", text: "Register once, compare services, and pay securely when you're ready to start." },
];

const inputCls =
  "w-full rounded-xl bg-bgcolor border border-Primarycolor/25 text-textcolor2 placeholder-muted text-sm font-semibold focus:outline-none focus:border-Primarycolor focus:ring-1 focus:ring-Primarycolor/40 transition-all";

const roles = [
  { value: "client", label: "Client", desc: "I want to hire / buy services", Icon: FaBriefcase },
  { value: "learner", label: "Learner", desc: "I want to learn tech skills", Icon: FaBookOpen },
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
    <AuthSplitShell slides={slides} slideIdx={slideIdx}>
      <div className="max-w-md mx-auto w-full shrink-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-Secondarycolor text-sm font-semibold mb-4 transition-colors"
        >
          ← Back to site
        </Link>

        <div className="brand-card p-8 md:p-9">
          <span className="section-tag !mb-2 block">
            <span className="dot-live" />
            Create account
          </span>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-textcolor2 tracking-tight mb-5">Join Lasglowtech</h1>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {roles.map(({ value, label, desc, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: value }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.role === value
                    ? "border-Primarycolor/50 bg-Primarycolor/20 ring-1 ring-Primarycolor/30"
                    : "border-Primarycolor/20 hover:border-Primarycolor/40 bg-bgcolor/40"
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${formData.role === value ? "text-Secondarycolor" : "text-muted"}`} />
                <p className={`font-extrabold text-sm ${formData.role === value ? "text-textcolor2" : "text-muted"}`}>{label}</p>
                <p className="text-xs text-muted mt-0.5 leading-tight">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-textcolor2 mb-2">
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
                  className={`${inputCls} pl-10 pr-3 py-3`}
                  required
                />
              </div>
            </div>
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
                  className={`${inputCls} pl-10 pr-3 py-3`}
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
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputCls} px-3 py-3 pr-12`}
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
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p className="text-muted text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-Secondarycolor hover:underline font-semibold">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-muted text-center mt-3 leading-snug">
            By creating an account, you agree to our{" "}
            <Link to="/legal/terms" className="text-Primarycolor hover:text-Secondarycolor hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/legal/privacy" className="text-Primarycolor hover:text-Secondarycolor hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </AuthSplitShell>
  );
}
