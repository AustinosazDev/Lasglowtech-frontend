// import { Link } from "react-router-dom";
// import { FaArrowRight } from "react-icons/fa";

// export default function Blogcard({ post }) {
//   if (!post) return null;
//   return (
//     <Link to={`/blog/${post.slug}`} className="brand-card flex flex-col group overflow-hidden block h-full">
//       {post.coverImage && (
//         <div className="h-48 overflow-hidden">
//           <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//         </div>
//       )}
//       <div className="p-5 flex flex-col flex-1">
//         {post.category && (
//           <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest mb-2">{post.category}</span>
//         )}
//         <h3 className="font-extrabold text-base text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{post.title}</h3>
//         <p className="text-xs text-[#9b8cb5] leading-relaxed line-clamp-3 flex-1">{post.excerpt || post.summary}</p>
//         <div className="mt-4 flex items-center justify-between">
//           {post.createdAt && <span className="text-xs text-[#9b8cb5]">{new Date(post.createdAt).toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" })}</span>}
//           <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8700ff] group-hover:gap-2 transition-all">Read <FaArrowRight className="w-2.5 h-2.5" /></span>
//         </div>
//       </div>
//     </Link>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { IoShareSocialSharp } from "react-icons/io5";
import { PiArrowCircleUpRightFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import instance, { API_BASE_URL } from "../config/axios.config";

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").trim();

const Blogcard = () => {
  const blogsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("/posts");
        setPosts(res.data || []);
      } catch (error) {
        setPosts([]);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / blogsPerPage));
  const currentBlogs = useMemo(
    () => posts.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage),
    [posts, currentPage]
  );

  const handleShare = async (blog) => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: blog.title,
        text: "Check out this article from Lasglowtech.",
        url: `${window.location.origin}/blog/${blog.slug}`,
      });
    } catch (error) {
      // User cancelled or share failed
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recent";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-lg  shadow-primary2 md:gap-5">
        {currentBlogs.map((blog, index) => (
          <article
            key={blog.id}
            className="group rounded-xl brand-card r overflow-hidden
        shadow-md hover:shadow-xl
        hover:scale-[1.02] transition-all duration-300 flex flex-col"
          >
            <Link to={`/blog/${blog.slug}`} className=" flex-1 flex flex-col">
              <div className="relative aspect-[16/10] max-h-44 overflow-hidden bg-bgcolor/50">
                <img
                  src={
                    blog.coverUrl ||
                    `${API_BASE_URL}/uploads/images/${blog.cover}`
                  }
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover max-h-44 transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bgcolor/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                  {formatDate(blog.timestamp)}
                </p>
                <h3 className="text-base font-semibold text-textcolor2 line-clamp-2 group-hover:text-Secondarycolor transition-colors leading-snug">
                  {blog.title}
                </h3>
                <p className="text-sm text-muted mt-3 line-clamp-3 leading-relaxed flex-1">
                  {stripHtml(blog.content)}
                </p>
 
                <div className=" flex flex-row justify-between items-center pt-4">
<span className="inline-flex items-center gap-2 mt-4 text-Secondarycolor font-medium text-sm">
                  Read article
                  <PiArrowCircleUpRightFill className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]" />
                </span>


                   <div className="px-4 flex items-center justify-end
                 ">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleShare(blog);
                }}
                className="p-2 rounded-lg border border-Primarycolor/20 hover:border-Primarycolor/40 hover:bg-Primarycolor/10 text-muted hover:text-Secondarycolor transition-colors"
                aria-label="Share article"
              >
                <IoShareSocialSharp className="w-5 h-5" />
              </button>
            </div>
                </div>
                
                
              </div>
            </Link>
           
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-4 pt-4"
          aria-label="Blog pagination"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-5 py-2.5 rounded-xl border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-muted min-w-[80px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 rounded-xl border border-Primarycolor/40 hover:bg-Primarycolor/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default Blogcard;
