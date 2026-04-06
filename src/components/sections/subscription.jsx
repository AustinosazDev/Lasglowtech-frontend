import { useState } from "react";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import { useNavigate } from "react-router-dom";

export default function Subscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post("/subscribe", { email });
      toast.success("Successfully subscribed!");
      setEmail("");
      navigate("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-[#120b1f] border-t border-[#8700ff]/15">
      {/* Glows */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[700px] h-[200px] bg-[#8700ff] opacity-[0.08] blur-[80px] pointer-events-none" />
      <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-orange-500 opacity-[0.05] blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <span className="section-tag justify-center"><span className="dot-live" />Stay in the loop</span>
        <h2 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight mb-4">
          Get weekly tech tips & updates
        </h2>
        <p className="text-[#9b8cb5] mb-8 leading-relaxed">
          Join 500+ Nigerian business owners and developers who get our newsletter — practical tips, service launches, and industry insights every week.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address" required
            className="flex-1 px-5 py-3.5 rounded-full brand-card text-white placeholder-[#9b8cb5] text-sm font-semibold focus:outline-none focus:border-[#8700ff] transition-colors"
          />
          <button type="submit" disabled={loading}
            className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Sending…" : "Subscribe →"}
          </button>
        </form>

        <p className="mt-4 text-xs text-[#9b8cb5]">No spam. Unsubscribe anytime. We respect your inbox.</p>
      </div>
    </section>
  );
}


