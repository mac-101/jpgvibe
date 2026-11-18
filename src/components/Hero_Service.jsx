import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ROUTES } from "../routes";
import { artworkImages } from "../artworkImages";

const ease = [0.22, 1, 0.36, 1];

const services = [
  {
    id: "creative-direction",
    slug: "creative-direction",
    title: "Creative Direction & Campaign Production",
    tagline: "We shape the vision with you, then bring it to life.",
    description:
      "We co - create the concept with designers and brands, then bring in photographers and creatives from our community to make it real.",
    deliverables: [
      "Concept, moodboard and creative direction",
      "Runway, Campaign, loolbook and behind-the-scenes shoots",
      "Multidisciplinary creatives from our community",
      "Final work delivered, ready to share with the world",
    ],
    image: artworkImages[8],
    glow: "rgba(255,106,0,0.28)",
    float: 12,
    duration: 6.4,
    floatDelay: 0,
    featured: true,
  },
  {
    id: "curation",
    slug: "fine-art-curation",
    title: "Curation & Exhibition",
    tagline: "Art choden with intention, shown with purpose.",
    description:
      "We select, sequence and work by African and dispora artists, for a space, a show or a brand moment.",
    deliverables: [
      "Curated exhibitionand pop-ups, in person or online",
      "Art sourcing for spaces: hotels, restaurants,  offices and homes",
      "Artist selection for brand collections and commissions",
      "Social rollout and promotionto you community",
    ],
    image: artworkImages[3],
    glow: "rgba(249,29,29,0.22)",
    float: 12,
    duration: 6.4,
    floatDelay: 0,
    featured: true,
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
    <div
      id={service.featured ? "creative-direction" : undefined}
      className={
        service.featured
          ? "md:col-span-2"
          : index % 2 === 0
            ? "md:mt-12"
            : ""
      }
    >
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
            className={`relative min-h-[400px] rounded-3xl`}
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
                  <h2 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                    {service.title}
                  </h2>
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
                  <h2 className="text-lg font-medium leading-snug tracking-tight sm:text-xl">
                    {service.title}
                  </h2>
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
                    href={`${ROUTES.contact}?service=${service.slug}`}
                    tabIndex={open ? 0 : -1}
                    className="mt-auto inline-flex items-center justify-center gap-3 self-start rounded-full bg-[image:var(--jpg-gradient)] px-6 py-3.5 font-button text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                  >
                    Let's create
                    <span aria-hidden="true">↗</span>
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
            <header className="mb-16 sm:mb-24">
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <span
                className="block text-xg sm:text-2xl"
                style={{ color: "var(--jpg-red)" }}
              >
                Services
              </span>
              <span className="mt-5 block text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
                Work with
                <br />
                The Vibe <span style={{ color: "var(--jpg-red)" }}>.</span>
              </span>
            </motion.h1>
          </header>

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