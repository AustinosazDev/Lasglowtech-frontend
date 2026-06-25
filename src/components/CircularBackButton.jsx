import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getBackFallback } from "../utils/backNavigation";

const baseClass =
  "inline-flex items-center justify-center w-10 h-10 rounded-full bg-bgcolor2/95 backdrop-blur-sm border border-Primarycolor/30 text-textcolor2 shadow-lg shadow-black/25 hover:bg-Primarycolor/15 hover:border-Primarycolor/50 hover:text-Secondarycolor transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-Primarycolor/50";

export default function CircularBackButton({
  to,
  onClick,
  fallback,
  fixed = false,
  className = "",
  topClassName = "top-4 sm:top-5",
  ariaLabel = "Go back",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      navigate(to);
      return;
    }
    const resolvedFallback = fallback ?? getBackFallback(window.location.pathname);
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(resolvedFallback);
  };

  const positionClass = fixed ? `fixed z-[70] left-4 sm:left-6 ${topClassName}` : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${baseClass} ${positionClass} ${className}`.trim()}
    >
      <FaArrowLeft className="w-3.5 h-3.5" />
    </button>
  );
}
