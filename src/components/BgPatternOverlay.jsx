import { HeroImage } from "./images";

export default function BgPatternOverlay({ glow = false, className = "" }) {
  return (
    <>
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center opacity-[0.06] pointer-events-none ${className}`}
        style={{ backgroundImage: `url(${HeroImage})` }}
        aria-hidden
      />
      {glow && (
        <>
          <div
            className="absolute top-[-120px] right-[-80px] w-[520px] h-[520px] rounded-full bg-primary1 opacity-[0.12] blur-[100px] pointer-events-none z-0"
            aria-hidden
          />
          <div
            className="absolute bottom-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full bg-[#8700ff] opacity-[0.07] blur-[90px] pointer-events-none z-0"
            aria-hidden
          />
        </>
      )}
    </>
  );
}
