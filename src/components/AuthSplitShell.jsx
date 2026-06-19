/**
 * Shared layout for /auth/login and /auth/register: left image carousel (lg+), right column with
 * brand gradient atmosphere (matches admin login) and scrollable content slot.
 * @param {"center"|"start"} [contentAlign="center"] — `start` top-aligns the form (better for tall register flows).
 */
export default function AuthSplitShell({ slides, slideIdx, children, contentAlign = "center" }) {
  const scrollAlign =
    contentAlign === "start"
      ? "justify-start py-3 sm:py-4"
      : "justify-center py-5 sm:py-6";
  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-gradient-to-br from-bgcolor2 via-bgcolor to-bgcolor">
      {/* Left image panel */}
      <div className="hidden lg:block relative min-h-0 h-full overflow-hidden bg-bgcolor">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === slideIdx ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bgcolor via-bgcolor/50 to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
              <h2 className="text-white mb-2">{s.title}</h2>
              <p className="text-muted text-sm leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-10 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${i === slideIdx ? "w-6 bg-Secondarycolor" : "w-2 bg-Primarycolor/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Right: brand glows + content */}
      <div className="relative flex min-h-[100dvh] lg:min-h-0 lg:h-full flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute top-[-80px] right-[-40px] w-[min(420px,85vw)] h-[min(420px,85vw)] rounded-full bg-Primarycolor1 opacity-[0.12] blur-[90px]" />
          <div className="absolute bottom-[-50px] left-[-30px] w-[min(340px,70vw)] h-[min(340px,70vw)] rounded-full bg-Primarycolor opacity-[0.09] blur-[85px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,100%)] h-[min(520px,90vw)] max-h-[600px] rounded-full bg-Secondarycolor opacity-[0.045] blur-[100px]" />
        </div>
        <div
          className={`relative z-10 w-full px-4 sm:px-8 md:px-10 overflow-y-auto overscroll-contain flex flex-col min-h-0 flex-1 ${scrollAlign}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
