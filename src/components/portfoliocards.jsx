import React from "react";
import { motion } from "framer-motion";

const PortfolioCard = ({ image, alt, title, description, price, link, delay = 0, featured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={[
        "group w-full max-w-lg mx-auto md:max-w-none",
        "brand-card rounded-2xl overflow-hidden",
        "shadow-lg shadow-black/20 transition-all duration-300",
        "hover:shadow-[0_20px_50px_rgba(135,0,255,0.18)] hover:-translate-y-1",
        featured
          ? "ring-1 ring-[#8700ff]/40 md:ring-offset-0 ring-offset-4 ring-offset-[#120b1f]"
          : "",
      ].join(" ")}
    >
      {/* Thumbnail — square frame, full image visible (no crop on square assets) */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#1a1030]">
        <img
          width={600}
          height={600}
          src={image}
          alt={alt || description || "Portfolio work"}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {featured && (
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <span className="inline-flex items-center rounded-lg border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md sm:text-xs">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={featured ? "space-y-4 px-5 py-5 sm:px-6 sm:py-6" : "space-y-3 px-5 py-5 sm:px-6 sm:py-5"}>
        {title && (
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        )}

        {description && (
          <p className="text-sm leading-relaxed text-[#b8a9d4] sm:text-[0.9375rem]">{description}</p>
        )}

        {price && (
          <p className="text-md font-bold text-Secondarycolor">{price}</p>
        )}

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex w-full items-center justify-center gap-2 rounded-lg
            py-3 px-4 text-sm font-semibold text-white
            bg-gradient-to-r from-[#8700ff] to-[#6d28d9] shadow-md shadow-[#8700ff]/25
            transition-all duration-300
            hover:from-[#9333ea] hover:to-[#7c3aed] hover:shadow-lg hover:shadow-[#8700ff]/35
            active:scale-[0.98]
          "
        >
          View project
        </a>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
