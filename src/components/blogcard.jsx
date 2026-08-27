import { useEffect, useMemo, useState } from "react";
import instance from "../config/axios.config";
import BlogPostCard from "./BlogPostCard";
import { BlogGridTileSkeletonGrid } from "./skeletons/CardSkeletons";

const Blogcard = () => {
  const blogsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get("/posts");
        setPosts(res.data || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / blogsPerPage));
  const currentBlogs = useMemo(
    () => posts.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage),
    [posts, currentPage]
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-lg shadow-primary2 md:gap-5">
        {loading && <BlogGridTileSkeletonGrid count={6} className="contents" />}
        {!loading &&
          currentBlogs.map((blog) => <BlogPostCard key={blog.id} post={blog} />)}
      </div>

      {!loading && totalPages > 1 && (
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
