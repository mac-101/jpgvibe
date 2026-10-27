import { useEffect, useRef, useState } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
} from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

const artworks = [
    {
        id: 1,
        title: "Fragments of Light",
        artist: "Amara Okafor",
        category: "Fine Art",
        medium: "Mixed media",
        description:
            "An exploration of light, memory, and the imperfect beauty found in everyday moments.",
        image:
            "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-red)",
    },
    {
        id: 2,
        title: "The Quiet Between",
        artist: "Daniel Brooks",
        category: "Photography",
        medium: "Portrait photography",
        description:
            "A portrait study about stillness, identity, and the stories we rarely tell.",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-orange)",
    },
    {
        id: 3,
        title: "Earth in Motion",
        artist: "Nneka Williams",
        category: "Digital Art",
        medium: "Digital composition",
        description:
            "Natural forms and unexpected colors come together in a study of movement and change.",
        image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-yellow)",
    },
    {
        id: 4,
        title: "Golden Hour",
        artist: "Samuel Adeyemi",
        category: "Photography",
        medium: "Editorial photography",
        description:
            "A fleeting afternoon moment captured in warm light and delicate shadows.",
        image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-orange)",
    },
    {
        id: 5,
        title: "Beyond the Frame",
        artist: "Isabella James",
        category: "Visual Art",
        medium: "Contemporary painting",
        description:
            "A visual conversation about perspective, boundaries, and seeing beyond the obvious.",
        image:
            "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-red)",
    },
    {
        id: 6,
        title: "Human Nature",
        artist: "Chidi Emmanuel",
        category: "Photography",
        medium: "Documentary photography",
        description:
            "An intimate collection celebrating the people and everyday scenes that shape our world.",
        image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-yellow)",
    },
    {
        id: 7,
        title: "After the Rain",
        artist: "Maya Laurent",
        category: "Fine Art",
        medium: "Abstract painting",
        description:
            "Color and texture evoke the calm that follows a storm and the beginning of something new.",
        image:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-orange)",
    },
    {
        id: 8,
        title: "New Perspectives",
        artist: "Tobi Richards",
        category: "Architecture",
        medium: "Architectural photography",
        description:
            "An unconventional look at structure, geometry, and the relationship between space and light.",
        image:
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=90",
        color: "var(--jpg-red)",
    },
];

const ease = [0.22, 1, 0.36, 1];

const SPEED = 38; // auto-scroll speed in px per second
const IDLE_PAUSE = 1000; // pause after manual interaction (ms)
const EDGE_DWELL = 1400; // pause when reaching either end (ms)

const CARD_SIZE = {
    width: "clamp(240px, 27vw, 350px)",
    height: "clamp(350px, 43vw, 490px)",
};

