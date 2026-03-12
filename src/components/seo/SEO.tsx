import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
}

export default function SEO({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
}: SEOProps) {
  const canonicalUrl = `${SITE_URL}${path}`;
  const isHome = path === "/";
  const pageTitle = isHome ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd &&
        (Array.isArray(jsonLd)
          ? jsonLd.map((item, i) => (
              <script key={i} type="application/ld+json">
                {JSON.stringify(item)}
              </script>
            ))
          : (
              <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
              </script>
            ))}
    </Helmet>
  );
}
