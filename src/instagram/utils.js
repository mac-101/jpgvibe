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

// Videos need thumbnail_url. Everything else uses media_url.
export const getThumb = (post) =>
  post.media_type === "VIDEO"
    ? post.thumbnail_url ?? post.media_url
    : post.media_url;

export const snippet = (caption = "", max = 90) => {
  const flat = caption.replace(/\s+/g, " ").trim();
  if (!flat) return "No caption";
  return flat.length > max ? `${flat.slice(0, max).trim()}…` : flat;
};