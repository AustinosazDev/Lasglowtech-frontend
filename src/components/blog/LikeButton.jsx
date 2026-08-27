import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import instance from "../../config/axios.config";
import { getToken } from "../../utils/auth";

export default function LikeButton({ postId, likesCount = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();

  // Generate anonymous fingerprint for non-logged-in users
  const getAnonymousFingerprint = () => {
    if (typeof window !== "undefined") {
      let fingerprint = localStorage.getItem("blog_fingerprint");
      if (!fingerprint) {
        fingerprint = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("blog_fingerprint", fingerprint);
      }
      return fingerprint;
    }
    return null;
  };

  // Check if user has already liked
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
        const fingerprint = getAnonymousFingerprint();
        
        const response = await instance.get(`/blog/${postId}/like/status`, {
          params: {
            user_id: userId,
            anonymous_fingerprint: fingerprint
          }
        });
        
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [postId, token]);

  const handleLike = async () => {
    setIsLoading(true);

    try {
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
      const fingerprint = getAnonymousFingerprint();

      const response = await instance.post(`/blog/${postId}/like`, {
        user_id: userId,
        anonymous_fingerprint: fingerprint
      });

      setLiked(response.data.liked);
      setLikeCount((prev) => (response.data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          liked 
            ? "bg-red-500 text-white hover:bg-red-600" 
            : "brand-card border border-Primarycolor/30 hover:border-Secondarycolor text-textcolor2"
        } disabled:opacity-50`}
      >
        <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        <span>{likeCount}</span>
      </button>
      <span className="text-sm text-muted">
        {liked ? "You liked this" : "Like this article"}
      </span>
    </div>
  );
}
