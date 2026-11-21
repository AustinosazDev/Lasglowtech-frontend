import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getRoleHomePath, saveSession } from "../utils/auth";
import AuthFormShell, { authInputCls } from "../components/AuthFormShell";
import GoogleAuthButton from "../components/GoogleAuthButton";

const roles = [
  {
    value: "client",
    label: "Client",
    desc: "Browse our catalogue, place orders, and manage your projects with us.",
  },
  {
    value: "learner",
    label: "Student",
    desc: "Join the academy, follow structured courses, and earn certificates.",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from =
    location.state?.from ||
    (searchParams.get("redirect") ? decodeURIComponent(searchParams.get("redirect")) : null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
  });

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "learner" || role === "student") {
      setFormData((p) => ({ ...p, role: "learner" }));
    } else if (role === "client") {
      setFormData((p) => ({ ...p, role: "client" }));
    }
  }, [searchParams]);

  const selectedRole = roles.find((r) => r.value === formData.role) || roles[0];

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleContinue = () => setStep(2);

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

  if (step === 1) {
    return (
      <AuthFormShell backTo="/" backLabel="Back to site" maxWidth="max-w-2xl">
        <div className="mb-8 text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-Secondarycolor">
            Step 1 of 2
          </span>
          <h1 className="text-2xl font-bold text-textcolor2 tracking-tight mt-3">Create your account</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Pick how you want to use Lasglowtech, whether as a client or a student.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" role="group" aria-label="Account type">
          {roles.map(({ value, label, desc }) => {
            const active = formData.role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: value }))}
                className={`text-left min-h-[168px] sm:min-h-[180px] p-6 sm:p-7 rounded-2xl border transition-all duration-200 ${
                  active
                    ? "border-Primarycolor bg-Primarycolor/10 shadow-[0_8px_32px_rgba(135,0,255,0.28)] ring-1 ring-Primarycolor/30"
                    : "border-Primarycolor/20 bg-bgcolor/45 shadow-[0_4px_24px_rgba(0,0,0,0.28)] hover:border-Primarycolor/40 hover:shadow-[0_6px_28px_rgba(135,0,255,0.14)]"
                }`}
              >
                <span className="block font-semibold text-base leading-snug text-textcolor2">
                  {label}
                </span>
                <span className="block text-sm text-muted mt-2 leading-relaxed">{desc}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6">
          <button type="button" onClick={handleContinue} className="btn-primary px-8 min-w-[148px] justify-center">
            Continue
          </button>
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-Secondarycolor hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell onBack={() => setStep(1)} backLabel="Back" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-Secondarycolor">
          Step 2 of 2
        </span>
        <h1 className="text-xl font-bold text-textcolor2 tracking-tight mt-3">Create your account</h1>
        <p className="text-sm text-muted mt-2">
          Set up your{" "}
          <span className="text-textcolor2 font-semibold">{selectedRole.label.toLowerCase()}</span>{" "}
          profile to get started.
        </p>
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
              className={`${authInputCls} pl-10 pr-3 py-3`}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-textcolor2 mb-2">
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
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              className={`${authInputCls} px-3 py-3 pr-12`}
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
          <p className="text-xs text-muted mt-1.5">Password must be at least 8 characters.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-muted">or</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <GoogleAuthButton label="Sign up with Google" role={formData.role} />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? "Creating account…" : `Create ${selectedRole.label.toLowerCase()} account`}
        </button>
      </form>

      <p className="text-xs text-muted text-center mt-4 leading-relaxed">
        By signing up you agree to our{" "}
        <Link to="/legal/terms" className="text-Secondarycolor hover:underline font-medium">
          Terms
        </Link>
        {" and "}
        <Link to="/legal/privacy" className="text-Secondarycolor hover:underline font-medium">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-sm text-center text-muted mt-5">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-Secondarycolor hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </AuthFormShell>
  );
}
