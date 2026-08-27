import { useState, useEffect } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

export default function ShareButtons({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://lasglowtech.com.ng");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const url = `${origin}/blog/${slug}`;

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Twitter",
      icon: Share2,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Facebook",
      icon: Share2,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share to ${link.name}`}
          className={`p-2 rounded-lg ${link.color} text-white hover:opacity-90 transition-opacity`}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        aria-label="Copy link"
        className="p-2 rounded-lg brand-card border border-Primarycolor/30 hover:border-Secondarycolor text-textcolor2 transition-colors"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}