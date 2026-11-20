import { getInstagramFeed } from "./instagram.js";
import { getXFeed } from "./x.js";

const HALF_HOUR = 1800;
const SIX_HOURS = 21600; // X costs credits per post, so cache it longer

export async function getFeed({ limit = 20, after = null, env }) {
  const sources = (env.FEED_SOURCES || "instagram")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const useInstagram = sources.includes("instagram");
  const useX = sources.includes("x");
  const cacheSeconds = useX ? SIX_HOURS : HALF_HOUR;

  if (!useInstagram && !useX) {
    return { ok: false, status: 500, error: "no_feed_sources" };
  }
  if (useInstagram && !useX) {
    return { ...(await getInstagramFeed({ limit, after, env })), cacheSeconds };
  }
  if (useX && !useInstagram) {
    return { ...(await getXFeed({ limit, after, env })), cacheSeconds };
  }

  // Both sources: one merged first page (more pages aren't merged yet)
  if (after) {
    return { ok: true, body: { data: [], paging: { after: null, hasMore: false } }, cacheSeconds };
  }
  const results = await Promise.all([
    getInstagramFeed({ limit, env }),
    getXFeed({ limit, env }),
  ]);
  const good = results.filter((r) => r.ok);
  if (!good.length) return results[0];

  const data = good
    .flatMap((r) => r.body.data)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);

  return { ok: true, body: { data, paging: { after: null, hasMore: false } }, cacheSeconds };
}