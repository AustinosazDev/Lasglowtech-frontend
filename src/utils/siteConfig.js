/** Single canonical origin — no trailing slash. */
export const SITE_URL = "https://lasglowtech.com.ng";

export const SITE_NAME = "Lasglowtech";
export const SITE_TAGLINE = "Creativity • Precision • Reliability";

export const DEFAULT_TITLE =
  "Lasglowtech | Creative Technology Company | Web, Apps, Branding & AI";

export const DEFAULT_DESCRIPTION =
  "Lasglowtech is a creative technology company in Nigeria. We build websites, mobile apps, UI/UX, branding, SEO, AI solutions, and digital products for ambitious brands — including packaging, apparel, and vehicle branding production.";

export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
  "Lasglowtech — creative technology company for web, apps, and digital solutions in Nigeria";

export const THEME_COLOR = "#120b1f";

export const CONTACT = {
  email: "lasglowtech@gmail.com",
  phone: "+2349031821590",
  phoneDisplay: "+234 903 182 1590",
  address: {
    streetAddress: "Gwarinpa",
    addressLocality: "Abuja",
    addressRegion: "FCT",
    addressCountry: "NG",
  },
};

export const SOCIAL_PROFILES = [
  "https://linkedin.com/in/austinosaz",
  "https://twitter.com/OmozemojeAugus1",
  "https://www.instagram.com/lasglowtech",
  "https://m.facebook.com/omozemoje.augustineoisasoje",
];

export const SERVICES_OFFERED = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Graphic Design",
  "Branding",
  "SEO",
  "AI Solutions",
  "IT Training",
  "Digital Product Development",
  "Product Packaging Design",
  "Apparel & T-Shirt Branding",
  "Vehicle Branding",
  "Signage & Large Format Print",
];

/** Build absolute URL from path segment. */
export const absoluteUrl = (path = "/") => {
  if (!path || path === "/") return `${SITE_URL}/`;
  if (path.startsWith("http")) return path.replace(/\/$/, "") || SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
