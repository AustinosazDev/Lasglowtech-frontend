import { useEffect, useState } from "react";
import { LOGO } from "./images";

export default function SiteLoader() {
  const [fade, setFade] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const done = () => { setFade(true); setTimeout(() => setGone(true), 600); };
    if (document.readyState === "complete") done();
    else { window.addEventListener("load", done); return () => window.removeEventListener("load", done); }
  }, []);

  if (gone) return null;

  return (
    <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#120b1f] transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
      {/* Glow ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-[#8700ff] opacity-20 blur-2xl scale-150 animate-pulse" />
        <img src={LOGO} alt="Lasglowtech" className="relative w-20 h-20 object-contain" />
      </div>
      <p className="text-sm font-bold tracking-widest text-[#9b8cb5] uppercase mb-6">Lasglowtech</p>
      {/* Brand-colored bar spinner */}
      <div className="flex gap-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className="w-1.5 h-6 rounded-full animate-pulse"
            style={{ background: i % 2 === 0 ? "#8700ff" : "rgb(249, 115, 22)", animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

