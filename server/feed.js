
import { getInstagramFeed } from "./instagram.js";
import { getXFeed } from "./x.js";

const HALF_HOUR = 1800;
const SIX_HOURS = 21600;

function getSources(env) {
  return (env.FEED_SOURCES || "instagram")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s === "instagram" || s === "x");
}

function decodeCursor(after) {
  if (!after) {
    return {
      instagram: { after: null, hasMore: true },
      x: { after: null, hasMore: true },
    };
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(after, "base64url").toString("utf8")
    );

    return {
      instagram: {
        after: parsed.instagram?.after ?? null,
        hasMore: parsed.instagram?.hasMore !== false,
      },
      x: {
        after: parsed.x?.after ?? null,
        hasMore: parsed.x?.hasMore !== false,
      },
    };
  } catch {
    return null;
  }
}

async function fetchSource(source, state, limit, env) {
  const fetcher =
    source === "instagram" ? getInstagramFeed : getXFeed;

  const result = await fetcher({
    limit,
    after: state.after,
    env,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const paging = result.body?.paging || {};
  const nextAfter = paging.after ?? null;

  return {
    ok: true,
    data: Array.isArray(result.body?.data)
      ? result.body.data
      : [],
    state: {
      after: nextAfter,
      hasMore: Boolean(paging.hasMore && nextAfter),
    },
  };
}

export async function getFeed({
  limit = 40,
  after = null,
  env,
}) {
  const sources = getSources(env);

  const useInstagram = sources.includes("instagram");
  const useX = sources.includes("x");

  const cacheSeconds = useX ? SIX_HOURS : HALF_HOUR;

  if (!sources.length) {
    return {
      ok: false,
      status: 500,
      error: "no_feed_sources",
    };
  }

  // Preserve normal pagination for single-source feeds.
  if (useInstagram && !useX) {
    return {
      ...(await getInstagramFeed({ limit, after, env })),
      cacheSeconds,
    };
  }

  if (useX && !useInstagram) {
    return {
      ...(await getXFeed({ limit, after, env })),
      cacheSeconds,
    };
  }

  // Combined feed.
  const state = decodeCursor(after);

  if (!state) {
    return {
      ok: false,
      status: 400,
      error: "invalid_feed_cursor",
    };
  }

  const sourceLimit = Math.ceil(limit / 2);

  const data = [];
  const counts = {
    instagram: 0,
    x: 0,
  };

  const failedThisRequest = new Set();

  // Fetch the first batch from both providers.
  const initialResults = await Promise.all(
    sources.map(async (source) => {
      if (!state[source].hasMore) {
        return { source, skipped: true };
      }

      const result = await fetchSource(
        source,
        state[source],
        sourceLimit,
        env
      );

      return { source, result };
    })
  );

  for (const item of initialResults) {
    if (item.skipped) continue;

    if (!item.result.ok) {
      failedThisRequest.add(item.source);
      continue;
    }

    state[item.source] = item.result.state;

    data.push(...item.result.data);
    counts[item.source] += item.result.data.length;
  }

  // If one provider returned fewer posts, use the other
  // provider to fill the remaining space when possible.
  while (data.length < limit) {
    const available = sources
      .filter(
        (source) =>
          state[source].hasMore &&
          !failedThisRequest.has(source)
      )
      .sort(
        (a, b) => counts[b] - counts[a]
      );

    if (!available.length) break;

    const source = available[0];
    const remaining = limit - data.length;

    const result = await fetchSource(
      source,
      state[source],
      remaining,
      env
    );

    if (!result.ok) {
      failedThisRequest.add(source);
      continue;
    }

    const previousCursor = state[source].after;

    state[source] = result.state;

    data.push(...result.data);
    counts[source] += result.data.length;

    // Prevent an endless loop if a provider gives us
    // no posts and does not advance its cursor.
    if (
      result.data.length === 0 &&
      state[source].hasMore &&
      state[source].after === previousCursor
    ) {
      state[source].hasMore = false;
    }
  }

  if (
    data.length === 0 &&
    failedThisRequest.size === sources.length
  ) {
    return {
      ok: false,
      status: 502,
      error: "feed_sources_failed",
    };
  }

  // Sort all returned posts together, newest first.
  data.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );

  const hasMore = sources.some(
    (source) => state[source].hasMore
  );

  const nextCursor = hasMore
    ? Buffer.from(JSON.stringify(state)).toString("base64url")
    : null;

  return {
    ok: true,
    cacheSeconds,
    body: {
      data,
      paging: {
        after: nextCursor,
        hasMore,
      },
    },
  };
}
