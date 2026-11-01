import { motion, useReducedMotion } from "framer-motion";
import { FaClone, FaComment, FaHeart, FaPlay } from "react-icons/fa6";
import { formatCount, getThumb, snippet } from "./utils";

const ease = [0.22, 1, 0.36, 1];

function Counts({ post, className = "" }) {
  const likes = formatCount(post.like_count);
  const comments = formatCount(post.comments_count);

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

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open Instagram post: ${snippet(post.caption)}`}
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
      <img
        src={getThumb(post)}
        alt=""
        loading="lazy"
        draggable="false"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />

      {/* Video and carousel badges */}
      {post.media_type !== "IMAGE" && (
  <span
    aria-hidden="true"
    className="absolute right-3 top-3 flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full bg-black/55 px-2.5 text-xs backdrop-blur-md"
    style={{ color: "var(--jpg-cream)" }}
  >
    {post.media_type === "VIDEO" ? (
      <FaPlay />
    ) : (
      <>
        <FaClone />
        {post.children?.data?.length}
      </>
    )}
  </span>
)}

      {/* Mouse: hover overlay with counts and caption */}
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
          {post.caption || "No caption"}
        </span>
      </span>

      {/* Touch: no hover, so the counts sit on the tile instead */}
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