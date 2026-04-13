import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Blogcard from "../components/blogcard";
import instance, { API_BASE_URL } from "../config/axios.config";
import { BlogCardSkeleton, BlogGridTileSkeletonGrid } from "../components/skeletons/CardSkeletons";
import SEO from "../utils/seo";
import Subscription from "../components/sections/subscription";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";
import { Slide3 } from "../components/images";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    instance
      .get("/posts")
      .then((r) => {
        if (!cancelled) setPosts(r.data || []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts[0];

  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title="Lasglowtech Blog | Tech Insights & Digital Tips"
        description="Read practical insights, guides, and product updates from Lasglowtech."
        keywords="Lasglowtech blog, web development tips, design insights Nigeria"
        url="https://www.lasglowtech.com.ng/blogs"
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 border-b border-[#8700ff]/15">
       <div className="absolute inset-0 opacity-30">
          <img
            src={Slide3}
            alt=""
            className="w-full h-full object-cover object-center"
            aria-hidden
          />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-Primarycolor opacity-[0.09] blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-tag justify-center"><span className="dot-live"/>Blog</span>
          <h1 className="font-extrabold text-4xl md:text-5xl text-white tracking-tight mb-5">Insights & Updates</h1>
          <p className="text-white  text-lg max-w-xl mx-auto leading-relaxed">Practical tips, design insights, and product updates from the Lasglowtech team.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        {loading && (
          <>
            <section className="max-w-6xl mx-auto md:px-12 -mt-6 relative z-10 mb-16">
              <BlogCardSkeleton />
            </section>
            <div className="max-w-6xl mx-auto">
              <BlogGridTileSkeletonGrid count={6} />
            </div>
          </>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <FaBookOpen className="w-12 h-12 text-[#8700ff]/30 mx-auto mb-4" />
            <h3 className="font-extrabold text-xl text-white mb-2">No posts yet</h3>
            <p className="text-[#9b8cb5]">Check back soon we&apos;re working on something great.</p>
          </div>
        )}
        {!loading && posts.length > 0 && featured && (
          <section className="max-w-6xl mx-auto md:px-12 -mt-6 relative z-10">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="brand-card overflow-hidden shadow-xl shadow-black/20"
            >
              <Link to={featured.slug ? `/blog/${featured.slug}` : "/blogs"} className="block group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={
                        featured.coverUrl ||
                        (featured.cover
                          ? `${API_BASE_URL}/uploads/images/${featured.cover}`
                          : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800")
                      }
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-lg bg-Primarycolor/90 text-white text-xs font-semibold uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-textcolor2 group-hover:text-Secondarycolor transition-colors line-clamp-2">
                      {featured.title}
                    </h2>
                    <p className="text-gray-400 mt-3 line-clamp-2 text-sm md:text-base">
                      {featured.content?.replace(/<[^>]+>/g, "").slice(0, 160)}…
                    </p>
                    <span className="inline-flex items-center gap-2 mt-4 text-Secondarycolor font-medium text-sm">
                      Read article
                      <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          </section>
        )}
      </section>
       <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-textcolor2">All articles</h2>
        </div>
        <Blogcard />
      </section>

      <Subscription />
    </div>
  );
}
