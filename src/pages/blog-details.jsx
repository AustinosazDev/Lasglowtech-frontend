import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import instance, { API_BASE_URL } from "../config/axios.config";
import Subscription from "../components/sections/subscription";
import { Calendar, Clock, Eye, MessageCircle, Heart, Share2 } from "lucide-react";
import moment from "moment";
import { Osaz } from "../components/images";
import SEO from "../utils/seo";
import { breadcrumbSchema } from "../utils/structuredData";
import BlogContent from "../components/blog/BlogContent";
import BlogComments from "../components/blog/BlogComments";
import LikeButton from "../components/blog/LikeButton";
import ShareButtons from "../components/blog/ShareButtons";

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
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRes = await instance.get(`/blog/slug/${decodedSlug}`);
        setPost(postRes.data);

        // Increment view count
        await instance.post(`/blog/${postRes.data.id}/view`);

        // Fetch comments using post ID
        const commentsRes = await instance.get(`/blog/${postRes.data.id}/comments`);
        setComments(commentsRes.data || []);

        // Fetch related posts
        if (postRes.data.category) {
          const relatedRes = await instance.get(
            `/blog/related/${encodeURIComponent(postRes.data.category)}/${postRes.data.id}`,
            { params: { limit: 3 } }
          );
          setRelatedPosts(relatedRes.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch the blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [decodedSlug]);

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
  const categoryColors = {
    "Design": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Web & Mobile Development": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Latest Tech Trends": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Branding & Marketing": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "Business & Startups": "bg-green-500/20 text-green-400 border-green-500/30",
    "Case Studies": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "Company News": "bg-Primarycolor/20 text-Secondarycolor border-Primarycolor/30",
  };
  const categoryColor = categoryColors[post.category] || categoryColors["Company News"];

  return (
    <article className="bg-bgcolor text-white pb-16 md:pb-20 pt-32 md:pt-36 lg:pt-40">
      <SEO
        title={`${post.title} | Lasglowtech Blog`}
        description={post.excerpt || (post.content || "").replace(/<[^>]+>/g, "").slice(0, 160)}
        url={`/blog/${post.slug}`}
        image={post.thumbnailUrl || (post.thumbnail ? `${API_BASE_URL}/uploads/images/${post.thumbnail}` : null)}
        type="article"
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blogs" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            image: post.thumbnailUrl || (post.thumbnail ? `${API_BASE_URL}/uploads/images/${post.thumbnail}` : null),
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at || post.published_at || post.created_at,
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
          }
        ]}
      />

      {/* Breadcrumb */}
      <motion.nav 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-6 md:px-8 mb-6 text-sm text-muted"
      >
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-textcolor2">
            Home
          </Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-textcolor2">
            Blog
          </Link>
          <span>/</span>
          <span className="text-textcolor2 truncate max-w-xs">{post.title}</span>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Hero Image */}
        {post.thumbnail && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative w-full max-h-[450px] overflow-hidden rounded-2xl border border-[#8700ff]/15"
          >
            <img
              src={post.thumbnailUrl || `${API_BASE_URL}/uploads/images/${post.thumbnail}`}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 md:mb-12"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColor}`}>
              {post.category}
            </span>
          </div>

          <h1 className="text-textcolor2 mb-6 max-w-3xl text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-muted mb-8 leading-relaxed">{post.excerpt}</p>
          )}

          {/* Author Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted border-y border-[#8700ff]/15 py-5">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={post.author_avatar || Osaz} 
                alt={post.author_name || "Lasglowtech"} 
                className="w-10 h-10 rounded-full border border-[#8700ff]/25 object-cover shrink-0" 
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-textcolor2">
                  By {post.author_name || "Lasglowtech"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{moment(post.published_at || post.created_at).format("MMMM D, YYYY")}</span>
                  </div>
                  <span className="text-[#8700ff]/50">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readTime} min read</span>
                  </div>
                  <span className="text-[#8700ff]/50">·</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{(post.view_count || 0) + 1} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BlogContent content={post.content} />
        </motion.div>

        {/* Like & Share Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 space-y-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <LikeButton postId={post.id} likesCount={post.likes_count || 0} />
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          <div className="border-t border-[#8700ff]/15" />
        </motion.div>

        {/* Comments Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <BlogComments 
            postId={post.id} 
            comments={comments} 
            commentsCount={post.comments_count || 0} 
          />
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 md:mt-20 border-t border-[#8700ff]/15 pt-10 md:pt-12"
          >
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-textcolor2">Related Posts</h2>
              <p className="text-muted mt-2">More articles you might find interesting</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                >
                  <Link 
                    to={`/blog/${relatedPost.slug}`}
                    className="brand-card overflow-hidden hover:scale-[1.02] transition-transform block h-full"
                  >
                    <div className="aspect-video overflow-hidden">
                      {relatedPost.thumbnailUrl || relatedPost.thumbnail ? (
                        <img
                          src={relatedPost.thumbnailUrl || `${API_BASE_URL}/uploads/images/${relatedPost.thumbnail}`}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-Primarycolor/20 to-Secondarycolor/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-Primarycolor/30">LT</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-textcolor2 line-clamp-2 mb-2">{relatedPost.title}</h3>
                      <p className="text-sm text-muted line-clamp-2">
                        {relatedPost.excerpt || relatedPost.content?.replace(/<[^>]+>/g, "").slice(0, 100)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-16 md:mt-20">
          <Subscription />
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
