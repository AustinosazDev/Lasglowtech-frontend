import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import { Land1, Land2, Land3 } from "../components/images";
import AuthSplitShell from "../components/AuthSplitShell";

const slides = [
  { image: Land1, title: "Crafted Digital Experiences", text: "Partner with a team focused on clean design, robust engineering, and measurable business impact." },
  { image: Land3, title: "Secure & Professional Delivery", text: "From strategy to launch, we build solutions that perform reliably and scale with your business." },
  { image: Land2, title: "Creative Services Marketplace", text: "Login to access premium catalogues, personalized checkout, and faster project onboarding." },
];

const inputCls =
  "w-full rounded-xl bg-bgcolor border border-Primarycolor/25 text-textcolor2 placeholder-muted text-sm font-semibold focus:outline-none focus:border-Primarycolor focus:ring-1 focus:ring-Primarycolor/40 transition-all";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from || (searchParams.get("redirect") ? decodeURIComponent(searchParams.get("redirect")) : null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

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
            Welcome back
          </span>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-textcolor2 tracking-tight mb-6">Sign in to Lasglowtech</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputCls} px-3 py-3 pr-12`}
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
            <div className="flex justify-end pt-0.5">
              <Link
                to="/auth/forgot-password"
                className="text-xs text-muted hover:text-Secondarycolor transition-colors font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p className="text-muted text-sm text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" className="text-Secondarycolor hover:underline font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitShell>
  );
}
