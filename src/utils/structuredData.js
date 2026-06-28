import {
  SITE_URL,
  SITE_NAME,
  CONTACT,
  SOCIAL_PROFILES,
  SERVICES_OFFERED,
  OG_IMAGE,
} from "./siteConfig";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  slogan: "Creativity • Precision • Reliability",
  sameAs: SOCIAL_PROFILES,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phone,
    email: CONTACT.email,
    contactType: "customer service",
    areaServed: "NG",
    availableLanguage: ["English"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.address.addressLocality,
    addressRegion: CONTACT.address.addressRegion,
    addressCountry: CONTACT.address.addressCountry,
  },
  knowsAbout: SERVICES_OFFERED,
});

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address.streetAddress,
    addressLocality: CONTACT.address.addressLocality,
    addressRegion: CONTACT.address.addressRegion,
    addressCountry: CONTACT.address.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.0765,
    longitude: 7.3986,
  },
  areaServed: {
    "@type": "Country",
    name: "Nigeria",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital services",
    itemListElement: SERVICES_OFFERED.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
});

export const breadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
  })),
});

export const faqSchema = (faqs = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
});

export const defaultSiteSchemas = () => [organizationSchema(), localBusinessSchema()];
