import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import LiveLight from "../components/LiveLight";
import { useInstagram } from "./InstagramContext";
import InstagramTile, { TileSkeleton } from "./InstagramTile";
import { ACCOUNTS } from "./data";
import { SOURCE_META } from "./sources";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
];
const ease = [0.22, 1, 0.36, 1];

const outlineBtn =
  "font-button inline-flex items-center gap-3 rounded-full border px-6 py-3.5 transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]";

export default function InstagramPage() {
  const reduced = useReducedMotion();
  const {
    posts,
    status,
    hasMore,
    loadMore,
    loadingMore,
    moreError,
    refetch,
    openLightbox,
  } = useInstagram();

  const sentinel = useRef(null);
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? posts : posts.filter((p) => p.source === filter);

  // Infinite scroll: load the next page when the sentinel gets close.
  // Re-observing after every load also fills tall screens that need more than one page.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || status !== "ready" || moreError) return;

    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      { rootMargin: "700px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, status, moreError, loadMore, posts.length]);

  return (
    <section
      className="relative overflow-hidden pb-28 pt-32 sm:pb-36 sm:pt-40"
      style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 30% at 15% 8%, rgba(249,29,29,0.09), transparent 70%), radial-gradient(ellipse 45% 30% at 88% 60%, rgba(255,106,0,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="mb-12 max-w-3xl sm:mb-16"
        >
          <p className="mb-5 flex items-center gap-3 font-label">
            <LiveLight />
            Live from Instagram
          </p>

          <h1 className="text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            The vibe,
            <br />
            <span style={{ color: "var(--jpg-muted)" }}>as it happens.</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-8"
            style={{ opacity: 0.8 }}
          >
            The latest posts from our Instagram and X accounts, collected in
            one place. Tap any post to see the full story.
          </p>
        </motion.div>

        <div role="group" aria-label="Filter posts by platform" className="mb-8 flex flex-wrap gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="font-label rounded-full border px-5 py-2.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
              style={{
                color: "var(--jpg-cream)",
                borderColor: filter === f.id ? "var(--jpg-red)" : "var(--jpg-border)",
                backgroundColor: filter === f.id ? "rgba(249,29,29,0.12)" : "transparent",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        {status === "error" ? (
          <div
            className="rounded-3xl border p-10 text-center"
            style={{ borderColor: "var(--jpg-border)" }}
          >
            <p className="text-lg">We couldn't load the feed right now.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={refetch}
                className={outlineBtn}
                style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
              >
                Try again
              </button>
              <a
                href={ACCOUNTS.x.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={outlineBtn}
                style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
              >
                Open Instagram
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {status === "loading"
              ? Array.from({ length: 9 }, (_, i) => <TileSkeleton key={i} />)
              : visible.map((post, i) => (
                <InstagramTile
                  key={post.id}
                  post={post}
                  index={i}
                  onOpen={() => openLightbox(i)}
                />
              ))}

            {loadingMore &&
              Array.from({ length: 3 }, (_, i) => <TileSkeleton key={`more-${i}`} />)}
          </div>
        )}

        {/* Infinite scroll footer */}
        {status === "ready" && (
          <div className="mt-14 flex flex-col items-center gap-5 text-center">
            {hasMore && <div ref={sentinel} aria-hidden="true" className="h-px w-full" />}

            {moreError && (
              <>
                <p className="text-base" style={{ opacity: 0.8 }}>
                  Couldn't load more posts.
                </p>
                <button
                  type="button"
                  onClick={loadMore}
                  className={outlineBtn}
                  style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                >
                  Try again
                </button>
              </>
            )}

            {!hasMore && posts.length > 0 && (
              <>
                <p className="text-base" style={{ opacity: 0.75 }}>
                  You're all caught up.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {Object.entries(ACCOUNTS).map(([key, acc]) => {
                    const { Icon, label } = SOURCE_META[key];
                    return (
                      <a
                        key={key}
                        href={acc.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-button inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-7 py-4 text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                      >
                        Follow on {label}
                        <Icon aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}