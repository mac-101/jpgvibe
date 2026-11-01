import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    FaChevronLeft,
    FaChevronRight,
    FaComment,
    FaHeart,
    FaInstagram,
    FaXmark,
} from "react-icons/fa6";
import { useInstagram } from "./InstagramContext";
import { formatCount, formatDate, snippet } from "./utils";

const ease = [0.22, 1, 0.36, 1];

const circleBtn =
    "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jpg-cream)]";

function Media({ post, slide, setSlide }) {
    const isCarousel =
        post.media_type === "CAROUSEL_ALBUM" && post.children?.data?.length > 0;
    const items = isCarousel ? post.children.data : [post];
    const item = items[slide] ?? items[0];

    if (item.media_type === "VIDEO") {
        return (
            <video
                key={item.id}
                src={item.media_url}
                poster={post.thumbnail_url}
                controls
                playsInline
                autoPlay
                muted
                loop
                className="h-full w-full object-contain"
            />
        );
    }

    return (
        <>
            <img
                key={item.id}
                src={item.media_url}
                alt={snippet(post.caption, 140)}
                draggable="false"
                className="h-full w-full object-contain"
            />

            {items.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => setSlide((s) => (s - 1 + items.length) % items.length)}
                        className={`${circleBtn} absolute left-3 top-1/2 -translate-y-1/2 bg-black/55 backdrop-blur-md`}
                        style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                    >
                        <FaChevronLeft aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => setSlide((s) => (s + 1) % items.length)}
                        className={`${circleBtn} absolute right-3 top-1/2 -translate-y-1/2 bg-black/55 backdrop-blur-md`}
                        style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                    >
                        <FaChevronRight aria-hidden="true" />
                    </button>

                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5"
                    >
                        {items.map((it, i) => (
                            <span
                                key={it.id}
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: i === slide ? 18 : 6,
                                    backgroundColor:
                                        i === slide ? "var(--jpg-cream)" : "rgba(246,232,177,0.35)",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default function Lightbox() {
    const { posts, openIndex, closeLightbox, step, account } = useInstagram();
    const reduced = useReducedMotion();

    const dialogRef = useRef(null);
    const lastFocus = useRef(null);
    const shown = useRef(null);
    const slideInfo = useRef({ slide: 0, count: 1 });
    const [slide, setSlide] = useState(0);

    const isOpen = openIndex !== null;
    const current = isOpen ? posts[openIndex] ?? null : null;
    if (current) shown.current = current; // keeps the content on screen while it fades out
    const post = shown.current;
    const slideCount =
        post?.media_type === "CAROUSEL_ALBUM" ? post.children?.data?.length ?? 1 : 1;
    slideInfo.current = { slide, count: slideCount };

    useEffect(() => {
        setSlide(0);
    }, [openIndex]);

    // Scroll lock, focus handling, keyboard
    useEffect(() => {
        if (!isOpen) return;

        lastFocus.current = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") return closeLightbox();

            if (
                (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
                e.target.tagName !== "VIDEO"
            ) {
                const { slide: s, count } = slideInfo.current;
                if (e.key === "ArrowRight") {
                    return s < count - 1 ? setSlide(s + 1) : step(1);
                }
                return s > 0 ? setSlide(s - 1) : step(-1);
            }

            // Keep Tab inside the dialog
            if (e.key === "Tab" && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement;

                if (e.shiftKey && (active === first || active === dialogRef.current)) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
            lastFocus.current?.focus?.();
        };
    }, [isOpen, closeLightbox, step]);

    const likes = post ? formatCount(post.like_count) : null;
    const comments = post ? formatCount(post.comments_count) : null;

    return (
        <AnimatePresence>
            {isOpen && post && (
                <motion.div
                    key="ig-lightbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
                >
                    <div
                        aria-hidden="true"
                        onClick={closeLightbox}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Instagram post: ${snippet(post.caption, 60)}`}
                        tabIndex={-1}
                        initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: reduced ? 0 : 0.5, ease }}
                        className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto rounded-3xl border bg-[var(--jpg-surface)] shadow-[0_40px_120px_rgba(0,0,0,0.7)] outline-none md:grid md:h-[min(86vh,720px)] md:grid-cols-[1.25fr_1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden" style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                    >
                        <button
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Close"
                            className={`${circleBtn} absolute right-3 top-3 z-20 bg-black/60 backdrop-blur-md`}
                            style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                        >
                            <FaXmark aria-hidden="true" />
                        </button>

                        {/* Media */}
                        <div className="relative aspect-square w-full shrink-0 bg-black md:aspect-auto md:h-full md:min-h-0">
                            <Media post={post} slide={slide} setSlide={setSlide} />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col md:min-h-0 md:overflow-hidden">
                            <div
                                className="flex shrink-0 items-center gap-3 border-b px-5 py-4 pr-16"
                                style={{ borderColor: "var(--jpg-border)" }}
                            >
                                <span
                                    aria-hidden="true"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[image:var(--jpg-gradient)] font-heading text-xl text-[var(--jpg-black)]"
                                >
                                    t
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-base">{account.username}</p>
                                    <p className="font-label text-[9px] opacity-60">Instagram</p>
                                </div>
                            </div>

                            <div className="px-5 py-5 md:min-h-0 md:flex-1 md:overflow-y-auto">
                                <p
                                    className="whitespace-pre-line text-base leading-7"
                                    style={{ opacity: 0.9 }}
                                >
                                    {post.caption || "No caption."}
                                </p>
                            </div>

                            <div
                                className="shrink-0 border-t px-5 py-4"
                                style={{ borderColor: "var(--jpg-border)" }}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
                                    <span className="flex items-center gap-4 text-sm">
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

                                    <time
                                        dateTime={post.timestamp}
                                        className="text-sm"
                                        style={{ opacity: 0.65 }}
                                    >
                                        {formatDate(post.timestamp)}
                                    </time>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <a
                                        href={post.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-button inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-5 py-3.5 text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                                    >
                                        View on Instagram
                                        <FaInstagram aria-hidden="true" />
                                    </a>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => step(-1)}
                                            aria-label="Previous post"
                                            className={circleBtn}
                                            style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                                        >
                                            <FaChevronLeft aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => step(1)}
                                            aria-label="Next post"
                                            className={circleBtn}
                                            style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)" }}
                                        >
                                            <FaChevronRight aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}