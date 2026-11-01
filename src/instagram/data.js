// Mock of GET /{user-id}/media?fields=...
// Flip USE_MOCK to false once your backend proxy exists. Nothing else changes.
export const USE_MOCK = true;

export const ACCOUNT = {
  username: "thevibe", // placeholder: use the real handle
  profileUrl: "https://www.instagram.com/thevibe/",
};

// Your backend proxy should request exactly these fields.
export const MEDIA_FIELDS =
  "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count,children{id,media_type,media_url}";

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Placeholder clip for the mock videos
const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// [photo id, media_type, caption, likes (null = hidden), comments, hours ago]
const RAW = [
  ["photo-1531058020387-3be344556be6", "IMAGE", "Golden hour in Lagos. Shot on 35mm, no edits. #thevibe #35mm", 482, 37, 5],
  ["photo-1549490349-8643362247b5", "IMAGE", "Fragments of Light by @amara.okafor is now showing in the digital gallery.\n\nA study of memory, colour and the imperfect beauty of everyday moments. Step inside through the link in our bio.\n\n#fineart #africanart #diaspora #thevibe #exhibition", 1204, 86, 20],
  ["photo-1579783902614-a3fb3927b6a5", "CAROUSEL_ALBUM", "Behind the colour: swipe through the studio sessions that shaped Earth in Motion. #digitalart", 733, 41, 44],
  ["photo-1577083552431-6e5fd01aa342", "IMAGE", "Beyond the frame. New work from the diaspora, curated for you.", 598, 22, 70],
  ["photo-1541961017774-22349e4a1262", "VIDEO", "Paint, light and patience. A short look at After the Rain coming together. #process", 2310, 154, 96],
  ["photo-1513364776144-60967b0f800f", "IMAGE", "Opening night energy. Thank you to everyone who came through.", 876, 63, 120],
  ["photo-1515405295579-ba7b45403062", "IMAGE", "Portrait study, soft light. Part of the Human series. #portrait", 1520, 98, 150],
  ["photo-1501472312651-726afe119ff1", "IMAGE", "Between cities. Notes from a week on the road.", 341, 12, 190],
  ["photo-1506794778202-cad84cf45f1d", "CAROUSEL_ALBUM", "Human Nature, in six frames. Swipe to see the full collection.", 967, 71, 230],
  ["photo-1500648767791-00dcc994a43e", "IMAGE", "Meet Kwame, our lead photographer. Four cities, one camera.", 445, 29, 270],
  ["photo-1534528741775-53994a69daeb", "IMAGE", "The quiet between. Portrait by Daniel Brooks.", null, 18, 310],
  ["photo-1524504388940-b1c1722653e1", "IMAGE", "Studio notes: colour swatches, coffee, and a very tight deadline.", 288, 9, 350],
  ["photo-1492684223066-81342ee5ff30", "VIDEO", "Shoot day reel. Direction by @tunde.visual. #behindthescenes", 3105, 212, 400],
  ["photo-1516280440614-37939bbacd81", "IMAGE", "Texture study no. 14.", 402, 15, 450],
  ["photo-1500530855697-b586d89ba3ee", "IMAGE", "Golden Hour by Samuel Adeyemi. Editorial series, prints available soon.", 1190, 77, 500],
  ["photo-1470252649378-9c29740c9fa8", "IMAGE", "Light finds a way.", 310, 8, 560],
  ["photo-1494438639946-1ebd1d20bf85", "IMAGE", "Portrait of the week: community submission. Send us yours with #thevibe.", 1033, 64, 620],
  ["photo-1518005020951-eccb494ad742", "IMAGE", "New perspectives: architecture through a different lens.", 654, 30, 680],
  ["photo-1515886657613-9f3515b0c78f", "CAROUSEL_ALBUM", "The curators' picks for October. Swipe for the full shortlist.", 872, 55, 740],
  ["photo-1519681393784-d120267933ba", "IMAGE", "Night sky, long exposure. 40 seconds, one tripod, zero sleep.", 1760, 91, 800],
  ["photo-1500534623283-312aade485b7", "IMAGE", "Faces of the vibe, vol. 3.", 520, 27, 870],
  ["photo-1517841905240-472988babdf9", "IMAGE", "Creative producer Folake on set. Controlled chaos.", 611, 34, 940],
  ["photo-1531123897727-8f129e1688ce", "IMAGE", "Fine art meets fashion: the lookbook is live.", 1402, 88, 1000],
  ["photo-1529139574466-a303027c1d8b", "IMAGE", "Community meetup recap. Same energy, bigger room next time.", 799, 46, 1080],
  ["photo-1508214751196-bcfd4ca60f91", "IMAGE", "Colour field. Nothing else to say.", 265, 7, 1150],
  ["photo-1529626455594-4ff0802cfb7e", "IMAGE", "Ife keeps the community connected. Say hi in the comments!", 744, 120, 1230],
  ["photo-1504593811423-6dd665756598", "VIDEO", "Exhibition walkthrough: a first look at the new digital room.", 2650, 133, 1310],
  ["photo-1511818966892-d7d671e672a2", "IMAGE", "Structure and shadow. Architecture series, part two.", 530, 19, 1400],
];

const POSTS = RAW.map(([photo, type, caption, likes, comments, hoursAgo], i) => {
  const post = {
    id: `17895${100000 + i * 7919}`,
    caption,
    media_type: type,
    media_url: type === "VIDEO" ? SAMPLE_VIDEO : IMG(photo),
    permalink: `https://www.instagram.com/p/mock${i + 1}/`,
    // Same format Instagram returns, with +0000 and no colon
    timestamp: new Date(Date.now() - hoursAgo * 3600 * 1000)
      .toISOString()
      .replace(/\.\d{3}Z$/, "+0000"),
    comments_count: comments,
  };

  if (likes != null) post.like_count = likes; // Instagram omits it when likes are hidden
  if (type === "VIDEO") post.thumbnail_url = IMG(photo, 900);
  if (type === "CAROUSEL_ALBUM") {
    post.children = {
      data: [0, 1, 2].map((n) => ({
        id: `${post.id}${n}`,
        media_type: "IMAGE",
        media_url: IMG(RAW[(i + n) % RAW.length][0]),
      })),
    };
  }
  return post;
});

/**
 * Returns the same envelope as the Graph API:
 * { data: [...], paging: { cursors: { before, after }, next? } }
 */
export async function fetchPosts({ limit = 20, after = null } = {}) {
  if (!USE_MOCK) {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (after) qs.set("after", after);
    const res = await fetch(`/api/instagram?${qs}`);
    if (!res.ok) throw new Error(`Instagram request failed (${res.status})`);
    return res.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 500)); // fake network

  const start = after ? Number(after) : 0;
  const end = Math.min(start + limit, POSTS.length);
  const paging = { cursors: { before: String(start), after: String(end) } };
  if (end < POSTS.length) {
    paging.next = `https://graph.instagram.com/mock/media?limit=${limit}&after=${end}`;
  }
  return { data: POSTS.slice(start, end), paging };
}