
import { getInstagramFeed } from "./instagram.js";
import { getXFeed } from "./x.js";

const HALF_HOUR = 1800;
const SIX_HOURS = 21600;

// Keep X's cache longer because its API uses credits.
function getCacheSeconds(useX) {
  return useX ? SIX_HOURS : HALF_HOUR;
}

// Encode both platform cursors and their unreturned posts
// into one cursor that the frontend can pass back.
function encodeCursor(state) {
  return Buffer.from(JSON.stringify(state)).toString("base64url");
}

function decodeCursor(cursor) {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8")
    );

    if (!parsed || !parsed.instagram || !parsed.x) {
      throw new Error("Invalid cursor structure");
    }

    return parsed;
  } catch {
    return null;
  }
}

function createInitialState() {
  return {
    instagram: {
      after: null,
      hasMore: true,
      buffer: [],
    },
    x: {
      after: null,
      hasMore: true,
      buffer: [],
    },
  };
}

async function fetchSourcePage(source, state, limit, env) {
  const previousCursor = state.after;

  const result =
    source === "instagram"
      ? await getInstagramFeed({
          limit,
          after: state.after,
          env,
        })
      : await getXFeed({
          limit,
          after: state.after,
          env,
        });

  if (!result.ok) {
    state.hasMore = false;
    return false;
  }

  const nextCursor = result.body.paging?.after ?? null;

  state.buffer.push(
    ...(result.body.data ?? []).filter(
      (post) => Array.isArray(post.media) && post.media.length > 0
    )
  );

  state.after = nextCursor;

  state.hasMore = Boolean(
    result.body.paging?.hasMore &&
    nextCursor &&
    nextCursor !== previousCursor
  );

  return true;
}

// Make sure a source has a post ready before comparing timestamps.
// If a provider page contains no media posts, keep fetching until
// we find one or that provider runs out of pages.
async function ensureHead(source, state, limit, env) {
  while (state.buffer.length === 0 && state.hasMore) {
    const success = await fetchSourcePage(source, state, limit, env);

    if (!success) break;
  }
}

async function getCombinedFeed({ limit, after, env }) {
  const state = after ? decodeCursor(after) : createInitialState();

  if (!state) {
    return {
      ok: false,
      status: 400,
      error: "invalid_cursor",
    };
  }

  // Keep provider requests within their supported limits.
  const batchSize = Math.min(Math.max(limit, 5), 50);

  const instagramState = state.instagram;
  const xState = state.x;

  const data = [];

  while (data.length < limit) {
    // Both sources need a next post before we can safely
    // determine which post is newest.
    await Promise.all([
      ensureHead("instagram", instagramState, batchSize, env),
      ensureHead("x", xState, batchSize, env),
    ]);

    const igPost = instagramState.buffer[0];
    const xPost = xState.buffer[0];

    if (!igPost && !xPost) break;

    if (!xPost) {
      data.push(instagramState.buffer.shift());
      continue;
    }

    if (!igPost) {
      data.push(xState.buffer.shift());
      continue;
    }

    const igTime = new Date(igPost.timestamp).getTime();
    const xTime = new Date(xPost.timestamp).getTime();

    if (igTime >= xTime) {
      data.push(instagramState.buffer.shift());
    } else {
      data.push(xState.buffer.shift());
    }
  }

  const hasMore =
    instagramState.buffer.length > 0 ||
    instagramState.hasMore ||
    xState.buffer.length > 0 ||
    xState.hasMore;

  return {
    ok: true,
    body: {
      data,
      paging: {
        after: hasMore
          ? encodeCursor(state)
          : null,
        hasMore,
      },
    },
  };
}

export async function getFeed({
  limit = 20,
  after = null,
  env,
}) {
  const sources = (env.FEED_SOURCES || "instagram")
    .split(",")
    .map((source) => source.trim().toLowerCase())
    .filter(Boolean);

  const useInstagram = sources.includes("instagram");
  const useX = sources.includes("x");

  if (!useInstagram && !useX) {
    return {
      ok: false,
      status: 500,
      error: "no_feed_sources",
    };
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const cacheSeconds = getCacheSeconds(useX);

  // Single-source feeds keep their native provider cursors.
  if (useInstagram && !useX) {
    return {
      ...(await getInstagramFeed({
        limit: safeLimit,
        after,
        env,
      })),
      cacheSeconds,
    };
  }

  if (useX && !useInstagram) {
    return {
      ...(await getXFeed({
        limit: safeLimit,
        after,
        env,
      })),
      cacheSeconds,
    };
  }

  // Both platforms: merge posts chronologically and paginate
  // using one combined cursor.
  const result = await getCombinedFeed({
    limit: safeLimit,
    after,
    env,
  });

  return {
    ...result,
    cacheSeconds,
  };
}
