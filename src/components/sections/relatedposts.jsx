import { useEffect, useState } from "react";
import instance from "../../config/axios.config";
import BlogPostCard from "../BlogPostCard";
import { BlogGridTileSkeletonGrid } from "../skeletons/CardSkeletons";

const RelatedPosts = ({ currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await instance.get("/posts");
        const filtered = (res.data || []).filter((post) => post.id !== currentPostId);
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRelatedPosts(shuffled);
      } catch (err) {
        console.error(err);
        setError("Failed to load related posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentPostId]);

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (!loading && relatedPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-textcolor2 mb-2">Related posts</h2>
      <p className="type-muted mb-8 max-w-xl">More articles you may find useful.</p>

      {loading ? (
        <BlogGridTileSkeletonGrid count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {relatedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedPosts;
