import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ACCOUNT, fetchPosts } from "./data";
import { InstagramContext } from "./InstagramContext";
import Lightbox from "./Lighbox";

const FIRST_PAGE = 20; // fetched once when the app loads
const NEXT_PAGE = 12; // infinite scroll on the Instagram page

export default function InstagramProvider({ children }) {
  const [feed, setFeed] = useState({
    posts: [],
    status: "loading", // loading | ready | error
    after: null,
    hasMore: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const busy = useRef(false);
  const postsLength = useRef(0);
  postsLength.current = feed.posts.length;

  const loadFirst = useCallback(async () => {
    setFeed((f) => ({ ...f, status: "loading" }));
    try {
      const res = await fetchPosts({ limit: FIRST_PAGE });
      setFeed({
        posts: res.data,
        status: "ready",
        after: res.paging?.after ?? null,
        hasMore: Boolean(res.paging?.hasMore),
      });
    } catch {
      setFeed((f) => ({ ...f, status: "error" }));
    }
  }, []);

  // The one fetch for the whole site
  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  const loadMore = useCallback(async () => {
    if (busy.current || feed.status !== "ready" || !feed.hasMore) return;
    busy.current = true;
    setLoadingMore(true);
    setMoreError(false);
    try {
      const res = await fetchPosts({ limit: NEXT_PAGE, after: feed.after });
      setFeed((f) => ({
        ...f,
        posts: [...f.posts, ...res.data],
        after: res.paging?.after ?? null,
        hasMore: Boolean(res.paging?.hasMore),
      }));
    } catch {
      setMoreError(true);
    } finally {
      busy.current = false;
      setLoadingMore(false);
    }
  }, [feed.status, feed.hasMore, feed.after]);

  const openLightbox = useCallback((index) => setOpenIndex(index), []);
  const closeLightbox = useCallback(() => setOpenIndex(null), []);
  const step = useCallback((delta) => {
    setOpenIndex((i) =>
      i === null
        ? i
        : (i + delta + postsLength.current) % postsLength.current
    );
  }, []);

  const value = useMemo(
    () => ({
      account: ACCOUNT,
      posts: feed.posts,
      status: feed.status,
      hasMore: feed.hasMore,
      loadMore,
      loadingMore,
      moreError,
      refetch: loadFirst,
      openIndex,
      openLightbox,
      closeLightbox,
      step,
    }),
    [feed, loadMore, loadingMore, moreError, loadFirst, openIndex, openLightbox, closeLightbox, step]
  );

  return (
    <InstagramContext.Provider value={value}>
      {children}
      <Lightbox />
    </InstagramContext.Provider>
  );
}