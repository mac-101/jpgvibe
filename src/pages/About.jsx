import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import InstagramStrip from "../instagram/InstagramStrip";
import { ROUTES } from "../routes";

const ease = [0.22, 1, 0.36, 1];

// Her four paragraphs. The only edits are "it's" to "its" (twice) and a stray space in "African/ black".
const story = [
  "The VIBE is an organization and a community of and for artists from Africa and in the diaspora.",
  "Africa stands at the epicenter of the largest talent mine in the world. However, its contribution to the creative industry at large seems negligible. Hence, we are for the promotion of creative talent as a catalyst for social development and cultural exchange.",
  "We have created a community of African/black artists online which has now developed into relationships and connections. This has led to presence building in locations such as Nigeria, Kenya, Zimbabwe, Ghana, South Africa, United Kingdom, Brazil, America. The community we have built from pure love and viral engagement, has transcended the barriers and cultivated a solid relationship for community outreach.",
  "The vibe seeks to use its platform to increase the reach of artists from all corners of the African continent.",
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

function Reveal({ as = "div", delay = 0, y = 28, reduced, className = "", children }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

const COUNTRIES = [
  "Nigeria", "Kenya", "Zimbabwe", "Ghana",
  "South Africa", "United Kingdom", "Brazil", "America",
];
const pattern = new RegExp(`(${COUNTRIES.join("|")})`, "g");

function Highlighted({ text }) {
  return text.split(pattern).map((part, i) =>
    COUNTRIES.includes(part) ? (
      <strong key={i} className="font-semibold text-[var(--jpg-cream)]">
        {part}
      </strong>
    ) : (
      part
    )
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
          {/* Header, with the small red block from the mockup */}
          <header className="mb-14 sm:mb-20">
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease }}
              className="mb-8 block h-7 w-40 origin-left bg-[var(--jpg-red)]"
            />
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
            >
              <span style={{ color: "var(--jpg-muted)" }}>About</span>
              <br />
              thevibe<span style={{ color: "var(--jpg-red)" }}>.</span>
            </motion.h1>
          </header>

          {/* The story */}
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            {story.map((paragraph, i) => (
              <Reveal
                as="p"
                key={i}
                reduced={reduced}
                delay={0.05}
                className="font-body text-lg leading-8 text-[var(--jpg-cream)]/90 sm:text-xl sm:leading-9"
              >
                <Highlighted text={paragraph} />
              </Reveal>
            ))}
          </div>

          {/* "we are" banner */}
          <div className="relative mt-20 sm:mt-28">
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

            {/* "for the love." is a normal line. The closing line is the big one. */}
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

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to={ROUTES.waitlist}
                className="inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-6 py-3.5 font-button text-sm text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
              >
                Join the VibeGig waitlist <FaArrowRight aria-hidden="true" />
              </Link>
              <Link
                to={ROUTES.services}
                className="inline-flex items-center gap-3 rounded-full border border-[var(--jpg-border)] px-6 py-3.5 font-button text-sm transition-colors hover:border-[var(--jpg-cream)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
              >
                Explore our services <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Posts 13 to 16: Home, Services and Team already use the first 12 */}
      <InstagramStrip start={12} />
    </>
  );
}