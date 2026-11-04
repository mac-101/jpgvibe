export const formatCount = (n) =>
  n == null
    ? null
    : new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n);

// Instagram sends "+0000", but Safari only accepts "+00:00"
export const parseIgDate = (ts) =>
  new Date(ts.replace(/([+-]\d{2})(\d{2})$/, "$1:$2"));

export const formatDate = (ts) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(parseIgDate(ts));

export const getThumb = (post) => {
  const media = post.media?.[0];
  return (
    media?.thumb ??
    media?.url ??
    (post.media_type === "VIDEO"
      ? post.thumbnail_url ?? post.media_url
      : post.media_url)
  );
};

export const hasMedia = (post) =>
  Array.isArray(post.media) && post.media.length > 0;

export const snippet = (caption = "", max = 90) => {
  const flat = caption.replace(/\s+/g, " ").trim();
  if (!flat) return "No caption";
  return flat.length > max ? `${flat.slice(0, max).trim()}…` : flat;
};