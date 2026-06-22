const DIRECT_VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v|mkv)(\?|#|$)/i;

const resolveAbsoluteUrl = (url = "", baseApiUrl = "") => {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = String(baseApiUrl || "").replace(/\/$/, "");
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  return `${base}/${trimmed}`;
};

const parseYouTubeId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (!host.includes("youtube.com") && host !== "youtu.be" && !host.includes("youtube-nocookie.com")) {
      return null;
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    const path = parsed.pathname;
    if (path.startsWith("/embed/") || path.startsWith("/v/")) {
      const id = path.split("/")[2];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (path.startsWith("/shorts/") || path.startsWith("/live/")) {
      const id = path.split("/")[2];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    const fromQuery = parsed.searchParams.get("v");
    return fromQuery && /^[a-zA-Z0-9_-]{11}$/.test(fromQuery) ? fromQuery : null;
  } catch {
    const watchMatch = url.match(/(?:youtube\.com\/watch\?(?:[^&]*&)*v=)([a-zA-Z0-9_-]{11})/i);
    if (watchMatch) return watchMatch[1];
    const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (shortMatch) return shortMatch[1];
    const embedMatch = url.match(/(?:youtube\.com\/(?:embed|shorts|live|v)\/)([a-zA-Z0-9_-]{11})/i);
    if (embedMatch) return embedMatch[1];
    return null;
  }
};

const parseVimeoId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (!host.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const videoIndex = parts[0] === "video" ? 1 : 0;
    const id = parts[videoIndex];
    return id && /^\d+$/.test(id) ? id : null;
  } catch {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return match ? match[1] : null;
  }
};

const parseDailymotionId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (host === "dai.ly") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (host.includes("dailymotion.com")) {
      const match = parsed.pathname.match(/\/video\/([^/?#]+)/i);
      return match ? match[1] : null;
    }
  } catch {
    const match = url.match(/dailymotion\.com\/video\/([^/?#]+)/i) || url.match(/dai\.ly\/([^/?#]+)/i);
    return match ? match[1] : null;
  }
  return null;
};

const parseLoomId = (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.replace(/^www\./i, "").toLowerCase().includes("loom.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const shareIndex = parts[0] === "share" || parts[0] === "embed" ? 1 : 0;
    return parts[shareIndex] || null;
  } catch {
    const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
    return match ? match[1] : null;
  }
};

const parseWistiaId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (host.includes("wistia.com")) {
      const match = parsed.pathname.match(/\/medias\/([^/?#]+)/i);
      return match ? match[1] : null;
    }
    if (host.includes("fast.wistia.net")) {
      const match = parsed.pathname.match(/\/embed\/iframe\/([^/?#]+)/i);
      return match ? match[1] : null;
    }
  } catch {
    const match = url.match(/wistia\.(?:com|net)\/(?:medias|embed\/iframe)\/([^/?#]+)/i);
    return match ? match[1] : null;
  }
  return null;
};

const parseGoogleDriveId = (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.replace(/^www\./i, "").toLowerCase().includes("drive.google.com")) return null;
    const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/i);
    return fileMatch ? fileMatch[1] : null;
  } catch {
    const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    return match ? match[1] : null;
  }
};

const parseStreamableId = (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.replace(/^www\./i, "").toLowerCase().includes("streamable.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const index = parts[0] === "e" || parts[0] === "o" ? 1 : 0;
    return parts[index] || null;
  } catch {
    const match = url.match(/streamable\.com\/(?:e\/)?([^/?#]+)/i);
    return match ? match[1] : null;
  }
};

const isDirectVideoFile = (url) => DIRECT_VIDEO_EXT.test(url);

const isLikelyIframeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    return (
      path.includes("/embed") ||
      path.includes("/player") ||
      path.includes("/preview") ||
      parsed.hostname.includes("player.")
    );
  } catch {
    return false;
  }
};

/**
 * Resolve a module video URL into an embed configuration.
 * @returns {{ type: 'iframe'|'video'|'link', provider: string, src: string, openUrl: string } | null}
 */
export const resolveVideoEmbed = (rawUrl = "", baseApiUrl = "") => {
  const openUrl = resolveAbsoluteUrl(rawUrl, baseApiUrl);
  if (!openUrl) return null;

  const youtubeId = parseYouTubeId(openUrl);
  if (youtubeId) {
    return {
      type: "iframe",
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`,
      openUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    };
  }

  const vimeoId = parseVimeoId(openUrl);
  if (vimeoId) {
    return {
      type: "iframe",
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`,
      openUrl: `https://vimeo.com/${vimeoId}`,
    };
  }

  const dailymotionId = parseDailymotionId(openUrl);
  if (dailymotionId) {
    return {
      type: "iframe",
      provider: "dailymotion",
      src: `https://www.dailymotion.com/embed/video/${dailymotionId}`,
      openUrl: openUrl,
    };
  }

  const loomId = parseLoomId(openUrl);
  if (loomId) {
    return {
      type: "iframe",
      provider: "loom",
      src: `https://www.loom.com/embed/${loomId}`,
      openUrl: `https://www.loom.com/share/${loomId}`,
    };
  }

  const wistiaId = parseWistiaId(openUrl);
  if (wistiaId) {
    return {
      type: "iframe",
      provider: "wistia",
      src: `https://fast.wistia.net/embed/iframe/${wistiaId}`,
      openUrl: openUrl,
    };
  }

  const driveId = parseGoogleDriveId(openUrl);
  if (driveId) {
    return {
      type: "iframe",
      provider: "google-drive",
      src: `https://drive.google.com/file/d/${driveId}/preview`,
      openUrl: openUrl,
    };
  }

  const streamableId = parseStreamableId(openUrl);
  if (streamableId) {
    return {
      type: "iframe",
      provider: "streamable",
      src: `https://streamable.com/e/${streamableId}`,
      openUrl: openUrl,
    };
  }

  if (isDirectVideoFile(openUrl)) {
    return {
      type: "video",
      provider: "file",
      src: openUrl,
      openUrl,
    };
  }

  if (isLikelyIframeEmbedUrl(openUrl)) {
    return {
      type: "iframe",
      provider: "embed",
      src: openUrl,
      openUrl,
    };
  }

  return {
    type: "link",
    provider: "external",
    src: "",
    openUrl,
  };
};

export const getYouTubeVideoId = parseYouTubeId;

export { resolveAbsoluteUrl as resolveVideoAssetUrl };
