import { useState, useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useReducedMotion,
} from "framer-motion";

const artworks = [
    {
        id: 1,
        title: "Human / 001",
        category: "Portrait photography",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
        position: "left-[26%] top-[8%] w-[54%]",
        height: "h-[340px] sm:h-[390px]",
        rotate: 3,
        depth: 28, // parallax strength (px) and z-lift
        floatDelay: 0,
    },
    {
        id: 2,
        title: "Fragments / 014",
        category: "Contemporary art",
        image:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=700&q=85",
        position: "left-0 top-[23%] w-[48%]",
        height: "h-[220px] sm:h-[260px]",
        rotate: -10,
        depth: 14,
        floatDelay: 1.2,
    },
    {
        id: 3,
        title: "Structure / 021",
        category: "Architecture",
        image:
            "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=85",
        position: "right-0 top-[38%] w-[45%]",
        height: "h-[190px] sm:h-[230px]",
        rotate: 8,
        depth: 20,
        floatDelay: 2.4,
    },
];

const ease = [0.22, 1, 0.36, 1];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const FOCUS_INTERVAL = 3600; // ms each card stays in front

// rank 0 = front, 1 = middle, 2 = back
const RANKS = [
    { z: 90, scale: 1.04, tilt: 0.3, dim: 0 },
    { z: 30, scale: 0.97, tilt: 1, dim: 0.3 },
    { z: -30, scale: 0.91, tilt: 1.2, dim: 0.52 },
];

function ArtworkCard({ artwork, index, rank, ready, onSelect, sx, sy, reduced }) {
    const px = useTransform(sx, [-0.5, 0.5], [-artwork.depth, artwork.depth]);
    const py = useTransform(sy, [-0.5, 0.5], [-artwork.depth, artwork.depth]);

    const r = RANKS[rank];
    const isFront = rank === 0;

    // Intro is staggered. After that, rank changes use one smooth shared curve.
    const move = reduced
        ? { duration: 0 }
        : ready
            ? { duration: 1.15, ease }
            : { duration: 1, delay: 0.35 + index * 0.18, ease };

    return (
        <motion.div
            className={`absolute ${artwork.position}`}
            style={{ x: reduced ? 0 : px, y: reduced ? 0 : py }}
            initial={
                reduced
                    ? false
                    : { opacity: 0, scale: 0.88, rotate: artwork.rotate * 2.2, z: r.z - 80 }
            }
            animate={{
                opacity: 1,
                scale: r.scale,
                rotate: artwork.rotate * r.tilt,
                z: r.z,
            }}
            transition={move}
            onPointerEnter={(e) => e.pointerType === "mouse" && onSelect()}
            onClick={onSelect}
        >
            {/* Idle float */}
            <motion.div
                animate={reduced ? undefined : { y: [0, -12, 0] }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: artwork.floatDelay,
                }}
            >
                <motion.figure
                    animate={{ x: isFront ? artwork.focusX : 0, y: isFront ? -8 : 0 }}
                    whileHover={{
                        y: -12,
                        transition: { type: "spring", stiffness: 260, damping: 22 },
                    }}
                    transition={{ duration: reduced ? 0 : 1.15, ease }}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--jpg-border)] bg-[var(--jpg-surface)] shadow-[0_25px_70px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-500 hover:border-[var(--jpg-red)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_30px_rgba(249,29,29,0.15)]"
                >
                    <div className={`relative overflow-hidden ${artwork.height}`}>
                        <img
                            src={artwork.image}
                            alt={`${artwork.title} — ${artwork.category}`}
                            loading="eager"
                            draggable="false"
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* <figcaption className="flex items-center justify-between gap-2 p-3 sm:p-4">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold sm:text-sm">{artwork.title}</p>
                            <p className="mt-1 text-[10px] text-[var(--jpg-muted)] sm:text-xs">
                                {artwork.category}
                            </p>
                        </div>
                        <span
                            aria-hidden="true"
                            className="text-sm text-[var(--jpg-cream)]/70 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--jpg-red)]"
                        >
                            ↗
                        </span>
                    </figcaption> */}

                    {/* Dims cards that are further back */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 bg-black"
                        initial={false}
                        animate={{ opacity: r.dim }}
                        transition={{ duration: reduced ? 0 : 1.15, ease }}
                    />
                </motion.figure>
            </motion.div>
        </motion.div>
    );
}

