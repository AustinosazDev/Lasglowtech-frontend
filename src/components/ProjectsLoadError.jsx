import React from "react";
import { FaRedo } from "react-icons/fa";

const SearchEmptyIllustration = () => (
  <svg
    viewBox="0 0 120 120"
    className="h-28 w-28"
    aria-hidden
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="52" cy="52" r="28" fill="#E8F4FF" stroke="#7C3AED" strokeWidth="4" />
    <circle cx="52" cy="52" r="18" fill="#BFDBFE" opacity="0.85" />
    <path
      d="M72 72L92 92"
      stroke="#7C3AED"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M34 78C28 70 24 60 24 50C24 32 38 18 56 18C74 18 88 32 88 50"
      stroke="#A78BFA"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.45"
    />
    <ellipse cx="40" cy="88" rx="10" ry="6" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
    <ellipse cx="80" cy="88" rx="10" ry="6" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
  </svg>
);

/**
 * Light empty-state card (reference-style): illustration, title, two lines, CTA.
 */
export function ProjectsLoadError({ onRetry }) {
  return (
    <div className="col-span-full flex justify-center py-10 md:py-14 px-4">
      <div className="w-full max-w-md rounded-3xl bg-[#f4f5f7] px-8 py-10 sm:px-10 sm:py-12 text-center shadow-xl shadow-black/10">
        <div className="mb-6 flex justify-center">
          <SearchEmptyIllustration />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
          Could not load projects
        </h3>

        <p className="mt-4 text-sm sm:text-[0.9375rem] leading-relaxed text-[#6b7280]">
          We were unable to load the project gallery at this time.
        </p>
        <p className="mt-1 text-sm sm:text-[0.9375rem] leading-relaxed text-[#6b7280]">
          Please check your connection and try again shortly.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#8700ff] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#8700ff]/30 transition hover:bg-[#7c3aed] active:scale-[0.98]"
        >
          <FaRedo className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}

export default ProjectsLoadError;
