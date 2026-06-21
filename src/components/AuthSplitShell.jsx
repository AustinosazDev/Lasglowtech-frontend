import { Link } from "react-router-dom";
import BgPatternOverlay from "./BgPatternOverlay";
import { LOGO } from "./images";

/**
 * Centered auth layout — dark brand background, pattern overlay, glass card slot.
 */
export default function AuthSplitShell({ children, contentAlign = "center" }) {
  const alignClass =
    contentAlign === "start"
      ? "justify-start py-6 sm:py-8"
      : "justify-center py-8 sm:py-10";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#120b1f] text-[#e8ddf8]">
      <BgPatternOverlay glow />

      <div
        className={`relative z-10 flex min-h-[100dvh] flex-col items-center ${alignClass} px-4 sm:px-6`}
      >
        <Link
          to="/"
          className="mb-6 flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity"
        >
          <img src={LOGO} alt="Lasglowtech" className="w-9 h-9 object-contain" />
          <span className="font-bold text-base text-white tracking-tight">
            Lasglow<span className="text-orange-500">tech</span>
          </span>
        </Link>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
