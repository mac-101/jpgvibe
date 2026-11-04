const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function cleanText(tweet) {
  let text = tweet.text ?? "";
  for (const u of tweet.entities?.urls ?? []) {
    const isMedia =
      /^pic\.(x|twitter)\.com/.test(u.display_url ?? "") ||
      /\/(photo|video)\/\d+$/.test(u.expanded_url ?? "");
    text = text.replace(u.url, isMedia ? "" : u.display_url ?? u.expanded_url);
  }
  return decode(text).replace(/[ \t]+\n/g, "\n").trim();
}

function normalize(tweet, mediaByKey, username) {
  const media = (tweet.attachments?.media_keys ?? [])
    .map((key) => mediaByKey[key])
    .filter(Boolean)
    .map((m) => {
      if (m.type === "photo") {
        return { type: "image", url: `${m.url}?name=large`, thumb: `${m.url}?name=medium` };
      }
      const best = (m.variants ?? [])
        .filter((v) => v.content_type === "video/mp4")
        .sort((a, b) => (b.bit_rate ?? 0) - (a.bit_rate ?? 0))[0];
      return best ? { type: "video", url: best.url, thumb: m.preview_image_url } : null;
    })
    .filter(Boolean);

  const pm = tweet.public_metrics ?? {};
  return {
    id: `x_${tweet.id}`,
    source: "x",
    text: cleanText(tweet),
    media,
    permalink: `https://x.com/${username}/status/${tweet.id}`,
    timestamp: tweet.created_at,
    metrics: { likes: pm.like_count, comments: pm.reply_count },
  };
}

// No Vercel code in here. It gets its settings passed in, and returns a plain result.
export async function getXFeed({ limit = 20, after = null, env }) {
  const { X_BEARER_TOKEN, X_USER_ID, X_USERNAME } = env;
  if (!X_BEARER_TOKEN || !X_USER_ID || !X_USERNAME) {
    return { ok: false, status: 500, error: "missing_settings" };
  }

  const params = new URLSearchParams({
    max_results: String(Math.min(Math.max(limit, 5), 100)),
    exclude: "retweets,replies",
    "tweet.fields": "created_at,public_metrics,entities,attachments",
    expansions: "attachments.media_keys",
    "media.fields": "type,url,preview_image_url,variants",
  });
  if (after) params.set("pagination_token", String(after));

  const response = await fetch(
    `https://api.x.com/2/users/${X_USER_ID}/tweets?${params}`,
    { headers: { Authorization: `Bearer ${X_BEARER_TOKEN}` } }
  );

  if (!response.ok) {
    console.error("X request failed", response.status, await response.text());
    return {
      ok: false,
      status: 502,
      error: response.status === 402 ? "x_credits_depleted" : "x_request_failed",
    };
  }

  const json = await response.json();
  const mediaByKey = Object.fromEntries(
    (json.includes?.media ?? []).map((m) => [m.media_key, m])
  );
  const next = json.meta?.next_token ?? null;

  return {
    ok: true,
    body: {
      data: (json.data ?? []).map((t) => normalize(t, mediaByKey, X_USERNAME)),
      paging: { after: next, hasMore: Boolean(next) },
    },
  };
}