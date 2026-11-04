import { motion, useReducedMotion } from "framer-motion";
import { FaClone, FaComment, FaHeart, FaPlay } from "react-icons/fa6";
import { SOURCE_META } from "./sources";
import { formatCount, getThumb, hasMedia, snippet } from "./utils";

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

export default function InstagramTile({ post, index = 0, onOpen }) {
  const reduced = useReducedMotion();
  const meta = SOURCE_META[post.source];
  const SourceIcon = meta.Icon;
  const withMedia = hasMedia(post);
  const first = post.media[0];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
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
      {withMedia ? (
        <img
          src={getThumb(post)}
          alt=""
          loading="lazy"
          draggable="false"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
      ) : (
        /* Text-only post: the words are the artwork */
        <span
          className="absolute inset-0 flex flex-col justify-center p-6 pt-16 sm:p-7 sm:pt-16"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(249,29,29,0.14), transparent 70%), var(--jpg-surface-raised)",
          }}
        >
          <span
            className="line-clamp-6 block font-body text-lg leading-7 sm:text-xl sm:leading-8"
            style={{ color: "var(--jpg-cream)" }}
          >
            {post.text}
          </span>
        </span>
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

      {/* Mouse: hover overlay. Text-only tiles already show their words, so only counts. */}
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
        {withMedia && (
          <span className="line-clamp-3 block text-sm leading-6 opacity-90">
            {post.text || "No caption"}
          </span>
        )}
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