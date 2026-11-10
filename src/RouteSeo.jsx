import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_OG_IMAGE, PAGE_SEO, SITE_URL } from "./seo";

const SITE_ORIGIN = SITE_URL.replace(/\/+$/, "");

function upsertHeadTag(selector, tagName, attributes) {
  const matches = document.head.querySelectorAll(selector);
  const element = matches[0] ?? document.createElement(tagName);

  for (const duplicate of Array.from(matches).slice(1)) {
    duplicate.remove();
  }

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }

  if (!element.isConnected) document.head.append(element);
}

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGE_SEO[pathname];
    const title = page?.title ?? "Page not found | thevibe.";
    const description =
      page?.description ?? PAGE_SEO["/"].description;
    const canonical = `${SITE_ORIGIN}${pathname}`;
    const image = `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`;

    document.title = title;
    upsertHeadTag('meta[name="description"]', "meta", {
      name: "description",
      content: description,
    });
    upsertHeadTag('link[rel="canonical"]', "link", {
      rel: "canonical",
      href: canonical,
    });

    const metadata = [
      ['meta[property="og:title"]', "property", "og:title", title],
      ['meta[property="og:description"]', "property", "og:description", description],
      ['meta[property="og:url"]', "property", "og:url", canonical],
      ['meta[property="og:image"]', "property", "og:image", image],
      ['meta[name="twitter:title"]', "name", "twitter:title", title],
      ['meta[name="twitter:description"]', "name", "twitter:description", description],
      ['meta[name="twitter:image"]', "name", "twitter:image", image],
    ];

    for (const [selector, attribute, name, content] of metadata) {
      upsertHeadTag(selector, "meta", { [attribute]: name, content });
    }

    const robots = document.head.querySelectorAll('meta[name="robots"]');
    if (page) {
      robots.forEach((tag) => tag.remove());
    } else {
      upsertHeadTag('meta[name="robots"]', "meta", {
        name: "robots",
        content: "noindex",
      });
    }
  }, [pathname]);

  return null;
}
