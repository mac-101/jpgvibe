export const formatCount = (n) =>
  n == null
    ? null
    : new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n);

export const formatDate = (ts) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(ts));

export const getThumb = (post) => post.media[0]?.thumb;

export const buildSrcSet = (url) => {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.unsplash.com") {
      return [400, 700, 1000]
        .map((width) => {
          const variant = new URL(parsed);
          variant.searchParams.set("w", String(width));
          return `${variant.href} ${width}w`;
        })
        .join(", ");
    }

    if (parsed.hostname === "pbs.twimg.com") {
      return ["small 680w", "medium 1200w", "large 2048w"]
        .map((variant) => {
          const [name, width] = variant.split(" ");
          const image = new URL(parsed);
          image.searchParams.set("name", name);
          return `${image.href} ${width}`;
        })
        .join(", ");
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const hasMedia = (post) =>
  Array.isArray(post.media) && post.media.length > 0;

export const snippet = (caption = "", max = 90) => {
  const flat = caption.replace(/\s+/g, " ").trim();
  if (!flat) return "No caption";
  return flat.length > max ? `${flat.slice(0, max).trim()}…` : flat;
};