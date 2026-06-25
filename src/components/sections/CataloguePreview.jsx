import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import instance from "../../config/axios.config";
import CatalogueProductCard from "../CatalogueProductCard";

const CataloguePreview = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await instance.get("/catalogues/preview");
        setItems(res.data || []);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);

  return (
    <section className="px-6 md:px-20 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-Secondarycolor">Marketplace</p>
            <h2 className="text-textcolor2 mt-2">Services &amp; Digital Products</h2>
            <p className="text-muted text-sm max-w-2xl mt-2 leading-relaxed">
              Pay online and get instant access to eBooks, templates, and service packages — no back-and-forth required.
            </p>
          </div>
          <Link
            to="/catalogues"
            className="inline-flex items-center gap-2 text-sm font-medium text-Secondarycolor hover:underline shrink-0"
          >
            View full catalogue
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item, index) => (
            <CatalogueProductCard key={item.id} item={item} index={index} />
          ))}
          {!items.length && (
            <div className="col-span-full brand-card p-6 text-muted text-sm">
              Catalogue preview will appear after admin creates and publishes catalogue items.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CataloguePreview;
