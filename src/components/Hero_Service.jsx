import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const services = [
  {
    id: "curation",
    slug: "fine-art-curation",
    title: "Fine Art Curation & Digital Exhibition Hosting",
    tagline: "Shows with a point of view, hosted online.",
    description:
      "We select, sequence and stage your work as a considered exhibition, then host it as a polished digital show people can visit and share.",
    deliverables: [
      "Curatorial concept and artwork selection",
      "Custom digital exhibition space",
      "Launch, press and opening-night support",
      "Visitor analytics and a follow-up report",
    ],
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80",
    glow: "rgba(249,29,29,0.22)",
    float: 12,
    duration: 6.4,
    floatDelay: 0,
  },
  {
    id: "photography",
    slug: "commercial-photography",
    title: "Commercial Photography & Visual Direction",
    tagline: "Images that carry a brand, shot with intent.",
    description:
      "From concept to final edit, we direct and shoot imagery that gives your brand a clear, consistent and memorable visual voice.",
    deliverables: [
      "Creative direction and mood boards",
      "Campaign, product and portrait shoots",
      "Art direction on set",
      "Retouching and a licensed image library",
    ],
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    glow: "rgba(255,106,0,0.22)",
    float: 15,
    duration: 7.2,
    floatDelay: 1.1,
  },
  {
    id: "branding",
    slug: "artist-branding",
    title: "Artist Branding & Digital Identity Systems",
    tagline: "A look and a voice that are unmistakably yours.",
    description:
      "We build the full identity around your practice, so everything you put out, from your site to your socials, feels like one body of work.",
    deliverables: [
      "Logo, type and colour system",
      "Portfolio website design",
      "Social and presentation templates",
      "A brand guide your team can use",
    ],
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80",
    glow: "rgba(255,230,0,0.16)",
    float: 13,
    duration: 6.8,
    floatDelay: 2.2,
  },
  {
    id: "network",
    slug: "creator-network",
    title: "Creator Network & Portfolio Management",
    tagline: "Your work, represented and put in front of the right people.",
    description:
      "We manage your portfolio and open doors, connecting you with collaborators, galleries and brands that fit your practice.",
    deliverables: [
      "Portfolio review and ongoing updates",
      "Introductions to brands and galleries",
      "Opportunity and commission scouting",
      "Quarterly growth check-ins",
    ],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    glow: "rgba(249,29,29,0.2)",
    float: 14,
    duration: 7,
    floatDelay: 3.2,
  },
];

