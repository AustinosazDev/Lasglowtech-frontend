import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { addToCart } from "../utils/cart";
import { cardImage, formatNaira } from "../utils/catalogue";
import { cleanDisplayText } from "../utils/displayText";

const buildCartItem = (item) => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  summary: item.summary,
  price: item.price,
  paymentType: item.paymentType,
  isPaymentEnabled: Boolean(item.isPaymentEnabled),
  imageUrl: item.imageUrl || cardImage(item, 0),
});

const shortDescription = (item) => {
  const text = cleanDisplayText([item.summary, item.description].filter(Boolean).join(" "));
  return text || "Explore this package on the product page.";
};

const cardTags = (item) => {
  const tags = [];
  if (item.packageTier) {
    tags.push(String(item.packageTier).replace(/^\w/, (c) => c.toUpperCase()));
  }
  if (item.isPopular) tags.push("Popular");
  if (item.isDigitalProduct) tags.push("Digital");
  return tags;
};

const CatalogueProductCard = ({
  item,
  index = 0,
  inCart = false,
  onCartChange,
}) => {
  const detailHref = `/catalogues/${item.slug}`;
  const canPurchase = Boolean(item.isPaymentEnabled);
  const tags = cardTags(item);

  const handleAddToCart = () => {
    if (!canPurchase) return;
    if (inCart) {
      toast.info("Already in your cart.");
      return;
    }
    addToCart(buildCartItem(item));
    onCartChange?.();
    toast.success("Added to cart.");
  };

  return (
    <article
      className={`brand-card rounded-3xl flex flex-col h-full ${
        item.isPopular ? "ring-1 ring-Secondarycolor/35" : ""
      }`}
    >
      <Link to={detailHref} className="block p-3 pb-0">
        <img
          src={cardImage(item, index)}
          alt={item.title}
          className="w-full aspect-[16/10] object-cover object-center rounded-2xl"
        />
      </Link>

      <div className="p-4 pt-3 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link to={detailHref} className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-textcolor2 leading-snug line-clamp-2 hover:text-Secondarycolor transition-colors">
              {item.title}
            </h3>
          </Link>
          {canPurchase && (
            <span className="shrink-0 text-xs font-bold text-white bg-Primarycolor px-3 py-1.5 rounded-full">
              {formatNaira(item.price)}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
          {shortDescription(item)}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[0.68rem] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1">
          {canPurchase ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={inCart}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all ${
                inCart
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 cursor-default"
                  : "bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white hover:opacity-95 shadow-lg shadow-Primarycolor/20"
              }`}
            >
              <FaShoppingCart className="w-3.5 h-3.5" />
              {inCart ? "In cart" : "Add to cart"}
            </button>
          ) : (
            <Link
              to={detailHref}
              className="w-full inline-flex items-center justify-center py-3 rounded-full text-sm font-semibold border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor hover:text-white transition-colors"
            >
              View details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default CatalogueProductCard;
