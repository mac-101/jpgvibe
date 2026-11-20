const FIELDS =
  "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count,children{id,media_type,media_url}";

// Instagram sends "+0000", which some browsers dislike, so make it a normal ISO date
function toIso(ts) {
  const d = new Date(String(ts).replace(/([+-]\d{2})(\d{2})$/, "$1:$2"));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function normalize(item) {
  const cover = item.thumbnail_url ?? item.media_url ?? null;
  let media = [];

  if (item.media_type === "CAROUSEL_ALBUM" && item.children?.data?.length) {
    media = item.children.data
      .map((child) =>
        child.media_type === "VIDEO"
          ? { type: "video", url: child.media_url, thumb: cover }
          : { type: "image", url: child.media_url, thumb: child.media_url }
      )
      .filter((m) => m.url);
  } else if (item.media_type === "VIDEO") {
    if (item.media_url) {
      media = [{ type: "video", url: item.media_url, thumb: item.thumbnail_url ?? cover }];
    }
  } else if (item.media_url) {
    media = [{ type: "image", url: item.media_url, thumb: item.media_url }];
  }

  const timestamp = toIso(item.timestamp);
  if (!timestamp) return null;

  // Likes can be missing when the owner hides them
  const metrics = {};
  if (typeof item.like_count === "number") metrics.likes = item.like_count;
  if (typeof item.comments_count === "number") metrics.comments = item.comments_count;

  return {
    id: `ig_${item.id}`,
    source: "instagram",
    text: item.caption ?? "",
    media,
    permalink: item.permalink,
    timestamp,
    metrics,
  };
}

export async function getInstagramFeed({ limit = 20, after = null, env }) {
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  const userId = env.INSTAGRAM_USER_ID;

  // Tokens starting with EAA come from Facebook Login and need the account's ID.
  // Instagram Login tokens work with /me.
  const facebookToken = Boolean(token) && token.startsWith("EAA");
  if (!token || (facebookToken && !userId)) {
    return { ok: false, status: 500, error: "missing_settings" };
  }

  const base = facebookToken
    ? `https://graph.facebook.com/v22.0/${userId}/media`
    : "https://graph.instagram.com/me/media";

  const params = new URLSearchParams({
    fields: FIELDS,
    limit: String(Math.min(Math.max(limit, 1), 50)),
    access_token: token,
  });
  if (after) params.set("after", String(after));

  let response;
  try {
    response = await fetch(`${base}?${params}`);
  } catch (err) {
    console.error("Could not reach Instagram:", err.cause?.code ?? err.message);
    return { ok: false, status: 502, error: "instagram_unreachable" };
  }

  if (!response.ok) {
    let code = null;
    try {
      code = (await response.json())?.error?.code ?? null;
    } catch {
      // ignore
    }
    // Never log the URL: it contains the token
    console.error("Instagram request failed", response.status, code);
    return {
      ok: false,
      status: 502,
      error: code === 190 ? "instagram_token_expired" : "instagram_request_failed",
    };
  }

  const json = await response.json();
  return {
    ok: true,
    body: {
      data: (json.data ?? []).map(normalize).filter(Boolean),
      paging: {
        after: json.paging?.cursors?.after ?? null,
        hasMore: Boolean(json.paging?.next),
      },
    },
  };
}