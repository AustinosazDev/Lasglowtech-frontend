import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { LOGO } from "./images";
import { clearSession, getUser, isAuthenticated } from "../utils/auth";
import servicePillars from "../assets/data/servicePillars";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const authed = isAuthenticated();
  const user = getUser();
  const role = user?.role || "client";

  const links = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/blogs" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
    ...(authed && role === "client" ? [{ label: "Catalogues", to: "/catalogues" }] : []),
  ];

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50 rounded ${
      isActive ? "text-orange-500" : "text-[#c4b3d8] hover:text-white"
    } after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-orange-500 after:transition-all ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <>
      <header>
        <nav
          aria-label="Main navigation"
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
            scrolled
              ? "py-3 bg-[#120b1f]/85 backdrop-blur-2xl border-b border-[#8700ff]/10 shadow-lg shadow-black/20"
              : "py-5 bg-transparent"
          }`}
        >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8700ff]/50 rounded-lg">
            <img src={LOGO} alt="Lasglowtech logo" className="w-9 h-9 object-contain" width={36} height={36} />
            <span className="font-bold text-base text-white tracking-tight">
              Lasglow<span className="text-[#8700ff]">tech</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
            <div className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}>
              <button
                className="flex items-center gap-1 text-sm font-semibold text-[#c4b3d8] hover:text-white transition-colors"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen(p => !p)}
              >
                Services <FiChevronDown className={`w-3 h-3 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 top-full z-50 w-72 pt-2">
                <div className="rounded-xl border border-[#8700ff]/30 bg-[#1a1030] shadow-2xl shadow-[#8700ff]/20 overflow-hidden">
                  {servicePillars.map((pillar) => (
                    <Link key={pillar.id} to={pillar.link} onClick={() => setServicesOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold text-[#e8ddf8] hover:bg-[#8700ff]/15 transition-all border-b border-[#8700ff]/15 last:border-b-0">
                      {pillar.title} →
                    </Link>
                  ))}
                  <Link to="/services" onClick={() => setServicesOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-[#8700ff] hover:bg-[#8700ff]/15 transition-all border-t border-[#8700ff]/15">
                    View all services →
                  </Link>
                </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
           

            {!authed && (
              <>
               
                <Link to="/auth/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}

            {authed && (
              <div className="relative">
                <button onClick={() => setAcctOpen(p => !p)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[#8700ff]/40 text-white rounded-full hover:bg-[#8700ff]/15 transition-all">
                  {user?.username || "Account"} <FiChevronDown className={`w-3 h-3 transition-transform ${acctOpen ? "rotate-180" : ""}`} />
                </button>
                {acctOpen && (
                  <div className="absolute right-0 top-full z-50 w-52 pt-2">
                  <div className="rounded-xl border border-[#8700ff]/30 bg-[#1a1030] shadow-2xl shadow-[#8700ff]/20 overflow-hidden">
                    {role === "client" && <Link to="/client/dashboard" onClick={() => setAcctOpen(false)} className="block px-4 py-3 text-sm text-[#e8ddf8] hover:bg-[#8700ff]/15 transition-all">Client Dashboard</Link>}
                    {["learner","student","talent"].includes(role) && <Link to="/careers/dashboard" onClick={() => setAcctOpen(false)} className="block px-4 py-3 text-sm text-[#e8ddf8] hover:bg-[#8700ff]/15 transition-all">Learner Dashboard</Link>}
                    <button onClick={() => { clearSession(); window.location.href = "/"; }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all">Logout</button>
                  </div>
                  </div>
                )}
              </div>
            )}

            
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center text-white" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-nav">
              {open ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div id="mobile-nav" className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#1a1030] border-l border-[#8700ff]/20 transition-transform duration-300 shadow-2xl ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="pt-20 px-5 flex flex-col gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) => `py-3 px-4 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-[#8700ff]/20 text-orange-500" : "text-[#c4b3d8] hover:bg-[#8700ff]/10 hover:text-white"}`}>
                {l.label}
              </NavLink>
            ))}
            <div>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#c4b3d8] hover:bg-[#8700ff]/10 hover:text-white transition-all flex items-center justify-between"
                aria-expanded={servicesOpen}
              >
                Services <FiChevronDown className={`w-3 h-3 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {servicePillars.map((pillar) => (
                    <Link key={pillar.id} to={pillar.link} onClick={() => { setOpen(false); setServicesOpen(false); }}
                      className="py-2 px-4 rounded-lg text-sm font-semibold text-[#c4b3d8] hover:bg-[#8700ff]/10 hover:text-white transition-all">
                      {pillar.title} →
                    </Link>
                  ))}
                  <Link to="/services" onClick={() => { setOpen(false); setServicesOpen(false); }}
                    className="py-2 px-4 rounded-lg text-sm font-semibold text-[#8700ff] hover:bg-[#8700ff]/10 transition-all">
                    View all services →
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-[#8700ff]/20 flex flex-col gap-2">
              {!authed ? (
                <>
                  <NavLink to="/auth/login" onClick={() => setOpen(false)} className="py-3 px-4 rounded-xl text-sm font-semibold text-[#c4b3d8] hover:bg-[#8700ff]/10 transition-all">Login</NavLink>
                  <Link to="/auth/register" onClick={() => setOpen(false)} className="btn-primary justify-center">Sign Up</Link>
                </>
              ) : (
                <button onClick={() => { clearSession(); window.location.href = "/"; }} className="py-3 px-4 rounded-xl text-sm text-red-400 hover:bg-red-500/10 text-left">Logout</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

