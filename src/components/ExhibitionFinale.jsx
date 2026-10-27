
import { useReducedMotion } from "framer-motion";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { FaArrowTrendUp, FaArrowRight } from "react-icons/fa6";

const ease = [0.22, 1, 0.36, 1];

const artworks = [
    {
        id: "form",
        number: "01",
        title: "Beyond Form",
        category: "VISUAL ART",
        artist: "A study in contrast",
        image:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
        shape: "aspect-[4/5]",
        color: "var(--jpg-red)",
        placement: "lg:col-start-1 lg:row-start-1 lg:mt-20",
    },
    {
        id: "portrait",
        number: "02",
        title: "Human Nature",
        category: "PHOTOGRAPHY",
        artist: "People, in perspective",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
        shape: "aspect-[3/4]",
        color: "var(--jpg-orange)",
        placement: "lg:col-start-2 lg:row-start-1 lg:-mt-4",
    },
    {
        id: "color",
        number: "03",
        title: "Color Theory",
        category: "ART DIRECTION",
        artist: "An exercise in feeling",
        image:
            "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
        shape: "aspect-[4/5]",
        color: "var(--jpg-yellow)",
        placement: "lg:col-start-3 lg:row-start-1 lg:mt-16",
    },
    {
        id: "still",
        number: "04",
        title: "Quiet Energy",
        category: "CREATIVE CULTURE",
        artist: "The beauty of the unexpected",
        image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
        shape: "aspect-[3/4]",
        color: "var(--jpg-cream)",
        placement: "lg:col-start-4 lg:row-start-1 lg:mt-4",
    },
];

