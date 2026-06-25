export const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(amount || 0));

export const PRODUCT_COVER_ASPECT = "16 / 10";
/** Recommended upload size for catalogue cover images (matches blog cards). */
export const PRODUCT_COVER_IMAGE_HINT = "1200 × 750 px (16:10), JPG or WebP, under 500 KB";

export const catalogueFallbacks = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
  "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
];

export const cardImage = (item, index) =>
  item?.imageUrl || catalogueFallbacks[index % catalogueFallbacks.length];

export const deliveryLabel = (item) => {
  if (item?.deliveryType === "digital_file" || item?.hasInstantDownload) {
    return "Instant download";
  }
  if (item?.deliveryType === "digital_link" || item?.hasExternalDelivery) {
    return "Digital access";
  }
  if (item?.isDigitalProduct) {
    return "Digital product";
  }
  return null;
};

export const paymentTypeLabel = (item) =>
  item?.paymentType === "deposit" ? "Deposit" : "Full payment";
