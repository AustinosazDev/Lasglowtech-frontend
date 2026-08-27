import { Link } from "react-router-dom";
import { Clock, Heart, MessageCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/axios.config";
import { cleanDisplayText } from "../../utils/displayText";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent";
const readTime = (html = "") => Math.max(1, Math.ceil((html.replace(/<[^>]+>/g, " ").match(/\S+/g) || []).length / 200));
const categoryStyles = {
  Design: "bg-sky-400/15 text-sky-200 border-sky-300/30",
  "Web & Mobile Development": "bg-violet-400/15 text-violet-200 border-violet-300/30",
  "Latest Tech Trends": "bg-cyan-400/15 text-cyan-200 border-cyan-300/30",
  "Branding & Marketing": "bg-pink-400/15 text-pink-200 border-pink-300/30",
  "Business & Startups": "bg-emerald-400/15 text-emerald-200 border-emerald-300/30",
  "Case Studies": "bg-orange-400/15 text-orange-100 border-orange-300/30",
  "Company News": "bg-Primarycolor/20 text-Secondarycolor border-Primarycolor/30",
};

export default function BlogCard({ post }) {
  const thumbnail = post.thumbnailUrl || (post.thumbnail ? `${API_BASE_URL}/uploads/images/${post.thumbnail}` : null);
  const excerpt = post.excerpt || cleanDisplayText(post.content || "");
  const initials = (post.author_name || "Lasglowtech").slice(0, 2).toUpperCase();

  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#8700ff]/20 bg-[#1a1030] shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:border-Secondarycolor/50 hover:shadow-xl hover:shadow-[#8700ff]/15">
    <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-Primarycolor/30 to-Secondarycolor/20">
        {thumbnail ? <img src={thumbnail} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="flex h-full items-center justify-center text-4xl font-bold text-white/25">LT</span>}
        <span className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold ${categoryStyles[post.category] || categoryStyles["Company News"]}`}>{post.category || "Company News"}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-textcolor2 transition-colors group-hover:text-Secondarycolor">{post.title}</h3>
        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#b9abc9]">{excerpt}</p>
        <div className="mb-4 flex items-center gap-2 text-xs text-[#b9abc9]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-medium text-textcolor2">{initials}</span><span className="truncate">{post.author_name || "Lasglowtech Team"}</span><span>·</span><span>{formatDate(post.published_at || post.created_at)}</span></div>
        <div className="mb-4 flex items-center justify-between text-xs text-[#b9abc9]"><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{readTime(post.content)} min read</span><span className="flex items-center gap-3"><span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes_count || 0}</span><span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.comments_count || 0}</span></span></div>
        <span className="w-full rounded-xl border border-Primarycolor/35 px-4 py-2.5 text-center text-sm font-semibold text-textcolor2 transition-colors group-hover:border-Secondarycolor group-hover:bg-Primarycolor/15">Read More</span>
      </div>
    </Link>
  </article>;
}
