import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import instance from "../../config/axios.config";
import { toast } from "react-toastify";

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BlogComments({ postId, comments = [], commentsCount = 0 }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await instance.post("/blog/comments", {
        post_id: postId,
        ...formData,
      });
      
      setShowSuccess(true);
      setFormData({ author_name: "", author_email: "", content: "" });
      toast.success("Your comment has been submitted and is awaiting moderation.");
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-Secondarycolor" />
        <h2 className="font-display text-2xl font-bold text-textcolor2">Comments ({commentsCount})</h2>
      </div>

      {/* Comment Form */}
      <div className="brand-card p-5">
        <h3 className="font-display text-lg font-bold text-textcolor2 mb-4">Add a Comment</h3>
        
        {showSuccess ? (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            Your comment has been submitted and is awaiting moderation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-textcolor2">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg border border-Primarycolor/30 bg-bgcolor/50 text-textcolor2 placeholder:text-muted focus:border-Secondarycolor focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-textcolor2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.author_email}
                  onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-Primarycolor/30 bg-bgcolor/50 text-textcolor2 placeholder:text-muted focus:border-Secondarycolor focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2 text-textcolor2">
                Comment *
              </label>
              <textarea
                id="comment"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                maxLength={1000}
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-2 rounded-lg border border-Primarycolor/30 bg-bgcolor/50 text-textcolor2 placeholder:text-muted focus:border-Secondarycolor focus:outline-none transition-colors resize-none"
              />
              <p className="text-xs text-muted mt-1">
                {formData.content.length}/1000 characters
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-sm py-2 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post Comment
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="brand-card p-4 border border-Primarycolor/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-textcolor2">{comment.author_name}</h4>
                  <p className="text-xs text-muted">{formatDate(comment.created_at)}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-textcolor2">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-Primarycolor/20 rounded-lg">
          <p className="text-muted">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