function Icon({ children, size = 18 }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

function TouchIndicator({ reduced }) {
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border py-2 pl-2.5 pr-3 backdrop-blur-md"
            style={{
                borderColor: "var(--jpg-border)",
                backgroundColor: "rgba(0,0,0,0.55)",
                color: "var(--jpg-cream)",
            }}
        >
            <span className="relative flex h-5 w-5 items-center justify-center">
                {!reduced && (
                    <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid var(--jpg-orange)" }}
                        animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                )}
                <motion.span
                    className="flex"
                    animate={reduced ? undefined : { y: [0, -2.5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon size={17}>
                        <path d="M8 12V6.5a2 2 0 0 1 4 0V11" />
                        <path d="M12 10V8a2 2 0 0 1 4 0v4" />
                        <path d="M16 11v-1a2 2 0 0 1 4 0v5c0 3.3-2.3 6-5.5 6h-2.1c-1.7 0-2.7-.6-3.7-1.8L5.4 17a2 2 0 0 1 3-2.6L11 17v-6" />
                    </Icon>
                </motion.span>
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
                <span className="[@media(hover:hover)]:hidden">Tap</span>
                <span className="hidden [@media(hover:hover)]:inline">Click</span>
            </span>
        </span>
    );
}

function ArtworkCard({ artwork, flipped, onToggle, reduced }) {
    const [hasFlipped, setHasFlipped] = useState(false);

    const toggle = () => {
        setHasFlipped(true);
        onToggle();
    };

    return (
        <motion.article
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease }}
            className="group relative shrink-0"
            style={{ ...CARD_SIZE, perspective: "1400px" }}

        >
            <button
                type="button"
                // Mouse users flip on hover. Touch taps and keyboard presses toggle.
                onClick={toggle}
                aria-pressed={flipped}
                aria-label={`${artwork.title} by ${artwork.artist}. ${flipped ? "Show artwork" : "Show details"
                    }`}
                className="absolute inset-0 block w-full cursor-pointer rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                    outlineColor: "var(--jpg-orange)",
                    WebkitTapHighlightColor: "transparent",
                }}
            >
                <motion.span
                    className="absolute inset-0 block rounded-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.75, ease }}
                >
                    {/* Front */}
                    <span
                        className="absolute inset-0 block overflow-hidden rounded-2xl border"
                        style={{
                            borderColor: "var(--jpg-border)",
                            backgroundColor: "var(--jpg-surface)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                        }}
                    >
                        <img
                            src={artwork.image}
                            alt=""
                            loading="lazy"
                            draggable="false"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                        />
                        <span
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.82) 100%)",
                            }}
                        />
                        {!hasFlipped && <TouchIndicator reduced={reduced} />}

                        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                            <span className="block min-w-0">
                                <span
                                    className="block text-xl font-medium tracking-tight sm:text-2xl"
                                    style={{ color: "var(--jpg-cream)" }}
                                >
                                    {artwork.title}
                                </span>
                                <span
                                    className="mt-1.5 block text-sm"
                                    style={{ color: "var(--jpg-cream)", opacity: 0.7 }}
                                >
                                    {artwork.artist} · {artwork.category}
                                </span>
                            </span>


                        </span>
                    </span>

                    {/* Back */}
                    <span
                        className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border p-6 sm:p-7"
                        style={{
                            borderColor: "var(--jpg-border)",
                            background: `radial-gradient(ellipse at top right, rgba(249,29,29,0.13), transparent 55%), var(--jpg-surface-raised)`,
                            color: "var(--jpg-cream)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <span
                            className="block h-1 w-10 rounded-full"
                            style={{ backgroundColor: artwork.color }}
                        />

                        <span className="mt-6 block text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                            {artwork.title}
                        </span>

                        <span
                            className="mt-2 block text-sm"
                            style={{ color: "var(--jpg-muted)" }}
                        >
                            {artwork.artist}
                        </span>

                        <span
                            className="mt-5 block text-sm leading-7"
                            style={{ color: "var(--jpg-cream)", opacity: 0.88 }}
                        >
                            {artwork.description}
                        </span>

                        <span className="mt-auto border-t pt-4 text-xs flex items-center justify-between"
                            style={{
                                borderColor: "var(--jpg-border)",
                                color: "var(--jpg-muted)",
                            }}>
                            {artwork.medium}
                            <Icon size={16}>
                                <path d="M9 14 4 9l5-5" />
                                <path d="M4 9h10a6 6 0 0 1 0 12h-2" />
                            </Icon>
                        </span>
                    </span>
                </motion.span>
            </button>
        </motion.article>
    );
}

