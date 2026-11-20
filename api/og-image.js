
import { randomInt } from "node:crypto";

const artworkImages = Array.from(
  { length: 29 },
  (_, index) =>
    `/artwork/feed-${String(index + 1).padStart(2, "0")}.jpg`
);

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end("Method Not Allowed");
  }

  const selectedImage =
    artworkImages[randomInt(artworkImages.length)];

  const host =
    req.headers["x-forwarded-host"] || req.headers.host;

  const protocol =
    req.headers["x-forwarded-proto"] || "https";

  const imageUrl = `${protocol}://${host}${selectedImage}`;

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );

  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");

  res.setHeader("Location", imageUrl);

  return res.status(302).end();
}
