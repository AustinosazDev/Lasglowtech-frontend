import { Link } from "react-router-dom";
import { IoShareSocialSharp } from "react-icons/io5";
import { PiArrowCircleUpRightFill } from "react-icons/pi";
import { API_BASE_URL } from "../config/axios.config";
import { cleanDisplayText } from "../utils/displayText";

const formatDate = (timestamp) => {
  if (!timestamp) return "Recent";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BlogPostCard({ post, showShare = true }) {
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: post.title,
        text: "Check out this article from Lasglowtech.",
        url: `${window.location.origin}/blog/${post.slug}`,
      });
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <article className="group rounded-xl brand-card overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col">
      <Link to={`/blog/${post.slug}`} className="flex-1 flex flex-col">
        <div className="relative aspect-[16/10] max-h-44 overflow-hidden bg-bgcolor/50">
          <img
            src={post.coverUrl || `${API_BASE_URL}/uploads/images/${post.cover}`}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover max-h-44 transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bgcolor/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 md:p-5 flex flex-col flex-1">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
            {formatDate(post.timestamp)}
          </p>
          <h3 className="text-base font-semibold text-textcolor2 line-clamp-2 group-hover:text-Secondarycolor transition-colors leading-snug">
            {post.title}
          </h3>
          <p className="text-sm text-muted mt-3 line-clamp-3 leading-relaxed flex-1">
            {cleanDisplayText(post.content)}
          </p>

          <div className="flex flex-row justify-between items-center pt-4">
            <span className="inline-flex items-center gap-2 mt-4 text-Secondarycolor font-medium text-sm">
              Read article
              <PiArrowCircleUpRightFill className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]" />
            </span>

            {showShare && (
              <div className="px-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-Primarycolor/20 hover:border-Primarycolor/40 hover:bg-Primarycolor/10 text-muted hover:text-Secondarycolor transition-colors"
                  aria-label="Share article"
                >
                  <IoShareSocialSharp className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