function ExhibitionCard({ artwork, index, reduced }) {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const springX = useSpring(mx, {
        stiffness: 150,
        damping: 20,
        mass: 0.5,
    });

    const springY = useSpring(my, {
        stiffness: 150,
        damping: 20,
        mass: 0.5,
    });

    const rotateY = useTransform(springX, [-0.5, 0.5], [8, -8]);
    const rotateX = useTransform(springY, [-0.5, 0.5], [-8, 8]);

    const handleMove = (event) => {
        if (reduced || event.pointerType === "touch") return;

        const rect = event.currentTarget.getBoundingClientRect();

        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    const handleLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <motion.article
            initial={
                reduced
                    ? false
                    : { opacity: 0, y: 55, filter: "blur(8px)" }
            }
            whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
            }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: reduced ? 0 : 0.9,
                delay: reduced ? 0 : index * 0.12,
                ease,
            }}
            className={`group relative min-w-0 ${artwork.placement}`}
        >
            <div
                className="[perspective:1100px]"
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
            >
                <motion.a
                    href="#explore"
                    aria-label={`Explore the platform — ${artwork.title}, ${artwork.category}`}
                    style={
                        reduced
                            ? undefined
                            : {
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                            }
                    }
                    whileHover={
                        reduced
                            ? undefined
                            : { y: -7, transition: { duration: 0.3 } }
                    }
                    className={`relative block overflow-hidden rounded-sm border border-[var(--jpg-border)] bg-[var(--jpg-surface-raised)] ${artwork.shape} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]`}
                >
                    <img
                        src={artwork.image}
                        alt={`${artwork.title} — ${artwork.category}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />

                    <div
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ background: artwork.color }}
                    />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] font-medium tracking-[0.2em] text-white/80 sm:p-5">
                        <span>{artwork.category}</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <p className="mb-2 text-xs text-white/65">
                            {artwork.artist}
                        </p>

                        <div className="flex items-end justify-between gap-3">
                            <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                                {artwork.title}
                            </h3>

                            <span
                                aria-hidden="true"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-transparent group-hover:text-black"
                                style={{
                                    backgroundColor: "transparent",
                                }}
                            >
                                <FaArrowRight/>
                            </span>
                        </div>
                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 45%)",
                        }}
                    />
                </motion.a>
            </div>
        </motion.article>
    );
}

export default function ExhibitionFinale() {
    const reduced = useReducedMotion();

    const reveal = {
        hidden: { opacity: 0, y: 28 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: reduced ? 0 : 0.85,
                ease,
            },
        },
    };

    return (
        <section
            id="exhibition"
            className="relative isolate overflow-hidden bg-[var(--jpg-black)] text-[var(--jpg-cream)]"
        >
            {/* Ambient exhibition lighting */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-[var(--jpg-red)]/[0.08] blur-[120px]" />
                <div className="absolute -right-40 top-[35%] h-[30rem] w-[30rem] rounded-full bg-[var(--jpg-orange)]/[0.07] blur-[140px]" />
                <div className="absolute bottom-0 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[var(--jpg-yellow)]/[0.035] blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-[1600px] px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36 lg:px-12 lg:pb-40 lg:pt-44">
                {/* Editorial introduction */}
                <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
                    <div>
                       
                        <motion.h2
                            initial={reduced ? false : "hidden"}
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={{
                                hidden: {},
                                show: {
                                    transition: {
                                        staggerChildren: reduced ? 0 : 0.1,
                                    },
                                },
                            }}
                            className="max-w-5xl text-[clamp(3.4rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]"
                        >
                            <span className="block overflow-hidden pb-2">
                                <motion.span
                                    variants={{
                                        hidden: {
                                            y: reduced ? 0 : "110%",
                                            opacity: reduced ? 1 : 0,
                                        },
                                        show: {
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                duration: reduced ? 0 : 1,
                                                ease,
                                            },
                                        },
                                    }}
                                    className="block"
                                >
                                    Art doesn't
                                </motion.span>
                            </span>

                            <span className="block overflow-hidden pb-2">
                                <motion.span
                                    variants={{
                                        hidden: {
                                            y: reduced ? 0 : "110%",
                                            opacity: reduced ? 1 : 0,
                                        },
                                        show: {
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                duration: reduced ? 0 : 1,
                                                ease,
                                            },
                                        },
                                    }}
                                    className="block"
                                >
                                    belong in
                                </motion.span>
                            </span>

                            <span className="block overflow-hidden pb-2">
                                <motion.span
                                    variants={{
                                        hidden: {
                                            y: reduced ? 0 : "110%",
                                            opacity: reduced ? 1 : 0,
                                        },
                                        show: {
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                duration: reduced ? 0 : 1,
                                                ease,
                                            },
                                        },
                                    }}
                                    className="block bg-[image:var(--jpg-gradient)] bg-clip-text text-transparent"
                                >
                                    the background.
                                </motion.span>
                            </span>
                        </motion.h2>
                    </div>

                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        transition={{ delay: reduced ? 0 : 0.25 }}
                        className="max-w-md lg:justify-self-end lg:pb-3"
                    >
                        <p className="text-base leading-8 text-[var(--jpg-cream)]/60 sm:text-lg">
                            Every image holds a point of view. Every creator
                            has a story worth discovering. This is where
                            those perspectives find their place.
                        </p>

                        <div className="mt-7 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-[var(--jpg-muted)]">
                            <span className="h-px w-8 bg-[var(--jpg-orange)]" />
                            Made to be seen
                        </div>
                    </motion.div>
                </div>

                {/* Gallery heading */}
                <motion.div
                    variants={reveal}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mb-8 mt-20 flex items-end justify-between gap-4 border-b border-[var(--jpg-border)] pb-5 sm:mb-10 sm:mt-28"
                >
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--jpg-muted)]">
                            A world of perspectives
                        </p>
                        <h3 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                            Not made to blend in.
                        </h3>
                    </div>

                   
                </motion.div>

                {/* Artwork gallery */}
                <div className="grid grid-cols-2 items-start gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7">
                    {artworks.map((artwork, index) => (
                        <ExhibitionCard
                            key={artwork.id}
                            artwork={artwork}
                            index={index}
                            reduced={reduced}
                        />
                    ))}
                </div>

                {/* Closing statement */}
                <div className="relative mt-32 overflow-hidden border-t border-[var(--jpg-border)] pt-16 sm:mt-44 sm:pt-24 lg:mt-52">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-12 h-48 w-48 rounded-full bg-[var(--jpg-orange)]/[0.08] blur-[80px] sm:h-72 sm:w-72"
                    />

                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{
                            duration: reduced ? 0 : 0.9,
                            ease,
                        }}
                        className="relative"
                    >
                        {/* <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--jpg-red)] sm:text-xs">
                            Your perspective belongs here
                        </p> */}

                        <h3 className="max-w-5xl text-[clamp(2.8rem,7.5vw,7rem)] font-semibold leading-[0.95] tracking-[-0.07em]">
                            Make something.
                            <br />
                            <span className="text-[var(--jpg-cream)]/45">
                                Show the world.
                            </span>
                        </h3>

                        <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-md text-sm leading-7 text-[var(--jpg-muted)] sm:text-base">
                                Find your people, discover new perspectives,
                                and give your creative work room to exist.
                            </p>

                            <motion.a
                                href="#explore"
                                whileHover={reduced ? undefined : { y: -4 }}
                                whileTap={reduced ? undefined : { scale: 0.97 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 22,
                                }}
                                className="group inline-flex w-fit items-center gap-5 rounded-full bg-[image:var(--jpg-gradient)] px-7 py-4 text-sm font-bold text-[var(--jpg-black)] shadow-[0_0_0_rgba(249,29,29,0)] transition-shadow duration-300 hover:shadow-[0_12px_45px_rgba(249,29,29,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] sm:px-8"
                            >
                                Explore JPGVIBE
                                <span
                                    aria-hidden="true"
                                    className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                >
                                    <FaArrowTrendUp/>
                                </span>
                            </motion.a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--jpg-border)] pt-6">
                            <a
                                href="#explore"
                                className="group inline-flex items-center gap-2 text-sm text-[var(--jpg-cream)] transition-colors hover:text-[var(--jpg-yellow)]"
                            >
                                Explore the platform
                                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <FaArrowRight/>
                                </span>
                            </a>

                            <a
                                href="#services"
                                className="group inline-flex items-center gap-2 text-sm text-[var(--jpg-muted)] transition-colors hover:text-[var(--jpg-cream)]"
                            >
                                Discover what we do
                                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <FaArrowRight/>
                                </span>
                            </a>

                            <a
                                href="#exhibition"
                                className="group inline-flex items-center gap-2 text-sm text-[var(--jpg-muted)] transition-colors hover:text-[var(--jpg-cream)]"
                            >
                                Back to the exhibition
                                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <FaArrowRight/>
                                </span>
                            </a>
                        </div>

                    </motion.div>

                </div>
            </div>

            {/* Section closing rule */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--jpg-orange)]/50 to-transparent"
            />
        </section>
    );
}
