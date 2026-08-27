import { Link } from "react-router-dom";
import { useState } from "react";
import instance, { API_BASE_URL } from "../../config/axios.config";
import { toast } from "react-toastify";

export default function BlogSidebar({ popularPosts = [], categoryCounts = {}, currentCategory }) {
  const [subscribing, setSubscribing] = useState(false);
  const [email, setEmail] = useState("");

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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      await instance.post("/blog/newsletter/subscribe", { email });
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <div className="brand-card p-5">
        <h3 className="font-display text-lg font-bold text-textcolor2 mb-4">Popular Posts</h3>
        <div className="space-y-4">
          {popularPosts.length > 0 ? (
            popularPosts.map((post) => {
              const thumbnailUrl = post.thumbnailUrl || (post.thumbnail ? `${API_BASE_URL}/uploads/images/${post.thumbnail}` : null);
              return (
                <div key={post.id} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-Primarycolor/20">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-Primarycolor/20 to-Secondarycolor/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-Primarycolor/30">LT</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="font-semibold text-sm line-clamp-2 mb-1 hover:text-Secondarycolor transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{post.view_count || 0} views</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted">No popular posts yet.</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="brand-card p-5">
        <h3 className="font-display text-lg font-bold text-textcolor2 mb-4">Categories</h3>
        <div className="space-y-2">
          <Link
            to="/blog"
            className={`flex items-center justify-between p-2 rounded-md hover:bg-Primarycolor/10 transition-colors ${
              !currentCategory ? "bg-Primarycolor/20 text-Secondarycolor" : ""
            }`}
          >
            <span className="text-sm">All Posts</span>
            <span className="text-xs bg-Primarycolor/20 text-Secondarycolor px-2 py-1 rounded-full">
              {totalCount}
            </span>
          </Link>
          {categories.slice(1).map((category) => (
            <Link
              key={category}
              to={`/blog?category=${encodeURIComponent(category)}`}
              className={`flex items-center justify-between p-2 rounded-md hover:bg-Primarycolor/10 transition-colors ${
                currentCategory === category ? "bg-Primarycolor/20 text-Secondarycolor" : ""
              }`}
            >
              <span className="text-sm">{category}</span>
              <span className="text-xs bg-Primarycolor/20 text-Secondarycolor px-2 py-1 rounded-full">
                {categoryCounts[category] || 0}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="brand-card p-5">
        <h3 className="font-display text-lg font-bold text-textcolor2 mb-2">Subscribe to Newsletter</h3>
        <p className="text-sm text-muted mb-4">
          Get the latest tech insights delivered to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 rounded-lg border border-Primarycolor/30 bg-bgcolor/50 focus:border-Secondarycolor focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={subscribing}
            className="btn-primary w-full text-sm py-2 disabled:opacity-50"
          >
            {subscribing ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </aside>
  );
}
