import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaListUl,
  FaEnvelope,
  FaRegImages,
  FaAddressBook,
  FaUserGraduate,
  FaMoneyCheckAlt,
  FaBookOpen,
  FaPaperPlane,
  FaBriefcase,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { clearAdminSession, getAdminUser } from "../../utils/adminAuth";

const menu = [
  { to: "/dashboard", label: "Overview", icon: <FaListUl /> },
  { to: "/dashboard/projects", label: "Projects", icon: <FaBriefcase /> },
  { to: "/dashboard/catalogues", label: "Catalogues", icon: <FaRegImages /> },
  { to: "/dashboard/createblog", label: "Create Blog", icon: <FaPlus /> },
  { to: "/dashboard/updateblog", label: "Update Blog", icon: <FaPlus /> },
  { to: "/dashboard/bloglist", label: "Blog Lists", icon: <FaListUl /> },
  { to: "/dashboard/subscriptions", label: "Subscribers", icon: <FaEnvelope /> },
  { to: "/dashboard/contacts", label: "Contacts", icon: <FaAddressBook /> },
  { to: "/dashboard/careers", label: "Careers", icon: <FaUserGraduate /> },
  { to: "/dashboard/lms", label: "LMS Courses", icon: <FaBookOpen /> },
  { to: "/dashboard/orders", label: "Orders", icon: <FaMoneyCheckAlt /> },
  { to: "/dashboard/bulk-email", label: "Bulk Email", icon: <FaPaperPlane /> },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = getAdminUser();
  const profileRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const adminName = admin?.username || admin?.name || "Admin";
  const adminEmail = admin?.email || "Administrator";
  const adminInitial = String(adminName).charAt(0).toUpperCase() || "A";

  const pageTitle = useMemo(() => {
    const match = menu.find((item) => item.to === location.pathname);
    return match?.label || "Admin dashboard";
  }, [location.pathname]);

  const closeMobileNav = () => setMobileNavOpen(false);

  const handleLogout = () => {
    clearAdminSession();
    setProfileOpen(false);
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

  return (
    <div className="admin-dashboard-light min-h-screen bg-white text-textcolor2 flex overflow-x-hidden">
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={closeMobileNav}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-[100dvh] flex-col border-r border-[#8700ff]/30 bg-gradient-to-b from-[#120b1f] via-[#150d24] to-[#1a1030] shadow-[4px_0_40px_rgba(135,0,255,0.2)] transition-all duration-300 ease-out overflow-hidden md:relative md:z-auto md:h-auto md:min-h-[100dvh] md:flex-shrink-0 ${
          mobileNavOpen
            ? "translate-x-0 w-72 max-w-[85vw]"
            : "-translate-x-full pointer-events-none w-72 max-w-[85vw] md:translate-x-0 md:pointer-events-auto"
        } ${sidebarOpen ? "md:w-72" : "md:w-0 md:border-r-0 md:shadow-none"}`}
        aria-hidden={!mobileNavOpen && typeof window !== "undefined" && window.innerWidth < 768}
      >
        <div className="w-72 max-w-[85vw] h-full flex flex-col flex-shrink-0 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#8700ff]/25">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-Secondarycolor">Control center</p>
              <h2 className="text-base font-semibold text-white mt-1 truncate">Lasglow Admin</h2>
            </div>
            <button
              type="button"
              onClick={closeMobileNav}
              className="md:hidden p-2 rounded-lg text-[#9b8cb5] hover:text-white hover:bg-[#8700ff]/30 transition-colors"
              aria-label="Close menu"
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="hidden md:flex p-2 rounded-lg text-[#9b8cb5] hover:text-white hover:bg-[#8700ff]/30 transition-colors shrink-0"
              aria-label="Collapse sidebar"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="mt-5 space-y-1 flex-1 overflow-y-auto pr-1">
            {menu.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileNav}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border transition-colors ${
                    active
                      ? "bg-[#8700ff]/45 text-white border-[#8700ff]/60 shadow-[0_0_20px_rgba(135,0,255,0.25)]"
                      : "text-[#c4b5dc] border-transparent hover:text-white hover:bg-[#8700ff]/15 hover:border-[#8700ff]/25"
                  }`}
                >
                  <span className="flex-shrink-0 w-5 flex items-center justify-center">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 w-full min-w-0 flex flex-col min-h-[100dvh] bg-slate-50/80">
        <header className="sticky top-0 z-30 border-b border-[#8700ff]/12 bg-white/95 backdrop-blur-sm px-4 md:px-8 py-3 md:py-3.5 shadow-sm shadow-violet-100/40">
          <div className="flex items-center justify-between gap-3 max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setMobileNavOpen((open) => !open);
                  } else {
                    setSidebarOpen((open) => !open);
                  }
                }}
                className="admin-dash-btn-soft flex-shrink-0 !px-2.5 !py-2.5"
                aria-label={sidebarOpen || mobileNavOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <FaBars className="w-4 h-4" />
              </button>
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="hidden md:inline-flex admin-dash-btn-ghost !px-2.5 !py-2.5"
                  aria-label="Expand sidebar"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              )}
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-semibold text-slate-900 truncate">{pageTitle}</h1>
                <p className="text-xs text-slate-500 truncate hidden sm:block">Lasglowtech admin dashboard</p>
              </div>
            </div>

            <div className="relative flex-shrink-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-[#8700ff]/35 bg-violet-100 flex items-center justify-center text-base font-semibold text-[#8700ff] hover:ring-2 hover:ring-[#8700ff]/25 transition-shadow"
                aria-label="Admin profile menu"
                aria-expanded={profileOpen}
              >
                <span>{adminInitial}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-56 rounded-xl border border-[#8700ff]/20 bg-white shadow-[0_12px_40px_rgba(135,0,255,0.18)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-violet-50/50">
                    <p className="text-sm font-semibold text-slate-900 truncate">{adminName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{adminEmail}</p>
                    <p className="text-xs text-[#8700ff] font-medium mt-2">Administrator</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-violet-50 transition-colors"
                  >
                    <FaUserShield className="w-4 h-4 text-[#8700ff]" />
                    Dashboard home
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden max-w-[1600px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
