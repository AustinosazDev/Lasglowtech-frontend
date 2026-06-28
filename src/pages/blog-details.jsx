import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import instance, { API_BASE_URL } from "../config/axios.config";
import RelatedPosts from "../components/sections/relatedposts";
import Subscription from "../components/sections/subscription";
import { IoShareSocialSharp } from "react-icons/io5";
import moment from "moment";
import { Osaz } from "../components/images";
import SEO from "../utils/seo";

const readingTimeMinutes = (html = "") => {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.split(" ").length / 220));
};

const BlogDetails = () => {
  const { slug } = useParams();
  const decodedSlug = decodeURIComponent(slug);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await instance.get(`/posts/${decodedSlug}`);
        setPost(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch the blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [decodedSlug]);

  const handleShare = () => {
    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:5173"
        : "https://lasglowtech.com.ng";

    const shareUrl = `${baseUrl}/blog/${post.slug}`;

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: "Check out this article!",
          url: shareUrl,
        })
        .catch((err) => console.error("Share error:", err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const SkeletonLoader = () => (
    <article className="bg-bgcolor text-white pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <div className="mb-8 h-8 w-24 rounded-lg bg-white/10 animate-pulse" />
        <div className="mb-8 space-y-3">
          <div className="h-10 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-10 w-4/5 rounded-lg bg-white/10 animate-pulse" />
        </div>
        <div className="mb-8 aspect-[16/9] max-h-[480px] rounded-2xl bg-white/10 animate-pulse" />
        <div className="mb-10 h-16 rounded-xl bg-white/10 animate-pulse" />
        <div className="mx-auto max-w-2xl space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-white/10 animate-pulse" style={{ width: `${88 - i * 6}%` }} />
          ))}
        </div>
      </div>
    </article>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-center pt-32 md:pt-36 pb-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center pt-32 md:pt-36 pb-20 text-[#9b8cb5]">Blog not found</div>;
  }

  const readTime = readingTimeMinutes(post.content);

  return (
    <article className="bg-bgcolor text-white pb-16 md:pb-20 pt-32 md:pt-36 lg:pt-40">
      <SEO
        title={`${post.title} | Lasglowtech Blog`}
        description={(post.content || "").replace(/<[^>]+>/g, "").slice(0, 160)}
        url={`/blog/${post.slug}`}
        image={post.coverUrl}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          image: post.coverUrl,
          datePublished: post.timestamp,
          author: {
            "@type": "Organization",
            name: "Lasglowtech",
          },
          publisher: {
            "@type": "Organization",
            name: "Lasglowtech",
            logo: {
              "@type": "ImageObject",
              url: "https://lasglowtech.com.ng/LOGO.png",
            },
          },
          mainEntityOfPage: `https://lasglowtech.com.ng/blog/${post.slug}`,
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <header className="mb-10 md:mb-12">
          <p className="section-tag mb-4">
            <span className="dot-live" />
            Blog
          </p>

          <h1 className="text-textcolor2 mb-6 max-w-3xl">{post.title}</h1>

          {post.cover && (
            <figure className="mb-8 overflow-hidden rounded-2xl border border-[#8700ff]/15">
              <img
                src={post.coverUrl || `${API_BASE_URL}/uploads/images/${post.cover}`}
                alt={post.title}
                loading="lazy"
                className="w-full max-h-[480px] object-cover"
              />
            </figure>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#8700ff]/15 py-5">
            <div className="flex items-center gap-3 min-w-0">
              <img src={Osaz} alt="Lasglowtech" className="w-10 h-10 rounded-full border border-[#8700ff]/25 object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Lasglowtech</p>
                <p className="text-sm text-[#9b8cb5]">
                  {moment(post.timestamp).format("MMMM D, YYYY")}
                  <span className="mx-2 text-[#8700ff]/50">·</span>
                  {readTime} min read
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="btn-primary shrink-0 px-5 py-2.5 text-sm"
            >
              Share
              <IoShareSocialSharp className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 md:mt-20 border-t border-[#8700ff]/15 pt-10 md:pt-12">
          <RelatedPosts currentPostId={post.id} />
        </div>

        <div className="mt-16 md:mt-20">
          <Subscription />
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
