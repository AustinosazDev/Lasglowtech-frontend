import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import SEO from "../utils/seo";
import { LOGO } from "../components/images";
import { addToCart, readCart, removeFromCart } from "../utils/cart";
import { isAuthenticated } from "../utils/auth";

const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount || 0));

const catalogueFallbacks = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
  "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=1200",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
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

const CatalogueDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cartItems, setCartItems] = useState(() => readCart());

  const authed = isAuthenticated();
  const isInCart = useMemo(() => cartItems.some((entry) => entry.slug === slug), [cartItems, slug]);
  const heroImage = item?.imageUrl || catalogueFallbacks[0];
  const paymentLabel = item?.paymentType === "deposit" ? "Deposit payment" : "Full payment";
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(`/checkout/${slug}`)}`;
  const registerUrl = `/auth/register?redirect=${encodeURIComponent(`/checkout/${slug}`)}`;

  useEffect(() => {
    let cancelled = false;

    const loadItem = async () => {
      try {
        const res = await instance.get(`/catalogues/${slug}`);
        if (!cancelled) {
          setItem(res.data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.error || "Unable to load this catalogue.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadItem();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "lasglowtech_catalogue_cart") {
        setCartItems(readCart());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleAddToCart = () => {
    if (!item) return;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bgcolor text-textcolor2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
          <div className="h-14 rounded-xl bg-bgcolor2/70 mb-8" />
          <div className="aspect-[16/8] rounded-[32px] bg-bgcolor2/70 mb-8" />
          <div className="h-10 w-2/3 rounded-lg bg-bgcolor2/70 mb-4" />
          <div className="h-4 w-full rounded bg-bgcolor2/70 mb-2" />
          <div className="h-4 w-5/6 rounded bg-bgcolor2/70" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-bgcolor text-textcolor2">
        <header className="sticky top-0 z-50 border-b border-Primarycolor/20 bg-bgcolor2/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor transition-colors">
              <img src={LOGO} width={32} height={32} alt="Lasglowtech" className="rounded" />
              <span className="font-semibold text-sm">Lasglowtech</span>
            </Link>
            <Link to="/catalogues" className="text-sm text-gray-400 hover:text-Secondarycolor flex items-center gap-1">
              <FaChevronLeft className="w-3.5 h-3.5" />
              Back to catalogues
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold mb-3">Catalogue not found</h1>
          <p className="text-gray-400 mb-8">This package may have been removed or is no longer published.</p>
          <Link
            to="/catalogues"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to catalogue list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgcolor text-textcolor2">
      <SEO
        title={`${item.title} | Service Catalogue | Lasglowtech`}
        description={item.summary || item.description || `Explore ${item.title} on Lasglowtech.`}
        url={`https://www.lasglowtech.com.ng/catalogues/${item.slug}`}
      />

      <header className="sticky top-0 z-50 border-b border-Primarycolor/20 bg-bgcolor2/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor transition-colors">
            <img src={LOGO} width={32} height={32} alt="Lasglowtech" className="rounded" />
            <span className="font-semibold text-sm">Lasglowtech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/catalogues" className="text-sm text-gray-400 hover:text-Secondarycolor flex items-center gap-1">
              <FaChevronLeft className="w-3.5 h-3.5" />
              All packages
            </Link>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link to="/catalogues" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-Secondarycolor mb-6">
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to catalogues
        </Link>

        <section className="rounded-[32px] overflow-hidden border border-Primarycolor/20 bg-bgcolor2/40">
          <div className="relative min-h-[340px] md:min-h-[430px]">
            <img
              src={heroImage}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(event) => {
                event.target.src = catalogueFallbacks[1];
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,16,0.2),rgba(8,4,16,0.82))]" />
            <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end min-h-[340px] md:min-h-[430px]">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="px-3 py-1.5 rounded-full bg-bgcolor2/80 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/90">
                  {item.packageTier || "standard"}
                </span>
                {item.isPopular && (
                  <span className="px-3 py-1.5 rounded-full bg-Secondarycolor/15 border border-Secondarycolor/40 text-xs uppercase tracking-[0.18em] text-Secondarycolor">
                    Most Popular
                  </span>
                )}
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.18em] text-white/70">
                  {item.isPaymentEnabled ? "Online checkout available" : "Quote first"}
                </span>
              </div>

              <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                  {item.title}
                </h1>
                <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
                  {item.summary || "A tailored digital service package built to help you move faster with clarity."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 p-6 md:p-8">
            <div>
              <div className="brand-card rounded-[24px] p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-Secondarycolor mb-3">Overview</p>
                <p className="text-sm md:text-base text-gray-300 leading-8 whitespace-pre-line">
                  {item.description || item.summary || "No additional package description available yet."}
                </p>
              </div>

              {!!item.features?.length && (
                <div className="mt-6 brand-card rounded-[24px] p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-Secondarycolor mb-4">What you get</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {item.features.map((feature) => (
                      <div
                        key={feature}
                        className="brand-card rounded-2xl px-4 py-4 flex items-start gap-3"
                      >
                        <FaCheckCircle className="w-4 h-4 mt-1 text-Secondarycolor flex-shrink-0" />
                        <p className="text-sm text-gray-300 leading-6">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="brand-card rounded-[28px] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Pricing</p>
                {item.isPaymentEnabled ? (
                  <>
                    <p className="text-3xl font-semibold text-Secondarycolor mt-3">{formatNaira(item.price)}</p>
                    <p className="text-sm text-gray-400 mt-2">{paymentLabel}</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-textcolor2 mt-3">Custom quote</p>
                    <p className="text-sm text-gray-400 mt-2">We will review your needs before sending pricing.</p>
                  </>
                )}

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                  >
                    {item.isPaymentEnabled ? "Proceed to checkout" : "Request this service"}
                  </button>

                  {isInCart ? (
                    <button
                      type="button"
                      onClick={handleRemoveFromCart}
                      className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-2xl border border-red-400/60 text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      Remove from cart
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-2xl border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor hover:text-white transition-colors"
                    >
                      Add to cart
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm text-gray-400">
                  <p>Review the full package details before payment, then continue with the option that fits you best.</p>
                  <p>If you are not signed in, payment will take you through client login or registration first.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {showCheckoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
          onClick={() => setShowCheckoutModal(false)}
          role="presentation"
        >
          <div
            className="brand-card w-full max-w-xl rounded-[28px] p-6 md:p-7"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${item.title} checkout options`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-Secondarycolor mb-2">Next step</p>
                <h2 className="text-xl md:text-2xl font-semibold text-textcolor2">{item.title}</h2>
                <p className="text-sm text-gray-400 mt-2">
                  {item.isPaymentEnabled
                    ? `Continue with ${paymentLabel.toLowerCase()} or save this package to your cart.`
                    : "Send your request and we will guide you with pricing and kickoff details."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="brand-card mt-5 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Package price</p>
              <p className="text-2xl font-semibold text-Secondarycolor mt-1">
                {item.isPaymentEnabled ? formatNaira(item.price) : "Quote on request"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Payment: {item.isPaymentEnabled ? item.paymentType || "full" : "consultation required"}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {item.isPaymentEnabled ? (
                authed ? (
                  <Link
                    to={`/checkout/${item.slug}`}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                  >
                    Buy now
                  </Link>
                ) : (
                  <>
                    <Link
                      to={loginUrl}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                    >
                      Login to checkout
                    </Link>
                    <Link
                      to={registerUrl}
                      className="px-5 py-3 rounded-2xl border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor hover:text-white transition-colors"
                    >
                      Create account
                    </Link>
                  </>
                )
              ) : (
                <Link
                  to={`/contact?service=${item.slug}`}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white font-medium hover:opacity-95 transition-opacity"
                >
                  Ask for quote
                </Link>
              )}

              {isInCart ? (
                <button
                  type="button"
                  onClick={handleRemoveFromCart}
                  className="px-5 py-3 rounded-2xl border border-red-400/60 text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  Remove from cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-5 py-3 rounded-2xl border border-Primarycolor/40 text-Primarycolor hover:bg-Primarycolor hover:text-white transition-colors"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogueDetail;
