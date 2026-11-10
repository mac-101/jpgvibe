
import { motion, useReducedMotion } from "framer-motion";
import InstagramStrip from "../instagram/InstagramStrip";

const ease = [0.22, 1, 0.36, 1];

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

                        <div className="mt-7 flex font-label items-center gap-4  uppercas text-[var(--jpg-muted)]">
                            <span className="h-px w-8 bg-[var(--jpg-orange)]" />
                            Made to be seen
                        </div>
                    </motion.div>
                </div>


            </div>
                <InstagramStrip start={0} heading="Our art feed"/>

            {/* Section closing rule */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--jpg-orange)]/50 to-transparent"
            />
        </section>
    );
}
