import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaListUl, FaEnvelope, FaRegImages, FaAddressBook, FaUserGraduate, FaMoneyCheckAlt, FaBookOpen, FaPaperPlane, FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import { clearAdminSession, getAdminUser } from "../../utils/adminAuth";

const menu = [
  { to: "/dashboard", label: "Overview", icon: <FaListUl /> },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="admin-dashboard-light min-h-screen bg-white text-textcolor2 overflow-x-hidden">
      {/* Mobile menu button - fixed top-left when sidebar is closed */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          type="button"
          onClick={() => setMobileNavOpen((o) => !o)}
          className="p-2.5 rounded-lg border border-[#8700ff]/35 bg-[#1a1030] text-[#e8ddf8] shadow-md shadow-[#8700ff]/10 hover:bg-[#8700ff]/25 hover:border-[#8700ff]/50 transition"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
        >
          {mobileNavOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile backdrop when nav is open */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeMobileNav}
          aria-hidden
        />
      )}

      <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden">
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-20
            w-72 md:w-72 md:transition-[width] md:duration-200 ease-out
            bg-gradient-to-b from-[#120b1f] via-[#150d24] to-[#1a1030] border-r border-[#8700ff]/30
            shadow-[4px_0_32px_rgba(135,0,255,0.12)] md:shadow-none p-4 md:p-6
            flex flex-col
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${sidebarOpen ? "md:w-72" : "md:w-[4.5rem] md:overflow-hidden"}
          `}
        >
          {/* Toggle button - visible on desktop; in sidebar on mobile */}
          <div className="flex items-center justify-between mb-4 md:mb-2 pb-4 border-b border-[#8700ff]/25">
            {sidebarOpen && (
              <>
                <p className="text-xs font-semibold uppercase tracking-widest text-Secondarycolor truncate">Control center</p>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="hidden md:flex p-2 rounded-lg border border-transparent text-[#9b8cb5] hover:text-white hover:bg-[#8700ff]/30 hover:border-[#8700ff]/40 transition shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
              </>
            )}
            {!sidebarOpen && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden md:flex w-full justify-center p-2 rounded-lg border border-transparent text-[#9b8cb5] hover:text-white hover:bg-[#8700ff]/30 hover:border-[#8700ff]/40 transition"
                aria-label="Expand sidebar"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {sidebarOpen && (
            <>
              <h2 className="text-lg font-semibold text-white mt-1 truncate">Lasglow Admin</h2>
              <p className="text-sm text-[#9b8cb5] mt-0.5 truncate">{admin?.email || "Administrator"}</p>
            </>
          )}

          <nav className="mt-5 md:mt-6 space-y-1 flex-1">
            {menu.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileNav}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border transition-colors ${
                    active
                      ? "bg-[#8700ff]/45 text-white border-[#8700ff]/60 font-medium shadow-[0_0_20px_rgba(135,0,255,0.2)]"
                      : "text-[#c4b5dc] border-transparent hover:text-white hover:bg-[#8700ff]/15 hover:border-[#8700ff]/25"
                  } ${!sidebarOpen ? "justify-center md:justify-center" : ""}`}
                >
                  <span className="flex-shrink-0 w-5 flex items-center justify-center">{item.icon}</span>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {sidebarOpen && (
            <button
              onClick={() => {
                clearAdminSession();
                navigate("/admin/login", { replace: true });
              }}
              className="mt-6 w-full px-4 py-3 rounded-xl border border-red-400/45 text-red-200 bg-red-500/10 hover:bg-red-500/20 font-medium transition-colors"
            >
              Logout
            </button>
          )}
          {!sidebarOpen && (
            <button
              onClick={() => {
                clearAdminSession();
                navigate("/admin/login", { replace: true });
              }}
              className="mt-6 w-full flex justify-center p-3 rounded-xl border border-red-400/45 text-red-200 bg-red-500/10 hover:bg-red-500/20 transition"
              title="Logout"
              aria-label="Logout"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          )}
        </aside>

        <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden pt-16 md:pt-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

