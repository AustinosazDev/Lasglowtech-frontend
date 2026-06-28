import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import BgPatternOverlay from "./BgPatternOverlay";
import { LOGO } from "./images";
import { SITE_TAGLINE, CONTACT, absoluteUrl } from "../utils/siteConfig";

const yr = new Date().getFullYear();
const cols = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/services", label: "Services" },
      { to: "/projects", label: "Projects" },
      { to: "/blogs", label: "Blog" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/services/web-development", label: "Web development" },
      { to: "/services/mobile-apps", label: "Mobile apps" },
      { to: "/services/ui-ux-design", label: "UI/UX design" },
      { to: "/services/branding", label: "Branding" },
      { to: "/catalogues", label: "Service catalogue" },
    ],
  },
];
const socials = [
  { href: "https://linkedin.com/in/austinosaz", icon: FaLinkedinIn, label: "LinkedIn" },
  { href: "https://twitter.com/OmozemojeAugus1", icon: BsTwitter, label: "Twitter" },
  { href: "https://m.facebook.com/omozemoje.augustineoisasoje", icon: FaFacebookF, label: "Facebook" },
  { href: "https://www.instagram.com/lasglowtech", icon: FaInstagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#120b1f]/90 backdrop-blur-xl border-t border-[#8700ff]/15" aria-labelledby="footer-heading">
      <BgPatternOverlay glow />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#8700ff]/15">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50 rounded-lg">
              <img src={LOGO} alt="Lasglowtech logo" className="w-9 h-9 object-contain" width={36} height={36} loading="lazy" />
              <span id="footer-heading" className="font-bold text-base text-white tracking-tight">
                Lasglow<span className="text-[#8700ff]">tech</span>
              </span>
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500 mb-3">{SITE_TAGLINE}</p>
            <p className="type-muted mb-6 max-w-xs">
              A creative technology company building websites, apps, and digital products for ambitious brands across Nigeria and beyond.
            </p>
            <div className="flex gap-2" role="list" aria-label="Social media">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Lasglowtech on ${label}`}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#8700ff]/10 border border-[#8700ff]/20 text-[#9b8cb5] hover:bg-[#8700ff] hover:text-white hover:border-[#8700ff] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <nav key={col.title} className="lg:col-span-2" aria-label={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50 rounded">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-5">Office</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#8700ff]/10 text-[#8700ff]" aria-hidden>
                  <FaMapMarkerAlt className="w-3.5 h-3.5" />
                </span>
                <address className="not-italic pt-1.5 text-sm text-[#9b8cb5] leading-relaxed">
                  {CONTACT.address.streetAddress}, {CONTACT.address.addressLocality}, {CONTACT.address.addressRegion}, Nigeria
                </address>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#8700ff]/10 text-[#8700ff]" aria-hidden>
                  <FaEnvelope className="w-3.5 h-3.5" />
                </span>
                <a href={`mailto:${CONTACT.email}`} className="pt-1.5 text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors break-all">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#8700ff]/10 text-[#8700ff]" aria-hidden>
                  <FaPhoneAlt className="w-3.5 h-3.5" />
                </span>
                <a href={`tel:${CONTACT.phone}`} className="pt-1.5 text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9b8cb5]">© {yr} Lasglowtech. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link to="/legal/privacy" className="text-[#9b8cb5] hover:text-orange-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/legal/terms" className="text-[#9b8cb5] hover:text-orange-500 transition-colors">
              Terms of Service
            </Link>
            <a href={absoluteUrl("/")} className="text-[#9b8cb5] hover:text-orange-500 transition-colors">
              lasglowtech.com.ng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
