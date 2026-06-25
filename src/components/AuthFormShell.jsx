import CircularBackButton from "./CircularBackButton";
import BgPatternOverlay from "./BgPatternOverlay";

/**
 * Centered auth card — matches admin login atmosphere with top back control.
 */
export default function AuthFormShell({
  children,
  backTo = "/",
  onBack,
  maxWidth = "max-w-md",
}) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10 overflow-hidden text-textcolor2 bg-gradient-to-br from-bgcolor2 via-bgcolor to-bgcolor">
      <BgPatternOverlay glow />

      <div
        className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-4 sm:py-5"
        aria-label="Navigation"
      >
        {onBack ? (
          <CircularBackButton onClick={onBack} className="!static" />
        ) : (
          <CircularBackButton to={backTo} className="!static" />
        )}
      </div>

      <div
        className="absolute top-[-100px] right-[-60px] w-[min(520px,90vw)] h-[min(520px,90vw)] rounded-full bg-Primarycolor1 opacity-[0.14] blur-[100px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-[-80px] left-[-40px] w-[min(400px,75vw)] h-[min(400px,75vw)] rounded-full bg-Primarycolor opacity-[0.1] blur-[95px] pointer-events-none"
        aria-hidden
      />

      <div className={`brand-card w-full ${maxWidth} p-7 sm:p-8 md:p-9 relative z-10 mt-6 shadow-[0_12px_48px_rgba(135,0,255,0.18)]`}>
        {children}
      </div>
    </div>
  );
}

export const authInputCls =
  "w-full rounded-xl bg-bgcolor border border-Primarycolor/25 text-textcolor2 placeholder-muted text-sm font-semibold focus:outline-none focus:border-Primarycolor focus:ring-1 focus:ring-Primarycolor/40 transition-all";
