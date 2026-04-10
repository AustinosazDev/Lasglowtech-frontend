import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import SEO from "../utils/seo";

/**
 * Shared layout for Terms of Service & Privacy Policy (matches auth dark theme).
 */
export function LegalDocumentShell({ title, description, path, children }) {
  const siteUrl = "https://www.lasglowtech.com.ng";
  const url = `${siteUrl}${path}`;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#120b1f] via-[#1a1030] to-[#120b1f] text-[#e8ddf8]">
      <SEO title={`${title} | Lasglowtech`} description={description} url={url} />
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-14 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#9b8cb5] hover:text-[#f97316] text-sm font-semibold mb-8 transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to site
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-xs text-[#9b8cb5] mt-2 mb-10">
          Last updated: <time dateTime="2026-04-10">10 April 2026</time>
        </p>
        <article className="space-y-8 text-sm text-[#c4b5dc] leading-relaxed border-t border-[#8700ff]/20 pt-8">
          {children}
        </article>
        <p className="mt-12 pt-8 border-t border-[#8700ff]/15 text-xs text-[#9b8cb5]">
          Questions?{" "}
          <Link to="/contact" className="text-[#8700ff] hover:text-[#f97316] font-medium">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
