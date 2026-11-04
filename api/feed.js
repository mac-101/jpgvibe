import { getXFeed } from "../server/x.js";

export default async function handler(req, res) {
  const result = await getXFeed({
    limit: Number(req.query.limit) || 20,
    after: req.query.after,
    env: process.env,
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });

  // Cache for 6 hours so X is only called (and billed) a few times a day
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=3600");
  res.status(200).json(result.body);
}