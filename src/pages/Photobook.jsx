
import { motion, useReducedMotion } from "framer-motion";
import logo from '../assets/logo';

const ease = [0.22, 1, 0.36, 1];

const previews = [
  {
    number: "01",
    label: "The Vision",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=85",
    className: "md:col-span-7",
  },
  {
    number: "02",
    label: "The Artists",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=85",
    className: "md:col-span-5 md:mt-24",
  },
  {
    number: "03",
    label: "The Expression",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=85",
    className: "md:col-span-5",
  },
];

export default function Photobook() {
  const reduced = useReducedMotion();

  return (
    <main
      className="min-h-screen overflow-hidden bg-[var(--jpg-black)] text-[var(--jpg-cream)]"
    >

      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center px-6 pb-24 pt-36 sm:px-10 lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--jpg-orange)] opacity-[0.12] blur-[140px]"
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <p className="mb-7 text-xs uppercase tracking-[0.35em] text-[var(--jpg-orange)]">
              Publication 001
            </p>

            <h1 className="max-w-2xl text-6xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              The
              <br />
              Photobook
              <span className="text-[var(--jpg-red)]">.</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-8 text-[var(--jpg-muted)] sm:text-lg">
              A printed collection of work. Images made to be held, kept and returned to.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <span className="rounded-full border border-[var(--jpg-orange)]/50 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[var(--jpg-orange)]">
                Coming Soon
              </span>
            </div>
          </motion.div>

          {/* Photobook cover placeholder */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 50, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[420px]"
          >
            <div
              className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-[var(--jpg-surface-raised)] shadow-[25px_30px_80px_rgba(0,0,0,0.65)]"
            >
              <img
                src={logo}
                alt="Photobook visual placeholder"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />

              <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--jpg-cream)]">
                    the vibe<span className="text-[var(--jpg-red)]">.</span>
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/60">
                    A visual collection
                  </p>
                </div>

                <div>
                  <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[var(--jpg-orange)]">
                    Publication 001
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="border-t border-[var(--jpg-border)] px-6 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--jpg-red)]">
              About the publication
            </p>

            <h2 className="mt-6 max-w-lg text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
              More than images.
              <br />
              A collection of perspectives.
            </h2>
          </div>

          <div className="flex flex-col justify-end">
            <p className="text-base leading-8 text-[var(--jpg-muted)]">
              Our first printed publication is a collection of perspectives. Each piece will be chosen with intention to give the work a life beyond our screens. Yours for a lifetime: to hold, to share and to keep. 
More information will be shared soon.
            </p>

            <p className="mt-5 text-sm text-[var(--jpg-cream)]">
              Further publication details will be announced soon.
            </p>
          </div>
        </div>
      </section>
      
      {/* PRE-ORDER ANNOUNCEMENT */}
      <section className="relative px-6 py-32 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[var(--jpg-surface)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--jpg-orange)]">
            Publication 001
          </p>

          <h2 className="mt-7 text-5xl leading-[1.05] tracking-[-0.05em] sm:text-7xl">
            Something worth
            <br />
            keeping.
          </h2>

          <p className="mx-auto mt-7 max-w-lg text-base leading-8 text-[var(--jpg-muted)]">
            The JPGVibe Photobook is on its way. Pre-order information,
            release details, and availability will be announced soon.
          </p>

          <div className="mt-10 inline-flex cursor-not-allowed items-center gap-3 rounded-full border border-[var(--jpg-orange)]/40 px-7 py-4 text-xs uppercase tracking-[0.2em] text-[var(--jpg-orange)] opacity-80">
            Pre-orders coming soon
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </section>
    </main>
  );
}