export default function Hero() {
    const reduced = useReducedMotion();

    // Normalised cursor position inside the artwork cluster (-0.5 to 0.5)
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.5 });
    const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.5 });

    // Whole cluster tilts gently in 3D
    const tiltY = useTransform(sx, [-0.5, 0.5], [7, -7]);
    const tiltX = useTransform(sy, [-0.5, 0.5], [-6, 6]);

    // Ambient glow drifts opposite to the cursor
    const glowX = useTransform(sx, [-0.5, 0.5], [30, -30]);
    const glowY = useTransform(sy, [-0.5, 0.5], [20, -20]);

    const handleMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleLeave = () => {
        mx.set(0);
        my.set(0);
    };

    const [focus, setFocus] = useState(0);
    const [ready, setReady] = useState(false);

    // Intro finishes, then the rotation can start
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 1700);
        return () => clearTimeout(t);
    }, []);

    // Every few seconds the next card comes to the front.
    // `focus` is a dependency, so hovering or clicking a card restarts the wait.
    useEffect(() => {
        if (reduced || !ready) return;
        const t = setTimeout(
            () => setFocus((f) => (f + 1) % artworks.length),
            FOCUS_INTERVAL
        );
        return () => clearTimeout(t);
    }, [focus, ready, reduced]);

    return (
        <section className="relative pt-20 isolate min-h-screen overflow-hidden bg-[var(--jpg-black)] text-[var(--jpg-cream)]">
            {/* Ambient background */}
            <motion.div
                aria-hidden="true"
                style={reduced ? undefined : { x: glowX, y: glowY }}
                className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_78%_40%,rgba(255,106,0,0.16),transparent_38%),radial-gradient(ellipse_at_85%_70%,rgba(249,29,29,0.12),transparent_35%),radial-gradient(ellipse_at_12%_12%,rgba(255,230,0,0.05),transparent_35%)]"
            />

            {/* Subtle film grain for texture */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:min-h-screen lg:grid-cols-2 lg:gap-8 lg:px-10 lg:pb-24">
                {/* Copy */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="relative z-20 max-w-2xl"
                >
                    {/* <motion.div
                        variants={item}
                        className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--jpg-red)]"
                    >
                        <motion.span
                            className="h-px w-10 origin-left bg-[var(--jpg-red)]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.9, delay: 0.3, ease }}
                        />
                        Independent visual culture
                    </motion.div> */}

                    <motion.h1
                        variants={item}
                        className="text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[1.04] tracking-[-0.065em]"
                    >
                        Where Fine Artists, Photographers{" "}
                        <span className="text-[var(--jpg-cream)]/55">
                            &amp; Visionaries
                        </span>{" "}
                        Converge.
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mt-7 max-w-lg text-base leading-8 text-[var(--jpg-cream)]/65 sm:text-lg"
                    >
                        A space for exceptional art, bold perspectives, and the people
                        shaping how the world sees.
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-9 flex flex-wrap items-center gap-4"
                    >
                        <motion.a
                            href="#explore"
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-6 py-4 text-sm font-bold text-[var(--jpg-black)] transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(249,29,29,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] sm:px-7"
                        >
                            Explore the Platform <span aria-hidden="true">↗</span>
                        </motion.a>

                        <motion.a
                            href="#services"
                            whileTap={{ scale: 0.97 }}
                            className="rounded-full border border-[var(--jpg-border)] px-6 py-4 text-sm transition hover:border-[var(--jpg-cream)]/60 hover:bg-[var(--jpg-cream)]/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] sm:px-7"
                        >
                            Discover our world
                        </motion.a>
                    </motion.div>

                    <motion.div
                        variants={item}
                        className="mt-12 flex items-center gap-4 border-t border-[var(--jpg-cream)]/10 pt-6"
                    >
                        <div className="flex -space-x-3">
                            {artworks.map((artwork) => (
                                <img
                                    key={artwork.id}
                                    src={artwork.image}
                                    alt=""
                                    loading="lazy"
                                    className="h-10 w-10 rounded-full border-2 border-[var(--jpg-black)] object-cover"
                                />
                            ))}
                        </div>

                        <p className="text-xs leading-5 text-[var(--jpg-cream)]/55">
                            Art. Photography. Perspective.
                            <span className="block text-[var(--jpg-cream)]/90">
                                One creative collective.
                            </span>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Floating artwork cluster */}
                <div
                    id="explore"
                    onMouseMove={reduced ? undefined : handleMove}
                    onMouseLeave={handleLeave}
                    className="relative mx-auto h-[430px] w-full max-w-[540px] [perspective:1200px] sm:h-[550px]"
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            transformStyle: "preserve-3d",
                            rotateX: reduced ? 0 : tiltX,
                            rotateY: reduced ? 0 : tiltY,
                        }}
                    >
                        <motion.div
                            aria-hidden="true"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.4, ease }}
                            className="absolute inset-[12%_8%] rotate-[-20deg] scale-y-[0.7] rounded-[50%] border border-[var(--jpg-cream)]/[0.08] shadow-[0_0_100px_rgba(249,29,29,0.07)]"
                        />

                        {artworks.map((artwork, index) => (
                            <ArtworkCard
                                key={artwork.id}
                                artwork={artwork}
                                index={index}
                                rank={(index - focus + artworks.length) % artworks.length}
                                ready={ready}
                                onSelect={() => setFocus(index)}
                                sx={sx}
                                sy={sy}
                                reduced={reduced}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>



            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--jpg-red)]/40 to-transparent" />
        </section>
    );
}