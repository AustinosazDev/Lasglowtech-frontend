import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import BlogCard from "../components/blog/BlogCard";
import BlogSidebar from "../components/blog/BlogSidebar";
import instance from "../config/axios.config";
import { BlogGridTileSkeletonGrid } from "../components/skeletons/CardSkeletons";
import SEO from "../utils/seo";
import { breadcrumbSchema } from "../utils/structuredData";
import Subscription from "../components/sections/subscription";
import { FaBookOpen } from "react-icons/fa";
import { Slide3 } from "../components/images";

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const pageParam = searchParams.get("page");
  
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam) || 1);
  
  const limit = 10;

  const categories = [
    "All",
    "Design",
    "Web & Mobile Development", 
    "Latest Tech Trends",
    "Branding & Marketing",
    "Business & Startups",
    "Case Studies",
    "Company News"
  ];

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        const category = categoryParam === "All" ? undefined : categoryParam;
        const offset = (currentPage - 1) * limit;
        
        const [postsRes, popularRes, countsRes] = await Promise.all([
          instance.get("/blog/published", { params: { category, limit, offset } }),
          instance.get("/blog/popular", { params: { limit: 5 } }),
          instance.get("/blog/categories/counts")
        ]);

        if (!cancelled) {
          setPosts(postsRes.data?.posts || postsRes.data || []);
          setPopularPosts(popularRes.data || []);
          setCategoryCounts(countsRes.data || {});
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        if (!cancelled) {
          setPosts([]);
          setPopularPosts([]);
          setCategoryCounts({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [categoryParam, currentPage]);

  const featured = posts.length > 0 ? posts[0] : null;
  const currentCategory = categoryParam || "All";
  const totalCount = currentCategory === "All" 
    ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
    : (categoryCounts[currentCategory] || 0);
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#120b1f] text-[#e8ddf8]">
      <SEO
        title={`Blog ${currentCategory !== "All" ? `| ${currentCategory}` : ""} | Lasglowtech — Tech Insights & Digital Tips`}
        description={`Expert perspectives on ${currentCategory === "All" ? "design, development, and digital strategy" : currentCategory.toLowerCase()} to help your business thrive in the modern landscape.`}
        url={`/blogs${currentCategory !== "All" ? `?category=${encodeURIComponent(currentCategory)}` : ""}`}
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blogs" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: currentCategory === "All" ? "Lasglowtech Blog" : `${currentCategory} Articles`,
            description: `Expert perspectives on ${currentCategory === "All" ? "design, development, and digital strategy" : currentCategory.toLowerCase()}`,
            url: `https://lasglowtech.com.ng/blogs${currentCategory !== "All" ? `?category=${encodeURIComponent(currentCategory)}` : ""}`,
          }
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-48 pb-32 px-6 md:px-12 border-b border-[#8700ff]/15 min-h-[60vh]">
       <div className="absolute inset-0 opacity-40">
          <img
            src={Slide3}
            alt=""
            className="w-full h-full object-cover object-center"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#120b1f]/60 via-[#120b1f]/70 to-[#120b1f]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-Primarycolor opacity-[0.08] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-Secondarycolor opacity-[0.06] blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-tag justify-center mb-6"><span className="dot-live"/>Our Blog</span>
            <h1 className="text-white mb-6 leading-tight">Insights that drive digital growth</h1>
            <p className="text-lg text-[#9b8cb5] max-w-2xl mx-auto leading-relaxed">
              Expert perspectives on design, development, and digital strategy to help your business thrive in the modern landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="border-b border-[#8700ff]/15 bg-[#120b1f] sticky top-16 z-40">
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={cat === "All" ? "/blogs" : `/blogs?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  currentCategory === cat
                    ? "bg-Primarycolor text-white"
                    : "bg-[#8700ff]/10 text-[#9b8cb5] hover:bg-[#8700ff]/20"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {loading && (
          <div className="max-w-6xl mx-auto">
            <BlogGridTileSkeletonGrid count={6} />
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <FaBookOpen className="w-12 h-12 text-[#8700ff]/30 mx-auto mb-4" />
            <h3 className="text-white mb-2">No posts yet</h3>
            <p className="type-muted">Check back soon — we&apos;re working on something great.</p>
          </div>
        )}
        {!loading && posts.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Blog Posts Grid */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-8"
              >
                <h2 className="text-3xl font-bold text-textcolor2">
                  {currentCategory === "All" ? "Latest Articles" : currentCategory}
                </h2>
              </motion.div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg brand-card border border-Primarycolor/30 hover:border-Secondarycolor text-textcolor2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pageNum === currentPage
                            ? "bg-Primarycolor text-white"
                            : "brand-card border border-Primarycolor/30 hover:border-Secondarycolor text-textcolor2"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg brand-card border border-Primarycolor/30 hover:border-Secondarycolor text-textcolor2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar
                popularPosts={popularPosts}
                categoryCounts={categoryCounts}
                currentCategory={currentCategory === "All" ? undefined : currentCategory}
              />
            </div>
          </div>
        )}
      </section>

      <Subscription />
    </div>
  );
}
