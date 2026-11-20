
import { motion, useReducedMotion } from "framer-motion";

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
              JPGVibe Publications / 001
            </p>

            <h1 className="max-w-2xl text-6xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              The
              <br />
              Photobook
              <span className="text-[var(--jpg-red)]">.</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-8 text-[var(--jpg-muted)] sm:text-lg">
              A visual publication celebrating photography, artistic
              expression, and the people shaping the creative culture.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <span className="rounded-full border border-[var(--jpg-orange)]/50 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[var(--jpg-orange)]">
                Coming Soon
              </span>

              <span className="text-sm text-[var(--jpg-muted)]">
                Pre-orders opening soon
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
                src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=90"
                alt="Photobook visual placeholder"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />

              <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--jpg-cream)]">
                    JPGVibe
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/60">
                    A visual collection
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-medium leading-none tracking-[-0.05em] sm:text-5xl">
                    THE
                    <br />
                    PHOTOBOOK
                  </h2>
                  <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[var(--jpg-orange)]">
                    Publication 001
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[var(--jpg-muted)]">
              Cover concept / Placeholder artwork
            </p>
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
              The JPGVibe Photobook is envisioned as a printed collection
              of visual stories, creative perspectives, and photographic
              expression. A space for images to exist beyond the screen
              and become something tangible.
            </p>

            <p className="mt-5 text-sm text-[var(--jpg-cream)]">
              Further publication details will be announced soon.
            </p>
          </div>
        </div>
      </section>

      {/* VISUAL PREVIEW */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--jpg-orange)]">
                Inside the collection
              </p>

              <h2 className="mt-5 text-4xl tracking-[-0.04em] sm:text-5xl">
                A glimpse of what's ahead.
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-7 text-[var(--jpg-muted)]">
              Visual previews and featured contributors will be revealed
              as the publication develops.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            {previews.map((item, index) => (
              <motion.div
                key={item.number}
                initial={reduced ? false : { opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease, delay: index * 0.12 }}
                className={item.className}
              >
                <div className="group relative aspect-[4/3] overflow-hidden bg-[var(--jpg-surface-raised)]">
                  <img
                    src={item.image}
                    alt={`Photobook preview placeholder: ${item.label}`}
                    className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <p className="text-lg">{item.label}</p>
                    <span className="text-xs tracking-[0.2em] text-[var(--jpg-orange)]">
                      {item.number}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--jpg-muted)]">
                  Preview placeholder
                </p>
              </motion.div>
            ))}
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
