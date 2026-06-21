/** Shared class names for admin dashboard pages (light theme). */

export const adminSectionHead =
  "px-6 py-5 border-b border-[#8700ff]/10 bg-gradient-to-r from-violet-50/70 via-white to-white";
export const adminSectionTitle = "text-xl font-semibold text-slate-900 tracking-tight";
export const adminSectionDesc = "text-sm text-slate-500 mt-1 leading-relaxed";
export const adminCardBody = "p-6";
export const adminNestedCard = "rounded-2xl border border-slate-200/80 bg-slate-50/40 overflow-hidden";

export const adminLabel = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";
export const adminFieldLabel = "block text-sm font-medium text-slate-700 mb-1.5";

export const adminInput =
  "admin-input w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8700ff]/25 focus:border-[#8700ff]/35 transition-shadow";

export const adminSelect = adminInput;
export const adminTextarea = `${adminInput} resize-y min-h-[88px]`;

export const adminBtnPrimary = "admin-btn-primary";
export const adminBtnSoft = "admin-btn-soft";
export const adminBtnDanger = "admin-btn-danger";
export const adminBtnGhost = "admin-btn-ghost";

export const adminDetailLabel = "text-xs font-semibold uppercase tracking-wider text-slate-400";
export const adminDetailValue = "text-sm font-medium text-slate-800 mt-0.5 break-words";
export const adminMuted = "text-sm text-slate-600 leading-relaxed";
export const adminLink = "text-[#8700ff] font-medium hover:underline break-all";

export const adminTableWrap = "overflow-x-auto";
export const adminTable = "w-full min-w-[640px] text-sm";
export const adminTableHead = "text-left border-b border-slate-200 bg-slate-50/90";
export const adminTableTh = "py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500";
export const adminTableRow = "border-b border-slate-100 hover:bg-violet-50/50 transition-colors";
export const adminTableTd = "py-3 px-4 text-slate-700";
export const adminTableTdMuted = "py-3 px-4 text-slate-500";

export const adminSideNav =
  "sticky top-24 brand-card p-3 space-y-1 border border-[#8700ff]/10";
export const adminSideNavTitle = "text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1.5";
export const adminSideNavBtn =
  "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-[#8700ff] transition-colors";
export const adminSideNavSelect =
  "w-full text-sm rounded-xl border border-slate-200 bg-white text-slate-800 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8700ff]/25";

export const adminEmptyState = "brand-card p-10 text-center";
export const adminEmptyText = "text-sm text-slate-500";

export const adminStatusBadge = {
  new: "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-amber-50 text-amber-800 border-amber-200",
  reviewing:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-blue-50 text-blue-800 border-blue-200",
  accepted:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-800 border-emerald-200",
  waitlist:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-orange-50 text-orange-800 border-orange-200",
  rejected:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-red-50 text-red-700 border-red-200",
  unpaid:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-amber-50 text-amber-800 border-amber-200",
  part_paid:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-orange-50 text-orange-800 border-orange-200",
  paid: "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-800 border-emerald-200",
  waived:
    "inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide bg-blue-50 text-blue-800 border-blue-200",
};
