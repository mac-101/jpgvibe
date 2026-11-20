
import { deflateRawSync, inflateRawSync } from "node:zlib";
import { getInstagramFeed } from "./instagram.js";
import { getXFeed } from "./x.js";

const HALF_HOUR = 1800;
const SIX_HOURS = 21600;

function getCacheSeconds(useX) {
  return useX ? SIX_HOURS : HALF_HOUR;
}

// Compress the combined cursor to keep the GET URL smaller.
function encodeCursor(state) {
  const json = JSON.stringify(state);
  return deflateRawSync(Buffer.from(json)).toString("base64url");
}

function decodeCursor(cursor) {
  try {
    if (typeof cursor !== "string" || cursor.length > 100000) {
      return null;
    }

    const json = inflateRawSync(
      Buffer.from(cursor, "base64url")
    ).toString("utf8");

    const parsed = JSON.parse(json);

    for (const source of ["instagram", "x"]) {
      const item = parsed?.[source];

      if (
        !item ||
        !Array.isArray(item.buffer) ||
        typeof item.hasMore !== "boolean"
      ) {
        return null;
      }
    }

    return parsed;
  } catch (error) {
    console.error("[feed] Cursor decoding failed:", error.message);
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

  try {
    const result =
      source === "instagram"
        ? await getInstagramFeed({ limit, after: state.after, env })
        : await getXFeed({ limit, after: state.after, env });

    if (!result.ok) {
      console.error(`[feed] ${source} request failed:`, result.error);
      state.hasMore = false;
      return false;
    }

    const nextCursor = result.body.paging?.after ?? null;

    const posts = (result.body.data ?? []).filter(
      (post) => Array.isArray(post.media) && post.media.length > 0
    );

    state.buffer.push(...posts);
    state.after = nextCursor;

    state.hasMore = Boolean(
      result.body.paging?.hasMore &&
      nextCursor &&
      nextCursor !== previousCursor
    );

    return true;
  } catch (error) {
    console.error(`[feed] ${source} fetch exception:`, error.message);
    state.hasMore = false;
    return false;
  }
}

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

  const instagramState = state.instagram;
  const xState = state.x;

  const batchSize = Math.min(Math.max(limit, 5), 50);
  const data = [];

  while (data.length < limit) {
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

  let nextCursor = null;

  if (hasMore) {
    try {
      nextCursor = encodeCursor(state);
    } catch (error) {
      console.error("[feed] Cursor encoding failed:", error.message);

      return {
        ok: false,
        status: 500,
        error: "cursor_encoding_failed",
      };
    }
  }

  return {
    ok: true,
    body: {
      data,
      paging: {
        after: nextCursor,
        hasMore: Boolean(nextCursor),
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
