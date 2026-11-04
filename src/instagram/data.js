// Every platform is converted into this one shape:
// { id, source: "instagram" | "x", text, media: [{ type, url, thumb }],
//   permalink, timestamp (ISO), metrics: { likes?, comments? } }
// Responses look like: { data: [...], paging: { after, hasMore } }

export const USE_MOCK = true;

export const ACCOUNTS = {
  instagram: { username: "jpgvibe", profileUrl: "https://www.instagram.com/jpgvibe/" },
  x: { username: "thevibe", profileUrl: "https://x.com/thejpgvibe" },
};
export const ACCOUNT = ACCOUNTS.instagram; // kept so older imports (Contact page) still work

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const iso = (hoursAgo) =>
  new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
const image = (id) => ({ type: "image", url: IMG(id, 1400), thumb: IMG(id, 700) });
const video = (id) => ({ type: "video", url: SAMPLE_VIDEO, thumb: IMG(id, 900) });

// [photo, kind, text, likes (null = hidden), comments, hours ago]
const RAW_IG = [
  ["photo-1531058020387-3be344556be6", "image", "Golden hour in Lagos. Shot on 35mm, no edits. #thevibe #35mm", 482, 37, 5],
  ["photo-1549490349-8643362247b5", "image", "Fragments of Light by @amara.okafor is now showing in the digital gallery.\n\nA study of memory, colour and the imperfect beauty of everyday moments. Step inside through the link in our bio.\n\n#fineart #africanart #diaspora #thevibe #exhibition", 1204, 86, 20],
  ["photo-1579783902614-a3fb3927b6a5", "carousel", "Behind the colour: swipe through the studio sessions that shaped Earth in Motion. #digitalart", 733, 41, 44],
  ["photo-1577083552431-6e5fd01aa342", "image", "Beyond the frame. New work from the diaspora, curated for you.", 598, 22, 70],
  ["photo-1541961017774-22349e4a1262", "video", "Paint, light and patience. A short look at After the Rain coming together. #process", 2310, 154, 96],
  ["photo-1513364776144-60967b0f800f", "image", "Opening night energy. Thank you to everyone who came through.", 876, 63, 120],
  ["photo-1515405295579-ba7b45403062", "image", "Portrait study, soft light. Part of the Human series. #portrait", 1520, 98, 150],
  ["photo-1506794778202-cad84cf45f1d", "carousel", "Human Nature, in six frames. Swipe to see the full collection.", 967, 71, 230],
  ["photo-1500648767791-00dcc994a43e", "image", "Meet Kwame, our lead photographer. Four cities, one camera.", 445, 29, 270],
  ["photo-1534528741775-53994a69daeb", "image", "The quiet between. Portrait by Daniel Brooks.", null, 18, 310],
  ["photo-1524504388940-b1c1722653e1", "image", "Studio notes: colour swatches, coffee, and a very tight deadline.", 288, 9, 350],
  ["photo-1492684223066-81342ee5ff30", "video", "Shoot day reel. Direction by @tunde.visual. #behindthescenes", 3105, 212, 400],
  ["photo-1500530855697-b586d89ba3ee", "image", "Golden Hour by Samuel Adeyemi. Editorial series, prints available soon.", 1190, 77, 500],
  ["photo-1494438639946-1ebd1d20bf85", "image", "Portrait of the week: community submission. Send us yours with #thevibe.", 1033, 64, 620],
  ["photo-1518005020951-eccb494ad742", "image", "New perspectives: architecture through a different lens.", 654, 30, 680],
  ["photo-1515886657613-9f3515b0c78f", "carousel", "The curators' picks for October. Swipe for the full shortlist.", 872, 55, 740],
  ["photo-1519681393784-d120267933ba", "image", "Night sky, long exposure. 40 seconds, one tripod, zero sleep.", 1760, 91, 800],
  ["photo-1517841905240-472988babdf9", "image", "Creative producer Folake on set. Controlled chaos.", 611, 34, 940],
  ["photo-1531123897727-8f129e1688ce", "image", "Fine art meets fashion: the lookbook is live.", 1402, 88, 1000],
  ["photo-1504593811423-6dd665756598", "video", "Exhibition walkthrough: a first look at the new digital room.", 2650, 133, 1310],
];

