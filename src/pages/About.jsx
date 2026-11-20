import { motion, useReducedMotion } from "framer-motion";
import InstagramStrip from "../instagram/InstagramStrip";

const ease = [0.22, 1, 0.36, 1];

// "the background." is split across two lines, so each line takes its own slice of the gradient
const GRADIENT =
  "linear-gradient(100deg, var(--jpg-yellow) 0%, #FFB300 35%, var(--jpg-orange) 65%, var(--jpg-red) 100%)";

const HERO_LINES = [
  { text: "Art doesn’t" },
  { text: "belong in" },
  { text: "the", gradient: "start" },
  { text: "background.", gradient: "end" },
];

// A paragraph is a list of parts: plain text, { hi } (brighter cream) or { red }
const columns = [
  {
    id: "why",
    count: "01",
    title: "Why we exist",
    paragraphs: [
      [
        "Africa is a wellspring of creative talent, yet its voices are still under-recognised across the wider creative industry. We exist to change that, promoting creative talent as a catalyst for social development and cultural exchange.",
      ],
    ],
  },
  {
    id: "built",
    count: "02",
    title: "What we built",
    paragraphs: [
      [
        "It began as a community of African and black artists online. Built from pure love and viral engagement, it grew into real relationships and connections, with a presence across ",
        {
          hi: "Nigeria, Kenya, Zimbabwe, Ghana, South Africa, the United Kingdom, Brazil and America.",
        },
      ],
    ],
  },
  {
    id: "next",
    count: "03",
    title: "Where we’re going",
    paragraphs: [
      [
        "We’re building the tools artists have always needed. We’re turning community into opportunity: a system where creatives get found, get booked and get paid.",
      ],
      [
        {
          hi: "In print and on screen, something is taking shape. Two projects we can’t wait to show you. ",
        },
        { red: "Soon." },
      ],
    ],
  },
];

// Groups are separated by a gap, as in the original mockup
const groups = [
  ["the celebration of every black creative; all circles."],
  [
    "for the promotion of creative talent as a catalyst for social development.",
    "creating a seamless avenue for the freedom of creative expression and inspiration.",
    "we are rooted across africa and in the diaspora.",
  ],
];

const lineClass =
  "font-body text-base leading-8 tracking-[0.1em] text-[var(--jpg-cream)] sm:text-lg sm:leading-9";

const wrap = "mx-auto max-w-7xl px-6 sm:px-10 lg:px-16";

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

function Parts({ parts }) {
  return parts.map((part, i) => {
    if (typeof part === "string") return <span key={i}>{part}</span>;
    if (part.red)
      return (
        <span key={i} style={{ color: "var(--jpg-red)" }}>
          {part.red}
        </span>
      );
    return (
      <span key={i} className="text-[var(--jpg-cream)]">
        {part.hi}
      </span>
    );
  });
}

/* Each line rises out of its own mask when the page loads */
function HeadlineLines({ lines, reduced, delay = 0 }) {
  return lines.map((line, i) => (
    <span
      key={line.text}
      className="block overflow-hidden pb-[0.25em] pt-[0.15em] -mb-[0.25em] -mt-[0.15em]"
    >
      <motion.span
        className="block"
        initial={reduced ? false : { y: "140%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
      >
      {line.gradient ? (
  <span
    className="bg-clip-text text-transparent"
    style={{ backgroundImage: GRADIENT }}
  >
    {line.text}
  </span>
) : (
  line.text
)}
      </motion.span>
    </span>
  ));
}

export default function AboutPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <div style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}>
        {/* Header: label, headline, and the intro text under it on the left */}
        <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(120,20,0,0.28), transparent 70%), radial-gradient(ellipse 50% 40% at 100% 90%, rgba(90,35,0,0.2), transparent 70%)",
            }}
          />

          <div className={wrap}>
            <h1 className="text-[clamp(2.7rem,8.5vw,8rem)] leading-[0.92] tracking-[-0.045em] text-[var(--jpg-cream)]">
              <motion.span
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease }}
                className="mb-8 block font-label text-[var(--jpg-red)] sm:mb-10"
              >
                our story
              </motion.span>
              <HeadlineLines lines={HERO_LINES} reduced={reduced} delay={0.15} />
            </h1>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.8 }}
              className="mt-10 max-w-xl sm:mt-14"
            >
              <p className="font-body text-xl leading-9 text-[var(--jpg-cream)]/90 sm:text-2xl sm:leading-10">
                thevibe. is an organisation and a community of and for artists
                from Africa and the diaspora.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--jpg-red)]" />
                <span className="font-label text-[var(--jpg-cream)]/60">
                  Made to be seen
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* "we are" block, now right after the header */}
        <section className="relative overflow-hidden pb-20 pt-4 sm:pb-28">
          <div className={wrap}>
            <div className="relative">
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

        {/* Three columns */}
        <section className="pb-24 sm:pb-32">
          <div className={wrap}>
            <div className="grid gap-12 border-t border-[var(--jpg-border)] pt-10 sm:pt-12 md:grid-cols-3 md:gap-10 lg:gap-14">
              {columns.map((col, i) => (
                <Reveal
                  key={col.id}
                  reduced={reduced}
                  delay={i * 0.12}
                  className="max-w-md"
                >
                  <h2 className="flex items-baseline gap-4 font-label font-bold text-[var(--jpg-red)]">
                    <span aria-hidden="true">{col.count}</span>
                    {col.title}
                  </h2>

                  <div className="mt-6 space-y-6 font-body text-lg leading-8 text-[var(--jpg-cream)]/65">
                    {col.paragraphs.map((parts, pi) => (
                      <p key={pi}>
                        <Parts parts={parts} />
                      </p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        
      </div>

      {/* Posts 13 to 16: Home, Services and Team already use the first 12 */}
      <InstagramStrip start={12} />
    </>
  );
}