function ServiceCard({ service, index, open, onOpen, onClose, onToggle, reduced }) {
  const lastPointer = useRef("mouse");

  // Cursor position inside the card, 0 to 1
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const spring = { stiffness: 160, damping: 20, mass: 0.5 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const glow = useSpring(hover, { stiffness: 120, damping: 24 });

  const rotateY = useTransform(sx, [0, 1], [6, -6]);
  const rotateX = useTransform(sy, [0, 1], [-6, 6]);

  const gx = useTransform(sx, (v) => v * 100);
  const gy = useTransform(sy, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${gx}% ${gy}%, ${service.glow}, transparent 65%)`;

  const handleEnter = (e) => {
    lastPointer.current = e.pointerType;
    if (e.pointerType === "mouse") onOpen();
  };

  const handleMove = (e) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    hover.set(1);
  };

  const handleLeave = (e) => {
    mx.set(0.5);
    my.set(0.5);
    hover.set(0);
    if (e.pointerType === "mouse") onClose();
  };

  // Mouse users already opened it by hovering. Taps and keyboard presses toggle.
  const handleClick = (e) => {
    if (e.detail !== 0 && lastPointer.current === "mouse") return;
    onToggle();
  };

  return (
    <div className={index % 2 === 1 ? "md:mt-12" : ""}>
      {/* Layer 1: entrance */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease, delay: (index % 2) * 0.14 }}
      >
        {/* Layer 2: idle float, which settles while the card is open so it's easy to read */}
        <motion.div
          animate={
            reduced ? undefined : open ? { y: 0 } : { y: [0, -service.float, 0] }
          }
          transition={
            open
              ? { duration: 0.6, ease }
              : {
                  duration: service.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: service.floatDelay,
                }
          }
        >
          {/* Layer 3: tilt */}
          <motion.article
            data-service-card
            onPointerDown={(e) => (lastPointer.current = e.pointerType)}
            onPointerEnter={handleEnter}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            style={{
              transformPerspective: 1200,
              rotateX: reduced ? 0 : rotateX,
              rotateY: reduced ? 0 : rotateY,
            }}
            className="relative min-h-[360px] rounded-3xl sm:min-h-[400px]"
          >
            {/* Glass surface */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
              <img
                src={service.image}
                alt=""
                loading="lazy"
                draggable="false"
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-[1200ms] ease-out"
                style={{ transform: open ? "scale(1.06)" : "scale(1)" }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.88) 100%)",
                }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: spotlight, opacity: glow }}
              />

              {/* Resting content */}
              <div className="pointer-events-none relative flex h-full min-h-[360px] flex-col justify-end p-7 sm:min-h-[400px] sm:p-8">
                <div>
                  <h3 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                    {service.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-6"
                    style={{ color: "var(--jpg-cream)", opacity: 0.7 }}
                  >
                    {service.tagline}
                  </p>
                  <p className="text-sm text-right leading text-(--jpg-orange)">Learn More</p>
                </div>
              </div>

              {/* Toggle target for taps and keyboard */}
              <button
                type="button"
                onClick={handleClick}
                aria-expanded={open}
                aria-label={`${service.title}. ${open ? "Hide" : "Show"} details`}
                className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4"
                style={{
                  outlineColor: "var(--jpg-orange)",
                  WebkitTapHighlightColor: "transparent",
                }}
              />

              {/* Black cover with the breakdown */}
              <motion.div
                aria-hidden={!open}
                initial={false}
                animate={{ y: open ? "0%" : "101%" }}
                transition={{ duration: reduced ? 0 : 0.7, ease }}
                style={{ pointerEvents: open ? "auto" : "none" }}
                className="absolute inset-0 z-20 flex flex-col bg-black/[0.95] p-7 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-medium leading-snug tracking-tight sm:text-xl">
                    {service.title}
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    tabIndex={open ? 0 : -1}
                    aria-label="Close details"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2"
                    style={{
                      color: "var(--jpg-cream)",
                      outlineColor: "var(--jpg-orange)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>

                <motion.div
                  initial={false}
                  animate={{ opacity: open ? 1 : 0, y: open ? 0 : 18 }}
                  transition={{ duration: reduced ? 0 : 0.6, ease, delay: open ? 0.2 : 0 }}
                  className="mt-4 flex flex-1 flex-col"
                >
                  <p
                    className="text-sm leading-7"
                    style={{ color: "var(--jpg-cream)", opacity: 0.8 }}
                  >
                    {service.description}
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--jpg-orange)" }}
                        />
                        <span style={{ color: "var(--jpg-cream)", opacity: 0.88 }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/contact?service=${service.slug}`}
                    tabIndex={open ? 0 : -1}
                    className="mt-auto inline-flex items-center justify-center gap-3 self-start rounded-full bg-[image:var(--jpg-gradient)] px-6 py-3.5 text-sm font-bold text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                  >
                    Inquire Now <span aria-hidden="true">↗</span>
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* Gradient border that draws down the edge on open */}
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{
                clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
              }}
              transition={{ duration: reduced ? 0 : 0.9, ease }}
              className="pointer-events-none absolute inset-0 z-30 rounded-3xl"
              style={{
                padding: 1.5,
                background:
                  "linear-gradient(180deg, var(--jpg-red), var(--jpg-orange), var(--jpg-yellow))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
              }}
            />
          </motion.article>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState(null);

  // Tapping anywhere outside the cards closes the open one (touch devices)
  useEffect(() => {
    const onDown = (e) => {
      if (!e.target.closest("[data-service-card]")) setOpenId(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <section
      className="relative overflow-hidden pb-28 pt-32 sm:pb-36 sm:pt-40"
      style={{
        backgroundColor: "var(--jpg-black)",
        color: "var(--jpg-cream)",
      }}
    >
      {/* Colour behind the glass, so the blur has something to catch */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--jpg-red)] opacity-[0.16] blur-[120px]"
          animate={reduced ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 top-1/2 h-[460px] w-[460px] rounded-full bg-[var(--jpg-orange)] opacity-[0.13] blur-[130px]"
          animate={reduced ? undefined : { x: [0, -70, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="mb-14 max-w-3xl sm:mb-20"
        >
          <h1 className="text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Bespoke Services for
            <br />
            <span style={{ color: "var(--jpg-muted)" }}>Artists &amp; Brands</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-8 sm:text-lg"
            style={{ color: "var(--jpg-cream)", opacity: 0.8 }}
          >
            From the first idea to the finished show, we shape how your work is
            seen, presented and remembered.
          </p>
        </motion.div>

        <div className="grid items-start gap-6 md:grid-cols-2 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              reduced={reduced}
              open={openId === service.id}
              onOpen={() => setOpenId(service.id)}
              onClose={() => setOpenId((cur) => (cur === service.id ? null : cur))}
              onToggle={() =>
                setOpenId((cur) => (cur === service.id ? null : service.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}