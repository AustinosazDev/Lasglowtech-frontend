import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { getToken, getUser } from "../utils/auth";
import { LOGO } from "../components/images";
import BgPatternOverlay from "../components/BgPatternOverlay";
import { authInputCls } from "../components/AuthFormShell";

const defaultForm = {
  fullName: "",
  email: "",
  phone: "",
  skillInterest: "",
  learningGoal: "",
  experienceLevel: "",
  availability: "",
  city: "",
  country: "",
  portfolioUrl: "",
};

const skillOptions = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Graphic Design",
  "Digital Product Management",
  "Content / Social Media Design",
];

const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Flexible"];
const countryOptions = ["Nigeria", "Ghana", "Kenya", "South Africa", "Other"];

const STEPS = [
  { id: 1, label: "Personal info" },
  { id: 2, label: "Skills & goals" },
];

const labelClass = "block text-sm font-medium text-textcolor2 mb-2";

function StepProgress({ step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-0">
        {STEPS.map(({ id, label }, index) => {
          const active = step === id;
          const done = step > id;
          return (
            <div key={id} className="flex items-center flex-1 last:flex-none min-w-0">
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    active
                      ? "bg-Primarycolor border-Primarycolor text-white"
                      : done
                        ? "bg-Primarycolor/20 border-Primarycolor text-Secondarycolor"
                        : "bg-bgcolor border-Primarycolor/25 text-muted"
                  }`}
                >
                  {id}
                </span>
                <span
                  className={`text-xs font-medium text-center leading-tight px-1 ${
                    active ? "text-textcolor2" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-6 rounded-full ${
                    step > id ? "bg-Primarycolor/50" : "bg-Primarycolor/15"
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Careers = () => {
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getUser(), []);
  const token = useMemo(() => getToken(), []);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ...defaultForm,
    fullName: sessionUser?.username || "",
    email: sessionUser?.email || "",
  });
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep1 = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name, email, and phone.");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skillInterest || !form.learningGoal.trim()) {
      toast.error("Please select a skill track and share your learning goal.");
      return;
    }

    setLoading(true);
    try {
      let pictureUrl = "";

      if (pictureFile) {
        const fd = new FormData();
        fd.append("file", pictureFile);
        const uploadRes = await instance.post("/upload/images", fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        pictureUrl = `${instance.defaults.baseURL}/uploads/images/${uploadRes.data}`;
      }

      await instance.post(
        "/careers/apply",
        { ...form, pictureUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Application submitted successfully.");
      navigate("/careers/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-bgcolor2 via-bgcolor to-bgcolor text-textcolor2">
      <BgPatternOverlay glow />

      <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-4 sm:py-5">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-Secondarycolor transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to courses
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:py-14">
        <SEO
          title="Academy Application | Lasglowtech"
          description="Apply for Lasglowtech tutoring and training programmes."
          url="https://www.lasglowtech.com.ng/careers/apply"
        />

        <div className="brand-card w-full max-w-2xl p-6 sm:p-8 md:p-10 mt-4 shadow-[0_12px_48px_rgba(135,0,255,0.18)]">
          <div className="flex flex-col items-center text-center mb-2">
            <Link to="/" className="flex items-center gap-2 mb-5 hover:opacity-90 transition-opacity">
              <img src={LOGO} alt="Lasglowtech" className="w-9 h-9 object-contain rounded-lg" />
              <span className="font-bold text-base text-textcolor2 tracking-tight">
                Lasglow<span className="text-orange-500">tech</span> Academy
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-textcolor2 tracking-tight">Submit your application</h1>
            <p className="text-sm text-muted mt-2 max-w-md">
              Join our learning program and start building job-ready digital skills.
            </p>
          </div>

          <StepProgress step={step} />

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className={labelClass}>
                    Full name <span className="text-Secondarycolor">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`${authInputCls} px-4 py-3`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-Secondarycolor">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className={`${authInputCls} px-4 py-3`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone <span className="text-Secondarycolor">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+234 ..."
                    className={`${authInputCls} px-4 py-3`}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Profile photo</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setPictureFile(file);
                        if (file) setPicturePreview(URL.createObjectURL(file));
                      }}
                      className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-Primarycolor/30 file:bg-bgcolor file:text-Secondarycolor file:text-sm file:font-medium hover:file:bg-Primarycolor/20"
                    />
                    {picturePreview && (
                      <img
                        src={picturePreview}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-full border-2 border-Primarycolor/40"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-Primarycolor/15">
                <button
                  type="button"
                  disabled
                  className="text-sm font-medium text-muted/50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button type="button" onClick={handleContinue} className="btn-primary px-8 min-w-[120px] justify-center">
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-Secondarycolor transition-colors mb-1"
              >
                <FaArrowLeft className="w-3 h-3" />
                Back to personal info
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="skillInterest" className={labelClass}>
                    Skill track <span className="text-Secondarycolor">*</span>
                  </label>
                  <select
                    id="skillInterest"
                    name="skillInterest"
                    value={form.skillInterest}
                    onChange={handleChange}
                    className={`${authInputCls} px-4 py-3`}
                    required
                  >
                    <option value="">Select a track</option>
                    {skillOptions.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="experienceLevel" className={labelClass}>
                    Experience level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    className={`${authInputCls} px-4 py-3`}
                  >
                    <option value="">Select level</option>
                    {experienceOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="availability" className={labelClass}>
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    className={`${authInputCls} px-4 py-3`}
                  >
                    <option value="">Select availability</option>
                    {availabilityOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`${authInputCls} px-4 py-3`}
                  />
                </div>
                <div>
                  <label htmlFor="country" className={labelClass}>
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`${authInputCls} px-4 py-3`}
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="portfolioUrl" className={labelClass}>
                    Portfolio or LinkedIn
                  </label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    value={form.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className={`${authInputCls} px-4 py-3`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="learningGoal" className={labelClass}>
                    Learning goal <span className="text-Secondarycolor">*</span>
                  </label>
                  <textarea
                    id="learningGoal"
                    name="learningGoal"
                    value={form.learningGoal}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What do you want to learn and why?"
                    className={`${authInputCls} px-4 py-3 resize-y min-h-[100px]`}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-Primarycolor/15">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-muted hover:text-Secondarycolor transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 min-w-[120px] justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting…" : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Careers;
