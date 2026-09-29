/** Public origin used for canonical and og:url tags. */
export const SITE_URL = "https://pickle-clothing.higgsfield.app";
export const SITE_NAME = "PICKLE";
export const THEME_COLOR = "#FAF8F5";
export const DEFAULT_DESCRIPTION =
  "PICKLE makes caps, heavyweight tees, tailored shorts and Belgian linen shirts for the long Indian summer. Familiar garments, reconstructed without the hype.";

type HeadInput = {
  title: string;
  description?: string;
  path: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
};

export function pageHead({ title, description = DEFAULT_DESCRIPTION, path, type = "website", noindex }: HeadInput) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
