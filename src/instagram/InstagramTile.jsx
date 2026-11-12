import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaClone, FaComment, FaHeart, FaPlay } from "react-icons/fa6";
import { SOURCE_META } from "./sources";
import {
  buildSrcSet,
  formatCount,
  getThumb,
  preloadMedia,
  snippet,
} from "./utils";

const ease = [0.22, 1, 0.36, 1];

function Counts({ post, className = "" }) {
  const likes = formatCount(post.metrics?.likes);
  const comments = formatCount(post.metrics?.comments);

  return (
    <span className={`flex items-center gap-4 text-sm ${className}`}>
      {likes && (
        <span className="inline-flex items-center gap-1.5">
          <FaHeart aria-hidden="true" className="text-[var(--jpg-red)]" />
          {likes}
          <span className="sr-only"> likes</span>
        </span>
      )}
      {comments && (
        <span className="inline-flex items-center gap-1.5">
          <FaComment aria-hidden="true" />
          {comments}
          <span className="sr-only"> comments</span>
        </span>
      )}
    </span>
  );
}

export function TileSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="aspect-square w-full animate-pulse rounded-2xl border bg-white/[0.04]"
      style={{ borderColor: "var(--jpg-border)" }}
    />
  );
}

function InstagramTile({
  post,
  index = 0,
  postIndex,
  onOpen,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}) {
  const reduced = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const meta = SOURCE_META[post.source];
  const SourceIcon = meta.Icon;
  const first = post.media[0];
  const thumb = getThumb(post);
  const srcSet = buildSrcSet(thumb);
  const preloadTimer = useRef(null);
  const cancelPreload = useCallback(() => {
    if (preloadTimer.current !== null) {
      window.clearTimeout(preloadTimer.current);
      preloadTimer.current = null;
    }
  }, []);
  const schedulePreload = useCallback(() => {
    cancelPreload();
    preloadTimer.current = window.setTimeout(() => {
      preloadMedia(first);
      preloadTimer.current = null;
    }, 120);
  }, [cancelPreload, first]);
  const handlePointerEnter = useCallback(
    (event) => {
      if (event.pointerType === "mouse") schedulePreload();
    },
    [schedulePreload],
  );
  const handleFocus = useCallback(
    (event) => {
      if (event.target.matches(":focus-visible")) schedulePreload();
    },
    [schedulePreload],
  );
  useEffect(() => cancelPreload, [cancelPreload]);
  const imageRef = useCallback((image) => {
    if (!image?.complete) return;
    setImageLoaded(image.naturalWidth > 0);
    setImageFailed(image.naturalWidth === 0);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(postIndex)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={cancelPreload}
      onFocus={handleFocus}
      onBlur={cancelPreload}
      aria-label={`Open ${meta.label} post: ${snippet(post.text)}`}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease, delay: (index % 4) * 0.08 }}
      className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border bg-[var(--jpg-surface)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{
        borderColor: "var(--jpg-border)",
        outlineColor: "var(--jpg-orange)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {thumb && !imageFailed && (
        <img
          ref={imageRef}
          src={thumb}
          srcSet={srcSet}
          sizes={sizes}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority && index < 2 ? "high" : undefined}
          decoding="async"
          draggable="false"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(false);
            setImageFailed(true);
          }}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: reduced
              ? "transform 900ms ease-out"
              : "opacity 250ms ease-out, transform 900ms ease-out",
          }}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.05]"
        />
      )}

      {/* Source badge */}
      <span
        aria-hidden="true"
        className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-sm backdrop-blur-md"
        style={{ color: "var(--jpg-cream)" }}
      >
        <SourceIcon />
      </span>

      {/* Video and multi-image badges */}
      {(post.media.length > 1 || first?.type === "video") && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full bg-black/55 px-2.5 text-xs backdrop-blur-md"
          style={{ color: "var(--jpg-cream)" }}
        >
          {post.media.length > 1 ? (
            <>
              <FaClone />
              {post.media.length}
            </>
          ) : (
            <FaPlay />
          )}
        </span>
      )}

      {/* Mouse: hover overlay. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-3 p-4 opacity-0 transition-opacity duration-300 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
          color: "var(--jpg-cream)",
        }}
      >
        <Counts post={post} />
        <span className="line-clamp-3 block text-sm leading-6 opacity-90">
          {post.text || "No caption"}
        </span>
      </span>

      {/* Touch: no hover, so the counts sit on the tile */}
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md [@media(hover:hover)]:hidden"
        style={{ color: "var(--jpg-cream)" }}
      >
        <Counts post={post} />
      </span>
    </motion.button>
  );
}

export default memo(InstagramTile);