import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBolt,
  FaCheckCircle,
  FaDownload,
  FaLock,
  FaShoppingCart,
} from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { LOGO } from "../components/images";
import { addToCart, readCart, removeFromCart } from "../utils/cart";
import { formatNaira } from "../utils/catalogue";
import { cleanDisplayText } from "../utils/displayText";
import CircularBackButton from "../components/CircularBackButton";

const catalogueFallbacks = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
  "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
];

const buildCartItem = (item) => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  summary: item.summary,
  price: item.price,
  paymentType: item.paymentType,
  isPaymentEnabled: Boolean(item.isPaymentEnabled),
  imageUrl: item.imageUrl || catalogueFallbacks[0],
});

const ProductDetails = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => readCart());

  const checkoutUrl = `/checkout/${slug}`;
  const isInCart = useMemo(() => cartItems.some((entry) => entry.slug === slug), [cartItems, slug]);
  const heroImage = item?.imageUrl || catalogueFallbacks[0];
  const canPurchase = Boolean(item?.isPaymentEnabled);

  useEffect(() => {
    let cancelled = false;

    const loadItem = async () => {
      try {
        const res = await instance.get(`/catalogues/${slug}`);
        if (!cancelled) setItem(res.data);
      } catch (error) {
        if (!cancelled) toast.error(error.response?.data?.error || "Unable to load this product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadItem();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleAddToCart = () => {
    if (!item || !canPurchase) return;
    if (isInCart) {
      toast.info("Already in your cart.");
      return;
    }
    addToCart(buildCartItem(item));
    setCartItems(readCart());
    toast.success("Added to cart.");
  };

  const handleRemoveFromCart = () => {
    if (!item?.slug) return;
    removeFromCart(item.slug);
    setCartItems(readCart());
    toast.info("Removed from cart.");
  };

  const header = (
    <header className="sticky top-0 z-50 border-b border-Primarycolor/20 bg-bgcolor2/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CircularBackButton fallback="/catalogues" />
          <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor transition-colors min-w-0">
          <img src={LOGO} width={32} height={32} alt="Lasglowtech" className="rounded-lg" />
          <span className="font-semibold text-sm truncate">Lasglowtech</span>
        </Link>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-textcolor2 hover:text-Secondarycolor transition-colors font-medium"
          >
            <FaShoppingCart className="w-4 h-4" />
            Cart
          </Link>
        </div>
      </div>
    </header>
  );

  const descriptionText =
    cleanDisplayText([item?.summary, item?.description].filter(Boolean).join(" ")) ||
    "No description available.";

  const trustBadges = item
    ? [
        canPurchase && { icon: FaLock, label: "Secure payment" },
        item.isDigitalProduct && {
          icon: item.deliveryType === "digital_file" ? FaDownload : FaBolt,
          label: item.deliveryType === "digital_file" ? "Instant download" : "Digital access",
        },
      ].filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-bgcolor text-textcolor2">
        {header}
        <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
          <div className="brand-card rounded-3xl p-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="aspect-[16/10] rounded-[1.75rem] bg-bgcolor2/50" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded bg-bgcolor2/70" />
                <div className="h-6 w-1/4 rounded bg-bgcolor2/70" />
                <div className="h-16 rounded bg-bgcolor2/70" />
                <div className="h-11 rounded-xl bg-bgcolor2/70" />
                <div className="h-11 rounded-xl bg-bgcolor2/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-bgcolor text-textcolor2">
        {header}
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-3">Product not found</h1>
          <Link to="/catalogues" className="text-Secondarycolor hover:underline text-sm">
            Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgcolor text-textcolor2">
      <SEO
        title={`${item.title} | Product Details | Lasglowtech`}
        description={cleanDisplayText(item.summary || item.description || `Buy ${item.title} on Lasglowtech.`)}
        url={`https://www.lasglowtech.com.ng/catalogues/${item.slug}`}
      />

      {header}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <article className="brand-card rounded-3xl p-6 md:p-10 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            {/* Left — image frame + trust row (like reference) */}
            <div>
              <div className="relative overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 shadow-lg shadow-black/25 aspect-[16/10] w-full bg-bgcolor2/30">
                <img
                  src={heroImage}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = catalogueFallbacks[1];
                  }}
                />
              </div>

              {trustBadges.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-6">
                  {trustBadges.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — name, price, description, actions (like reference) */}
            <div className="flex flex-col md:pt-2">
              <h1 className="text-2xl md:text-[1.65rem] font-bold text-textcolor2 leading-tight">{item.title}</h1>

              {canPurchase ? (
                <p className="mt-2 text-xl font-medium text-textcolor2">{formatNaira(item.price)}</p>
              ) : (
                <p className="mt-2 text-gray-400">Quote on request</p>
              )}

              <p className="mt-5 text-sm text-gray-400 leading-relaxed line-clamp-4">{descriptionText}</p>

              <div className="mt-8 space-y-3">
                {canPurchase ? (
                  <>
                    {isInCart ? (
                      <button
                        type="button"
                        onClick={handleRemoveFromCart}
                        className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-300 border border-emerald-400/25"
                      >
                        Remove from cart
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide bg-gradient-to-r from-Secondarycolor to-[#f97316] text-white shadow-lg shadow-Secondarycolor/20 hover:opacity-95 transition-opacity"
                      >
                        Add to cart
                      </button>
                    )}
                    <Link
                      to={checkoutUrl}
                      className="w-full inline-flex items-center justify-center py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      Buy now
                    </Link>
                  </>
                ) : (
                  <Link
                    to={`/contact?service=${item.slug}`}
                    className="w-full inline-flex items-center justify-center py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white"
                  >
                    Request quote
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Bottom — what's included (replaces reviews section in reference) */}
          {item.features?.length > 0 && (
            <section className="mt-10 pt-8 border-t border-white/10">
              <h2 className="text-sm font-bold text-textcolor2 mb-5">What&apos;s included</h2>
              <ul className="space-y-3">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-2.5 text-gray-400 min-w-0">
                      <FaCheckCircle className="w-3.5 h-3.5 text-Secondarycolor shrink-0" />
                      <span className="truncate">{feature}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
    </div>
  );
};

export default ProductDetails;
