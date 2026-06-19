import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaArrowRight, FaChevronLeft, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { readCart } from "../utils/cart";
import SEO from "../utils/seo";
import { LOGO } from "../components/images";
import { CatalogueCardSkeletonGrid } from "../components/skeletons/CardSkeletons";

const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount || 0));

const catalogueFallbacks = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
  "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
  "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=600",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600",
];

const cardImage = (item, index) => item.imageUrl || catalogueFallbacks[index % catalogueFallbacks.length];
const PAGE_SIZE = 9;

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "starter", label: "Starter" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const Catalogues = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState(() => readCart());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await instance.get("/catalogues");
        setItems(res.data || []);
      } catch (error) {
        toast.error("Unable to load catalogues.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "lasglowtech_catalogue_cart") {
        setCartItems(readCart());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;
    const q = (searchQuery || "").toLowerCase().trim();
    if (q) {
      list = list.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.summary || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter((item) => (item.packageTier || "standard") === categoryFilter);
    }
    return list;
  }, [items, searchQuery, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const cartSlugSet = useMemo(() => new Set(cartItems.map((item) => item.slug)), [cartItems]);

  return (
    <div className="min-h-screen bg-bgcolor text-textcolor2">
      <SEO
        title="Service Catalogue | Buy Digital Services Online with Instant Checkout | Lasglowtech"
        description="Browse Lasglowtech service packages, compare what each one includes, and move into checkout with confidence."
        keywords="Lasglowtech catalogue, buy services online Nigeria, instant checkout, service packages, web development package, digital agency Nigeria"
        url="https://www.lasglowtech.com.ng/catalogues"
      />

      <header className="sticky top-0 z-50 border-b border-Primarycolor/20 bg-bgcolor2/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor transition-colors">
            <img src={LOGO} width={32} height={32} alt="Lasglowtech" className="rounded" />
            <span className="font-semibold text-sm">Lasglowtech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-Secondarycolor flex items-center gap-1">
              <FaChevronLeft className="w-3.5 h-3.5" />
              Back to main site
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm text-textcolor2 hover:text-Secondarycolor transition-colors font-medium"
              aria-label="Open cart"
            >
              <span className="relative">
                <FaShoppingCart className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 min-w-[18px] px-1 rounded-full bg-Secondarycolor text-white text-[0.7rem] font-semibold flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </span>
              Cart
            </Link>
          </div>
        </div>
      </header>

      <section className="relative border-b border-Primarycolor/20 bg-bgcolor overflow-hidden py-16 sm:py-20 md:py-24 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase mb-6">
            Client Marketplace
          </p>
          <h1 className="text-textcolor2">
            <span className="block">Instant Access to</span>
            <span className="block mt-1 text-Secondarycolor">Our Services</span>
          </h1>
          <p className="mt-6 type-lead text-gray-400 max-w-2xl mx-auto">
            Compare packages, open the full service breakdown on its own page, then move into checkout when you are ready.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="#catalogue-grid"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-Secondarycolor text-white font-semibold hover:opacity-95 transition-opacity"
              >
                Explore Packages
                <FaArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-Secondarycolor/60 text-Secondarycolor font-semibold hover:bg-Secondarycolor/10 transition-colors"
              >
                <FaShoppingCart className="w-4 h-4" />
                View Cart
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div id="catalogue-grid" className="max-w-6xl mx-auto px-6 md:px-12 py-10 scroll-mt-4">
        {loading && <CatalogueCardSkeletonGrid count={9} className="py-4" />}

        {!loading && (
          <>
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by title, summary, or description..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-Primarycolor/25 bg-bgcolor/80 text-textcolor2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-Primarycolor/40 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" aria-hidden>
                    <FaSearch className="w-4 h-4" />
                  </span>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-Primarycolor/25 bg-Primarycolor text-textcolor2 text-sm focus:outline-none focus:ring-2 focus:ring-Primarycolor/40 min-w-[180px]"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:grid-cols-3 md:gap-6">
              {pagedItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`group brand-card rounded-[28px] overflow-hidden shadow-md hover:shadow-xl ${
                    item.isPopular ? "ring-1 ring-Secondarycolor/40" : ""
                  }`}
                >
                  <Link to={`/catalogues/${item.slug}`} className="block h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={cardImage(item, (currentPage - 1) * PAGE_SIZE + index)}
                        alt={item.title}
                        className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120b1f] via-[#120b1f]/20 to-transparent" />
                      <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between gap-3">
                        <span className="text-[0.7rem] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-bgcolor2/80 border border-white/10 text-textcolor2">
                          {item.packageTier || "standard"}
                        </span>
                        {item.isPopular && (
                          <span className="text-[0.7rem] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-Secondarycolor/15 border border-Secondarycolor/40 text-Secondarycolor">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/65 mb-2">
                          {item.isPaymentEnabled ? "Ready for checkout" : "Project consultation"}
                        </p>
                        <h2 className="text-xl font-semibold text-white leading-tight">{item.title}</h2>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                      <div>
                        <p className="text-[0.95rem] text-textcolor2 leading-relaxed">
                          {item.summary?.slice(0, 95)}
                          {item.summary?.length > 95 ? "..." : ""}
                        </p>
                        <p className="text-[0.84rem] text-gray-400 leading-relaxed mt-2">
                          {item.description?.slice(0, 120)}
                          {item.description?.length > 120 ? "..." : ""}
                        </p>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-4 pt-2">
                        <div>
                          {item.isPaymentEnabled ? (
                            <>
                              <p className="text-[0.78rem] uppercase tracking-[0.18em] text-gray-500">
                                {item.paymentType === "deposit" ? "Deposit" : "Full payment"}
                              </p>
                              <p className="text-xl font-semibold text-Secondarycolor mt-1">{formatNaira(item.price)}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-[0.78rem] uppercase tracking-[0.18em] text-gray-500">Pricing</p>
                              <p className="text-sm font-medium text-textcolor2 mt-1">Quote on request</p>
                            </>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-Primarycolor/40 text-sm font-medium text-Primarycolor group-hover:bg-Primarycolor group-hover:text-white transition-colors">
                            View details
                            <FaArrowRight className="w-3.5 h-3.5" />
                          </span>
                          {cartSlugSet.has(item.slug) && (
                            <p className="text-[0.75rem] text-Secondarycolor mt-2">Already in cart</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}

              {!filteredItems.length && (
                <p className="text-gray-400 text-center col-span-full py-12 text-sm">
                  {items.length ? "No items match your search or filter." : "No catalogue items yet."}
                </p>
              )}
            </div>

            {filteredItems.length > PAGE_SIZE && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-Primarycolor/30 text-sm disabled:opacity-50 hover:bg-Primarycolor/15 transition"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const active = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[34px] px-2.5 py-2 rounded-lg text-sm border transition ${
                        active
                          ? "border-Secondarycolor bg-Secondarycolor/20 text-Secondarycolor font-semibold"
                          : "border-Primarycolor/30 hover:bg-Primarycolor/15"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-Primarycolor/30 text-sm disabled:opacity-50 hover:bg-Primarycolor/15 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Catalogues;
