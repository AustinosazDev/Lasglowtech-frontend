import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaBriefcase, FaBookOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import { Land1, Land2, Land3 } from "../components/images";

const slides = [
  { image: Land1, title: "Join the Network", text: "Create your profile and start connecting with opportunities in minutes." },
  { image: Land2, title: "Built for Business Growth", text: "From design to development, we offer modern solutions tailored to your business goals." },
  { image: Land3, title: "Simple Onboarding", text: "Register once, compare services, and pay securely when you're ready to start." },
];

const inputCls = "w-full px-4 py-3.5 rounded-xl bg-[#120b1f] border border-[#8700ff]/25 text-white placeholder-[#9b8cb5] text-sm font-semibold focus:outline-none focus:border-[#8700ff] focus:ring-1 focus:ring-[#8700ff]/40 transition-all";

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
    const t = setInterval(() => setSlideIdx(p => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/users/register", formData);
      saveSession({ token: res.data.token, user: res.data.user });
      toast.success("Account created! Welcome to Lasglowtech.");
      navigate(from || getRoleHomePath(res.data?.user?.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
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

      {/* Right form */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-[#9b8cb5] hover:text-orange-500 text-sm font-semibold mb-10 transition-colors">← Back to site</Link>

          <span className="section-tag"><span className="dot-live"/>Create account</span>
          <h1 className="font-extrabold text-3xl text-white tracking-tight mb-2">Join Lasglowtech</h1>
          <p className="text-[#9b8cb5] text-sm mb-8">Already have an account? <Link to="/auth/login" className="text-orange-500 hover:underline font-bold">Sign in</Link></p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map(({ value, label, desc, Icon }) => (
              <button key={value} type="button" onClick={() => setFormData(p => ({ ...p, role: value }))}
                className={`p-4 rounded-xl border text-left transition-all ${formData.role === value ? "border-[#8700ff] bg-[#8700ff]/12" : "border-[#8700ff]/20 hover:border-[#8700ff]/40"}`}>
                <Icon className={`w-5 h-5 mb-2 ${formData.role === value ? "text-orange-500" : "text-[#9b8cb5]"}`} />
                <p className={`font-extrabold text-sm ${formData.role === value ? "text-white" : "text-[#9b8cb5]"}`}>{label}</p>
                <p className="text-xs text-[#9b8cb5] mt-0.5 leading-tight">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Username</label>
              <input id="username" name="username" type="text" placeholder="johndoe" value={formData.username} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label htmlFor="email" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPwd ? "text" : "password"} placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} className={`${inputCls} pr-12`} required minLength={8} />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b8cb5] hover:text-orange-500 transition-colors" aria-label={showPwd ? "Hide password" : "Show password"}>
                  {showPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>
          <p className="text-xs text-[#9b8cb5] text-center mt-4">By creating an account, you agree to our <span className="text-[#8700ff]">Terms of Service</span> and <span className="text-[#8700ff]">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
}


