import { getFeed } from "../server/feed.js";

export default async function handler(req, res) {
  const result = await getFeed({
    limit: Number(req.query.limit) || 20,
    after: req.query.after || null,
    env: process.env,
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });

  res.setHeader(
    "Cache-Control",
    `s-maxage=${result.cacheSeconds}, stale-while-revalidate=3600`
  );
  res.status(200).json(result.body);
}