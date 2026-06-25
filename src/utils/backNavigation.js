/** Routes in a multi-step flow where a back control is appropriate. */
export const isStepFlowRoute = (pathname) => {
  if (!pathname) return false;
  if (pathname.startsWith("/catalogues/") || pathname.startsWith("/products/")) return true;
  if (pathname === "/cart") return true;
  if (pathname.startsWith("/checkout/")) return true;
  if (pathname === "/payment/success") return true;
  if (pathname.startsWith("/download/")) return true;
  return false;
};

export const getBackFallback = (pathname) => {
  const checkoutMatch = pathname.match(/^\/checkout\/([^/]+)/);
  if (checkoutMatch) return `/catalogues/${checkoutMatch[1]}`;

  if (pathname.startsWith("/catalogues/") || pathname.startsWith("/products/")) {
    return "/catalogues";
  }
  if (pathname === "/cart" || pathname === "/payment/success" || pathname.startsWith("/download/")) {
    return "/catalogues";
  }
  return "/catalogues";
};
