import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import {
  SITE_URL,
  OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_ALT,
  THEME_COLOR,
} from "./siteConfig";

const SEO = ({
  title,
  description,
  url = SITE_URL,
  image = OG_IMAGE,
  imageAlt = OG_IMAGE_ALT,
  type = "website",
  schema = null,
  noindex = false,
}) => {
  const canonical = url.startsWith("http")
    ? url.replace(/\/$/, "") || `${SITE_URL}/`
    : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  const schemaItems = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const robots = noindex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content={THEME_COLOR} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content="Lasglowtech" />
      <meta property="og:locale" content="en_NG" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {schemaItems.map((item, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  type: PropTypes.string,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  noindex: PropTypes.bool,
};

export default SEO;
