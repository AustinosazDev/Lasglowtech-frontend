import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import { Land1, Land2, Land3 } from "../components/images";

const slides = [
  { image: Land1, title: "Crafted Digital Experiences", text: "Partner with a team focused on clean design, robust engineering, and measurable business impact." },
  { image: Land3, title: "Secure & Professional Delivery", text: "From strategy to launch, we build solutions that perform reliably and scale with your business." },
  { image: Land2, title: "Creative Services Marketplace", text: "Login to access premium catalogues, personalized checkout, and faster project onboarding." },
];

const inputCls = "w-full px-4 py-3.5 rounded-xl bg-[#120b1f] border border-[#8700ff]/25 text-white placeholder-[#9b8cb5] text-sm font-semibold focus:outline-none focus:border-[#8700ff] focus:ring-1 focus:ring-[#8700ff]/40 transition-all";

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
    const t = setInterval(() => setSlideIdx(p => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/users/login", formData);
      saveSession({ token: res.data.token, user: res.data.user });
      toast.success("Welcome back.");
      navigate(from || getRoleHomePath(res.data?.user?.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to login.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#120b1f] grid grid-cols-1 lg:grid-cols-2">
      {/* Left image panel */}
      <div className="hidden lg:block relative overflow-hidden">
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === slideIdx ? "opacity-100" : "opacity-0"}`}>
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120b1f] via-[#120b1f]/50 to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
              <h2 className="font-extrabold text-2xl text-white mb-2">{s.title}</h2>
              <p className="text-[#9b8cb5] text-sm leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-10 flex gap-2">
          {slides.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i === slideIdx ? "w-6 bg-orange-500" : "w-2 bg-[#8700ff]/20"}`} />)}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-[#9b8cb5] hover:text-orange-500 text-sm font-semibold mb-10 transition-colors">
            ← Back to site
          </Link>

          <span className="section-tag"><span className="dot-live"/>Welcome back</span>
          <h1 className="font-extrabold text-3xl text-white tracking-tight mb-2">Sign in to Lasglowtech</h1>
          <p className="text-[#9b8cb5] text-sm mb-8">Don't have an account? <Link to="/auth/register" className="text-orange-500 hover:underline font-bold">Sign up free</Link></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPwd ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} className={`${inputCls} pr-12`} required />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b8cb5] hover:text-orange-500 transition-colors" aria-label={showPwd ? "Hide password" : "Show password"}>
                  {showPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/auth/forgot-password" className="text-xs text-[#9b8cb5] hover:text-orange-500 transition-colors font-semibold">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