export default function LiveVisualFeed() {
    const reduced = useReducedMotion();

    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    const [playing, setPlaying] = useState(true);

    // Read inside the animation loop, so these are refs and don't re-render
    const focusRef = useRef(false);
    const inViewRef = useRef(false);
    const pauseUntil = useRef(0);
    const [flippedId, setFlippedId] = useState(null);
    const flippedRef = useRef(null);

    useEffect(() => {
        flippedRef.current = flippedId;
    }, [flippedId]);

    // Flipping a new card automatically un-flips the previous one
    const toggleCard = (id) =>
        setFlippedId((current) => (current === id ? null : id));

    // Progress bar follows the track's real scroll position
    const { scrollXProgress } = useScroll({ container: trackRef });
    const progress = useSpring(scrollXProgress, {
        stiffness: 120,
        damping: 30,
        mass: 0.3,
    });

    // Only auto-scroll while the section is on screen
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                inViewRef.current = entry.isIntersecting;
            },
            { threshold: 0.25 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Auto-scroll: drifts right, dwells at the end, drifts back
    useEffect(() => {
        const el = trackRef.current;
        if (!el || reduced) return;

        let raf;
        let last = performance.now();
        let pos = el.scrollLeft;
        let dir = 1;
        let running = false;

        const tick = (now) => {
            const dt = Math.min(now - last, 64) / 1000;
            last = now;

            const blocked =
                !playing ||
                !inViewRef.current ||
                focusRef.current ||
                flippedRef.current !== null ||
                now < pauseUntil.current ||
                document.hidden;

            if (blocked) {
                running = false;
            } else {
                // Re-sync after any pause, since the user may have scrolled by hand
                if (!running) {
                    pos = el.scrollLeft;
                    running = true;
                }

                const max = el.scrollWidth - el.clientWidth;
                if (max > 0) {
                    pos += dir * SPEED * dt;

                    if (pos >= max) {
                        pos = max;
                        dir = -1;
                        pauseUntil.current = now + EDGE_DWELL;
                    } else if (pos <= 0) {
                        pos = 0;
                        dir = 1;
                        pauseUntil.current = now + EDGE_DWELL;
                    }

                    el.scrollLeft = pos;
                }
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [playing, reduced]);

    const holdAutoScroll = () => {
        pauseUntil.current = performance.now() + IDLE_PAUSE;
    };

    const scrollTrack = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        holdAutoScroll();
        el.scrollBy({
            left: direction * el.clientWidth * 0.72,
            behavior: reduced ? "auto" : "smooth",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="explore"
            className="relative overflow-hidden py-24 sm:py-32"
            style={{
                backgroundColor: "var(--jpg-black)",
                color: "var(--jpg-cream)",
            }}
        >
            <div className="mx-auto max-w-[1600px]">
                {/* Heading */}
                <div className="mb-10 flex flex-col justify-between gap-7 px-6 sm:mb-14 sm:px-10 lg:flex-row lg:items-end lg:px-16">
                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.9, ease }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                            Art that speaks.
                            <br />
                            <span style={{ color: "var(--jpg-muted)" }}>
                                Stories that stay.
                            </span>
                        </h2>

                        <p
                            className="mt-5 max-w-lg text-sm leading-7 sm:text-base"
                            style={{ color: "var(--jpg-muted)" }}
                        >
                            A living collection of perspectives, captured moments, and
                            creative worlds.
                        </p>
                    </motion.div>

                
                </div>

                {/* Gallery */}
                <div
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)",
                        maskImage:
                            "linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)",
                    }}
                >
                    <div
                        ref={trackRef}
                        role="region"
                        aria-label="Featured artwork"
                        onFocus={(e) => {
                            // only keyboard focus pauses, not a mouse click
                            if (e.target.matches(":focus-visible")) focusRef.current = true;
                        }}
                        onBlur={() => (focusRef.current = false)}
                        onWheel={holdAutoScroll}
                        onTouchMove={holdAutoScroll}
                        onKeyDown={(e) => {
                            if (e.key.startsWith("Arrow")) holdAutoScroll();
                        }}
                        className="flex gap-4 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [overscroll-behavior-x:contain] [scrollbar-width:none] sm:gap-5 sm:px-10 lg:gap-6 lg:px-16 [&::-webkit-scrollbar]:hidden"
                    >
                        {artworks.map((artwork) => (
                            <ArtworkCard
                                key={artwork.id}
                                artwork={artwork}
                                flipped={flippedId === artwork.id}
                                onToggle={() => toggleCard(artwork.id)}
                                reduced={reduced}
                            />
                        ))}

                        {/* Closing card */}
                        <div
                            className="flex shrink-0 flex-col justify-between rounded-2xl border p-7 sm:p-9"
                            style={{
                                ...CARD_SIZE,
                                borderColor: "var(--jpg-border)",
                                background:
                                    "radial-gradient(ellipse at top right, rgba(255,106,0,0.12), transparent 55%), var(--jpg-surface)",
                            }}
                        >
                            <h3 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                                The next
                                <br />
                                vision could
                                <br />
                                be yours.
                            </h3>

                            <a
                                href="#artists"
                                className="group inline-flex items-center gap-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                                style={{
                                    color: "var(--jpg-cream)",
                                    outlineColor: "var(--jpg-orange)",
                                }}
                            >
                                Meet the creators
                                <span
                                    aria-hidden="true"
                                    className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                                    style={{ color: "var(--jpg-orange)" }}
                                >
                                    <FaArrowRight/>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-2 px-6 sm:px-10 lg:px-16">
                    <div
                        aria-hidden="true"
                        className="h-px w-full"
                        style={{ backgroundColor: "var(--jpg-border)" }}
                    >
                        <motion.div
                            className="h-px origin-left"
                            style={{
                                scaleX: progress,
                                background: "var(--jpg-gradient)",
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}