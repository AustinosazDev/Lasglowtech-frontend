import React, { useMemo } from "react";
import { FaExternalLinkAlt, FaPlay } from "react-icons/fa";
import { resolveVideoEmbed } from "../utils/videoEmbed";

const PROVIDER_LABELS = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  dailymotion: "Dailymotion",
  loom: "Loom",
  wistia: "Wistia",
  "google-drive": "Google Drive",
  streamable: "Streamable",
  file: "Video file",
  embed: "Embedded video",
  external: "External video",
};

const withEmbedOrigin = (src) => {
  if (!src || typeof window === "undefined") return src;
  try {
    const parsed = new URL(src);
    if (!parsed.hostname.includes("youtube")) return src;
    parsed.searchParams.set("origin", window.location.origin);
    return parsed.toString();
  } catch {
    return src;
  }
};

const ModuleVideoEmbed = ({ url = "", title = "Lesson video", baseApiUrl = "" }) => {
  const embed = useMemo(() => resolveVideoEmbed(url, baseApiUrl), [url, baseApiUrl]);

  if (!embed) return null;

  const providerLabel = PROVIDER_LABELS[embed.provider] || "Video";

  return (
    <div className="brand-card p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Video – watch without leaving the site
      </p>

      {embed.type === "iframe" && (
        <div className="w-full rounded-lg overflow-hidden bg-black aspect-video border border-slate-200/80">
          <iframe
            src={withEmbedOrigin(embed.src)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      )}

      {embed.type === "video" && (
        <video
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-lg bg-black aspect-video border border-slate-200/80"
          src={embed.src}
        >
          <source src={embed.src} />
          Your browser does not support embedded video playback.
        </video>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <span>{providerLabel}</span>
        <a
          href={embed.openUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-violet-700 hover:text-violet-900 font-medium"
        >
          {embed.type === "link" ? (
            <>
              <FaPlay className="w-3 h-3" /> Watch video (opens in new tab)
            </>
          ) : (
            <>
              <FaExternalLinkAlt className="w-3 h-3" /> Open in new tab if the player does not load
            </>
          )}
        </a>
      </div>

      {embed.provider === "youtube" && (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          If you see “Video unavailable”, the owner may have disabled embedding — use “Open in new tab” or try a
          direct MP4 link instead.
        </p>
      )}
    </div>
  );
};

export default ModuleVideoEmbed;
