import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#120b1f] flex flex-col items-center justify-center px-6 text-center">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-[#8700ff] opacity-[0.07] blur-[100px] rounded-full" />
      </div>
      <p className="font-extrabold text-[9rem] md:text-[14rem] leading-none text-[#8700ff]/10 select-none">404</p>
      <div className="relative -mt-8">
        <span className="section-tag justify-center"><span className="dot-live"/>Page not found</span>
        <h1 className="text-white mt-2 mb-4">Wrong route</h1>
        <p className="type-muted max-w-md mx-auto mb-8">
          This page doesn't exist or may have moved. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    </div>
  );
}

