import { Link } from "react-router-dom";
import SEO from "../utils/seo";

/**
 * Shared layout for Terms of Service & Privacy Policy (matches auth dark theme).
 */
export function LegalDocumentShell({ title, description, path, children }) {
  const siteUrl = "https://lasglowtech.com.ng";
  const url = `${siteUrl}${path}`;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#120b1f] via-[#1a1030] to-[#120b1f] text-[#e8ddf8]">
      <SEO title={`${title} | Lasglowtech`} description={description} url={url} />
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-14 pb-16">
        <h1 className="text-white">{title}</h1>
        <p className="text-xs text-[#9b8cb5] mt-2 mb-10">
          Last updated: <time dateTime="2026-06-25">25 June 2026</time>
        </p>
        <article className="legal-prose border-t border-[#8700ff]/20 pt-8">
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
