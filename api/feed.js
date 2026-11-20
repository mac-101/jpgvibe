
import { getFeed } from "../server/feed.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "method_not_allowed" });
    }

    const result = await getFeed({
      limit: Number(req.query.limit) || 40,
      after: req.query.after || null,
      env: process.env,
    });

    if (!result.ok) {
      console.error("[api/feed] Feed error:", {
        status: result.status,
        error: result.error,
      });

      return res.status(result.status).json({
        error: result.error,
      });
    }

    res.setHeader(
      "Cache-Control",
      `s-maxage=${result.cacheSeconds}, stale-while-revalidate=3600`
    );

    return res.status(200).json(result.body);
  } catch (error) {
    console.error("[api/feed] Unexpected error:", error.message);

    return res.status(500).json({
      error: "feed_server_error",
    });
  }
}
29