// [text, kind, photos, likes, replies, hours ago]
const RAW_X = [
  ["New week, new work. Who's showing with us this month? Drop your portfolio below.", "text", [], 640, 112, 2],
  ["Golden hour in Lagos. Shot on 35mm, no edits.", "image", ["photo-1470252649378-9c29740c9fa8"], 902, 41, 9],
  ["Open call: we're looking for photographers across the diaspora for our December show. Details on the site.", "text", [], 1560, 204, 28],
  ["Behind the scenes from this week's shoot.", "images", ["photo-1500534623283-312aade485b7", "photo-1529139574466-a303027c1d8b"], 733, 38, 52],
  ["A 20-second tour of the new digital gallery room.", "video", ["photo-1511818966892-d7d671e672a2"], 2210, 87, 80],
  ["Art isn't a luxury. It's how we remember who we are.", "text", [], 2480, 156, 110],
  ["Texture study, no. 14.", "image", ["photo-1516280440614-37939bbacd81"], 402, 15, 140],
  ["Reminder: submissions for the next community feature close Friday. Send us your best.", "text", [], 388, 44, 175],
  ["Studio visit with @amara.okafor. The new series is something else.", "video", ["photo-1508214751196-bcfd4ca60f91"], 1840, 96, 215],
  ["Faces of the vibe, vol. 3.", "images", ["photo-1515405295579-ba7b45403062", "photo-1494438639946-1ebd1d20bf85"], 1105, 52, 250],
  ["Africa has the talent. We're building the stage.", "text", [], 3020, 241, 300],
  ["Colour field. Nothing else to say.", "image", ["photo-1508214751196-bcfd4ca60f91"], 265, 7, 380],
  ["Thank you to everyone who came out last night. Same energy, bigger room next time.", "text", [], 977, 63, 470],
  ["Structure and shadow. Architecture series, part two.", "image", ["photo-1518005020951-eccb494ad742"], 530, 19, 600],
];

const IG = RAW_IG.map(([photo, kind, text, likes, comments, hours], i) => {
  let media = [image(photo)];
  if (kind === "video") media = [video(photo)];
  if (kind === "carousel")
    media = [0, 1, 2].map((n) => image(RAW_IG[(i + n) % RAW_IG.length][0]));

  const metrics = { comments };
  if (likes != null) metrics.likes = likes; // Instagram omits likes when the owner hides them

  return {
    id: `ig_${i + 1}`,
    source: "instagram",
    text,
    media,
    permalink: `https://www.instagram.com/p/mock${i + 1}/`,
    timestamp: iso(hours),
    metrics,
  };
});

const X = RAW_X.map(([text, kind, photos, likes, replies, hours], i) => {
  let media = [];
  if (kind === "image") media = [image(photos[0])];
  if (kind === "images") media = photos.map(image);
  if (kind === "video") media = [video(photos[0])];

  return {
    id: `x_${i + 1}`,
    source: "x",
    text,
    media,
    permalink: `https://x.com/${ACCOUNTS.x.username}/status/mock${i + 1}`,
    timestamp: iso(hours),
    metrics: { likes, comments: replies },
  };
});

const ALL = [...IG, ...X].sort(
  (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
);

export async function fetchPosts({ limit = 20, after = null } = {}) {
  if (!USE_MOCK) {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (after) qs.set("after", after);
    const res = await fetch(`/api/feed?${qs}`);
    if (!res.ok) throw new Error(`Feed request failed (${res.status})`);
    return res.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 500)); // fake network

  const start = after ? Number(after) : 0;
  const end = Math.min(start + limit, ALL.length);
  return {
    data: ALL.slice(start, end),
    paging: { after: String(end), hasMore: end < ALL.length },
  };
}