import { FaArrowRight, FaArrowTrendUp } from "react-icons/fa6"
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useReducedMotion
} from "framer-motion";

export default function Footer() {
    const reduced = useReducedMotion();
    const ease = [0.22, 1, 0.36, 1];


    return (
        <>
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
                                    <FaArrowTrendUp />
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
                                    <FaArrowRight />
                                </span>
                            </a>

                            <a
                                href="#services"
                                className="group inline-flex items-center gap-2 text-sm text-[var(--jpg-muted)] transition-colors hover:text-[var(--jpg-cream)]"
                            >
                                Discover what we do
                                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <FaArrowRight />
                                </span>
                            </a>

                            <a
                                href="#exhibition"
                                className="group inline-flex items-center gap-2 text-sm text-[var(--jpg-muted)] transition-colors hover:text-[var(--jpg-cream)]"
                            >
                                Back to the exhibition
                                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <FaArrowRight />
                                </span>
                            </a>
                        </div>

                    </motion.div>

                </div>

                {/* Section closing rule */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--jpg-orange)]/50 to-transparent"
                />
            </section>
        </>
    )
}