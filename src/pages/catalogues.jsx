import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaArrowRight, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { readCart } from "../utils/cart";
import SEO from "../utils/seo";
import { LOGO } from "../components/images";
import { CatalogueCardSkeletonGrid } from "../components/skeletons/CardSkeletons";
import CatalogueProductCard from "../components/CatalogueProductCard";

const PAGE_SIZE = 9;

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "starter", label: "Starter" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "digital", label: "Digital products" },
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
      } catch {
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
    if (categoryFilter === "digital") {
      list = list.filter((item) => item.isDigitalProduct);
    } else if (categoryFilter) {
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
        title="Service Catalogue | Lasglowtech — Instant Checkout"
        description="Browse fixed-price web, design, and digital packages from Lasglowtech. Pay online and get started without lengthy quotes."
        url="/catalogues"
      />

      <header className="sticky top-0 z-50 border-b border-Primarycolor/20 bg-bgcolor2/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-3">
          <Link to="/" className="flex items-center gap-2 text-textcolor2 hover:text-Secondarycolor transition-colors min-w-0">
            <img src={LOGO} width={32} height={32} alt="Lasglowtech" className="rounded" />
            <span className="font-semibold text-sm truncate">Lasglowtech</span>
          </Link>
          <div className="flex items-center gap-4 shrink-0">
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

      <section className="relative border-b border-Primarycolor/20 bg-bgcolor overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase mb-6">Client Marketplace</p>
          <h1 className="text-textcolor2">
            <span className="block">Services &amp; Digital Products</span>
            <span className="block mt-1 text-Secondarycolor">Pay once, get instant access</span>
          </h1>
          <p className="mt-6 type-lead text-gray-400 max-w-2xl mx-auto">
            Buy service packages or digital downloads in a few clicks. eBooks and files unlock immediately after payment.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#catalogue-grid"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-Secondarycolor text-white font-semibold hover:opacity-95 transition-opacity"
            >
              Browse catalogue
              <FaArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-Secondarycolor/60 text-Secondarycolor font-semibold hover:bg-Secondarycolor/10 transition-colors"
            >
              <FaShoppingCart className="w-4 h-4" />
              View cart
            </Link>
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
                    placeholder="Search products, services, eBooks…"
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-Primarycolor/25 bg-bgcolor/80 text-textcolor2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-Primarycolor/40"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {pagedItems.map((item, index) => (
                <CatalogueProductCard
                  key={item.id}
                  item={item}
                  index={(currentPage - 1) * PAGE_SIZE + index}
                  inCart={cartSlugSet.has(item.slug)}
                  onCartChange={() => setCartItems(readCart())}
                />
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
