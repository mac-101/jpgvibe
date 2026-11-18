import { motion, useReducedMotion } from "framer-motion";
import InstagramStrip from "../instagram/InstagramStrip";

const ease = [0.22, 1, 0.36, 1];

const sections = [
  {
    id: "why",
    title: "Why we exist",
    body: "Africa is a wellspring of creative talent, yet its voice is still under-recognised across the wider creative industry. We exist to change that. We are promoting creative talent as a catalyst for social development and cultural exchange.",
  },
  {
    id: "built",
    title: "What we built",
    body: "It all began as a community of and for black artists online. Built from pure love and viral engagement, it grew into real relationships and connections. We are a community that has crossed borders.",
  },
  {
    id: "next",
    title: "Where we are going",
    body: "We’re building the tools artists have always needed. We’re turning community into opportunity. A system where creatives will get found, get booked and get paid.",
    teaser: [
      "In print and on screen, something is taking shape.",
      "Two projects we can’t wait to show you.",
      "Soon.",
    ],
  },
];

// Groups are separated by a gap, as in the mockup
const groups = [
  ["the celebration of every black creative; all circles."],
  [
    "for the promotion of creative talent as a catalyst for social development.",
    "creating a seamless avenue for the freedom of creative expression and inspiration.",
    "we are rooted across africa and in the diaspora.",
  ],
];

function Reveal({ as = "div", delay = 0, y = 28, reduced, className = "", children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const lineClass =
  "font-body text-base leading-8 tracking-[0.1em] text-[var(--jpg-cream)] sm:text-lg sm:leading-9";

export default function AboutPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section
        className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40"
        style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 30% at 12% 8%, rgba(249,29,29,0.09), transparent 70%), radial-gradient(ellipse 45% 30% at 90% 80%, rgba(249,29,29,0.06), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          {/* Header: small "our story", then the headline */}
          <header className="mb-16 sm:mb-24">
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease }}
              className="mb-8 block h-7 w-40 origin-left bg-[var(--jpg-cream)]"
            />
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <span
                className="block text-lg sm:text-xl"
                style={{ color: "var(--jpg-red)" }}
              >
                our story
              </span>
              <span className="mt-5 block text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
                Art doesn’t belong
                <br />
                in the background.
              </span>
            </motion.h1>
          </header>

          {/* Three sections: title on the left, text on the right */}
          <div className="border-b border-[var(--jpg-border)]">
            {sections.map((s) => (
              <Reveal
                as="section"
                key={s.id}
                reduced={reduced}
                aria-labelledby={`about-${s.id}`}
                className="grid gap-5 border-t border-[var(--jpg-border)] py-12 sm:py-16 md:grid-cols-[1fr_2fr] md:gap-16"
              >
                <h2
                  id={`about-${s.id}`}
                  className="text-3xl leading-tight sm:text-4xl"
                >
                  {s.title}
                </h2>

                <div className="max-w-2xl">
                  <p className="font-body text-xl leading-9 text-[var(--jpg-cream)]/90 sm:text-2xl sm:leading-10">
                    {s.body}
                  </p>

                  {s.teaser && (
                    <p className="mt-10 font-heading text-3xl leading-[1.2] sm:text-4xl">
                      {s.teaser.map((line) => (
                        <span
                          key={line}
                          className="block"
                          style={line === "Soon." ? { color: "var(--jpg-red)" } : undefined}
                        >
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* "we are" banner */}
          <div className="relative mt-16 sm:mt-24">
            <motion.div
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease }}
              className="absolute inset-0 origin-left bg-[var(--jpg-red)]"
            />
            <motion.h2
              initial={reduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
              className="relative px-6 py-5 text-6xl font-normal leading-none tracking-normal sm:px-10 sm:py-7 sm:text-8xl"
              style={{ color: "var(--jpg-black)" }}
            >
              we are
            </motion.h2>
          </div>

          {/* The lines, spaced out like the mockup */}
          <div className="mt-10 max-w-3xl sm:mt-14">
            {groups.map((group, gi) => (
              <div key={gi} className={gi === 0 ? "" : "mt-10 sm:mt-12"}>
                {group.map((line, li) => (
                  <Reveal
                    as="p"
                    key={line}
                    reduced={reduced}
                    delay={li * 0.08}
                    className={lineClass}
                  >
                    {line}
                  </Reveal>
                ))}
              </div>
            ))}

            <div className="mt-10 sm:mt-12">
              <Reveal as="p" reduced={reduced} className={lineClass}>
                for the love.
              </Reveal>

              <Reveal
                as="p"
                y={44}
                delay={0.12}
                reduced={reduced}
                className="mt-8 font-heading text-4xl leading-[1.05] tracking-normal text-[var(--jpg-cream)] sm:mt-10 sm:text-6xl md:text-7xl"
              >
                for us, by us,
                <br />
                <span style={{ color: "var(--jpg-red)" }}>to the world.</span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Posts 13 to 16: Home, Services and Team already use the first 12 */}
      <InstagramStrip start={12} />
    </>
  );
}