import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { LOGO } from "./images";

const yr = new Date().getFullYear();
const cols = [
  { title: "Navigate", links: [{ to:"/", label:"Home" },{ to:"/about", label:"About" },{ to:"/services", label:"Services" },{ to:"/portfolio", label:"Portfolio" },{ to:"/blogs", label:"Blog" },{ to:"/contact", label:"Contact" }] },
  { title: "Products",  links: [{ to:"/catalogues", label:"Service catalogue" },{ to:"/careers", label:"Tutoring & training" },{ to:"/services/web-development", label:"Web development" },{ to:"/services/mobile-apps", label:"Mobile apps" },{ to:"/services/ui-ux-design", label:"UI/UX design" }] },
];
const socials = [
  { href:"https://linkedin.com/in/austinosaz", icon:FaLinkedinIn, label:"LinkedIn" },
  { href:"https://twitter.com/OmozemojeAugus1", icon:BsTwitter, label:"Twitter" },
  { href:"https://m.facebook.com/omozemoje.augustineoisasoje", icon:FaFacebookF, label:"Facebook" },
  { href:"https://www.instagram.com/lasglowtech", icon:FaInstagram, label:"Instagram" },
];

export default function Footer() {

  return (
    <footer className="bg-[#120b1f]/80 backdrop-blur-xl border-t border-[#8700ff]/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#8700ff]/15">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={LOGO} alt="Lasglowtech" className="w-9 h-9 object-contain" />
              <span className="font-extrabold text-lg text-white tracking-tight">Lasglow<span className="text-orange-500">tech</span></span>
            </Link>
            <p className="text-sm text-[#9b8cb5] leading-relaxed mb-6 max-w-xs">
              Nigeria's trusted web development and tech tutoring company. Building the digital future of Nigerian businesses since 2021.
            </p>
            <div className="flex gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#8700ff]/10 border border-[#8700ff]/20 text-[#9b8cb5] hover:bg-[#8700ff] hover:text-white hover:border-[#8700ff] transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h5 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-5">{col.title}</h5>
              <ul className="space-y-3">
                {col.links.map(({ to, label }) => (
                  <li key={to}><Link to={to} className="text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-5">Contact</h5>
            <ul className="space-y-4">
              {[
                { Icon: FaEnvelope, el: <a href="mailto:lasglowtech@gmail.com" className="text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors break-all">lasglowtech@gmail.com</a> },
                { Icon: FaPhoneAlt, el: <a href="tel:+2349031821590" className="text-sm text-[#9b8cb5] hover:text-orange-500 transition-colors">+234 903 182 1590</a> },
                { Icon: FaMapMarkerAlt, el: <span className="text-sm text-[#9b8cb5]">Gwarinpa, FCT Abuja</span> },
              ].map(({ Icon, el }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#8700ff]/10 text-[#8700ff]">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="pt-1">{el}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9b8cb5]">© {yr} Lasglowtech. All rights reserved.</p>
          <span className="text-sm text-[#9b8cb5]">Built with ❤️ in Nigeria</span>
        </div>
      </div>
    </footer>
  );
}

