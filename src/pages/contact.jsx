import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FaqSection from "../components/Faq";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLinkedin, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const SITE_URL = "https://www.lasglowtech.com.ng";

const socials = [
  { href:"https://linkedin.com/in/austinosaz", Icon:FaLinkedin, label:"LinkedIn" },
  { href:"https://www.instagram.com/lasglowtech", Icon:FaInstagram, label:"Instagram" },
  { href:"https://m.facebook.com/omozemoje.augustineoisasoje", Icon:FaFacebookF, label:"Facebook" },
  { href:"https://twitter.com/OmozemojeAugus1", Icon:FaTwitter, label:"Twitter" },
];

const inputCls = "w-full px-4 py-3.5 rounded-xl bg-[#120b1f] border border-[#8700ff]/25 text-white placeholder-[#9b8cb5] text-sm font-semibold focus:outline-none focus:border-[#8700ff] focus:ring-1 focus:ring-[#8700ff]/40 transition-all";

export default function Contact() {
  const [formData, setFormData] = useState({ firstName:"", lastName:"", email:"", subject:"", message:"" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post("/contacts", formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ firstName:"", lastName:"", email:"", subject:"", message:"" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Contact Us | Lasglowtech – Get in Touch"
        description="Contact Lasglowtech for web development, mobile apps, UI/UX design, and IT services in Nigeria. Email lasglowtech@gmail.com or call +234 903 182 1590. Gwarinpa, Abuja."
        keywords="contact Lasglowtech, web development Abuja, digital agency contact, Lasglowtech email, Lasglowtech phone"
        url={`${SITE_URL}/contact`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#8700ff] opacity-[0.08] blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="section-tag justify-center"><span className="dot-live"/>Contact us</span>
          <h1 className="text-white mb-5">Let's build something great</h1>
          <p className="type-lead text-[#9b8cb5] mb-8">Have a project in mind or need support? We'd love to hear from you. Reach out and we'll get back within 24 hours.</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-[#9b8cb5]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-orange-500">Contact</span>
          </nav>
        </div>
      </section>

      {/* Contact grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="brand-card p-7">
              <h3 className="text-white mb-5">Get in touch</h3>
              <ul className="space-y-5">
                {[
                  { Icon:FaEnvelope, el:<a href="mailto:lasglowtech@gmail.com" className="text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors break-all">lasglowtech@gmail.com</a> },
                  { Icon:FaPhoneAlt, el:<a href="tel:+2349031821590" className="text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors">+234 903 182 1590</a> },
                  { Icon:FaMapMarkerAlt, el:<span className="text-sm text-[#9b8cb5]">Gwarinpa, FCT Abuja, Nigeria</span> },
                ].map(({ Icon, el }, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-9 h-9 flex-shrink-0 rounded-xl bg-[#8700ff]/12 border border-[#8700ff]/25 flex items-center justify-center text-[#8700ff]">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="pt-1.5">{el}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="brand-card p-7">
              <p className="font-bold text-white mb-4">Follow us</p>
              <div className="flex gap-2.5">
                {socials.map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#8700ff]/10 border border-[#8700ff]/20 text-[#9b8cb5] hover:bg-[#8700ff] hover:text-white hover:border-[#8700ff] transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/2349031821590?text=Hi%20Lasglowtech%2C%20I%27d%20like%20to%20enquire%20about%20your%20services"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 brand-card p-5 group hover:border-[#25D366]/40">
              <span className="w-11 h-11 rounded-xl bg-[#25D366]/12 flex items-center justify-center text-2xl flex-shrink-0">💬</span>
              <div>
                <p className="font-bold text-sm text-white group-hover:text-[#25D366] transition-colors">Chat on WhatsApp</p>
                <p className="text-xs text-[#9b8cb5]">Quick response guaranteed</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="brand-card p-7 md:p-10">
              <h3 className="text-white mb-2">Send us a message</h3>
              <p className="type-muted mb-7">Fill in the form and we'll respond within one business day.</p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">First name</label>
                    <input id="firstName" name="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleChange} className={inputCls} required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Last name</label>
                    <input id="lastName" name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange} className={inputCls} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Email address</label>
                  <input id="email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} className={inputCls} required />
                </div>
                <div>
                  <label htmlFor="subject" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Subject</label>
                  <input id="subject" name="subject" type="text" placeholder="What's this about?" value={formData.subject} onChange={handleChange} className={inputCls} required />
                </div>
                <div>
                  <label htmlFor="message" className="text-xs font-bold text-[#9b8cb5] uppercase tracking-wider mb-2 block">Message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Tell us about your project..." value={formData.message} onChange={handleChange} className={`${inputCls} resize-y min-h-[120px]`} required />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Sending…" : "Send Message →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}

