import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const pillars = [
  {
    id: "connection",
    index: "01",
    title: "Connection",
    body: "Meet the artists, photographers and collectors shaping the culture, and build something together.",
    points: [
      "Find collaborators across disciplines",
      "Open calls and commissions",
      "A community that engages with the work",
    ],
    color: "var(--jpg-red)",
    glow: "rgba(249,29,29,0.20)",
    offset: "md:mt-0",
    float: 12,
    duration: 6.2,
    floatDelay: 0,
    icon: (
      <>
        <circle cx="9" cy="12" r="5.5" />
        <circle cx="15" cy="12" r="5.5" />
      </>
    ),
  },
  {
    id: "curation",
    index: "02",
    title: "Curation",
    body: "Work is chosen with intention, not buried by an algorithm. Every piece gets context and room to be seen.",
    points: [
      "Hand-picked features and collections",
      "Guest curators and editors",
      "Stories that sit beside each work",
    ],
    color: "var(--jpg-orange)",
    glow: "rgba(255,106,0,0.20)",
    offset: "md:mt-14",
    float: 16,
    duration: 7.4,
    floatDelay: 1.1,
    icon: (
      <>
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
      </>
    ),
  },
  {
    id: "exhibition",
    index: "03",
    title: "Exhibition",
    body: "Give your work a proper stage, with dedicated spaces to show, share and be discovered.",
    points: [
      "Portfolio rooms with your own layout",
      "Online shows with opening dates",
      "Share your exhibition anywhere",
    ],
    color: "var(--jpg-yellow)",
    glow: "rgba(255,230,0,0.14)",
    offset: "md:mt-6",
    float: 14,
    duration: 6.8,
    floatDelay: 2.2,
    icon: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
        <path d="M3.5 15.5 9 10l4 4 2.5-2.5 5 5" />
      </>
    ),
  },
];

function PillarCard({ pillar, index, reduced }) {
  // Cursor position inside the card, 0 to 1
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const spring = { stiffness: 160, damping: 20, mass: 0.5 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const glow = useSpring(hover, { stiffness: 120, damping: 24 });

  const rotateY = useTransform(sx, [0, 1], [9, -9]);
  const rotateX = useTransform(sy, [0, 1], [-9, 9]);

  const gx = useTransform(sx, (v) => v * 100);
  const gy = useTransform(sy, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${gx}% ${gy}%, ${pillar.glow}, transparent 65%)`;

  const handleMove = (e) => {
    // Tilt is for mouse only. Touch devices keep the float.
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    hover.set(1);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    hover.set(0);
  };

  return (
    <div className={pillar.offset}>
      {/* Layer 1: entrance on scroll */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease, delay: index * 0.14 }}
      >
        {/* Layer 2: idle float */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -pillar.float, 0] }}
          transition={{
            duration: pillar.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: pillar.floatDelay,
          }}
        >
          {/* Layer 3: 3D tilt */}
          <motion.article
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            style={{
              transformPerspective: 1200,
              transformStyle: "preserve-3d",
              rotateX: reduced ? 0 : rotateX,
              rotateY: reduced ? 0 : rotateY,
            }}
            className="relative min-h-[400px] rounded-3xl"
          >
            {/* Surface: clipped separately so the content can still pop forward */}
            <div
              className="absolute inset-0 overflow-hidden rounded-3xl border shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
              style={{
                borderColor: "var(--jpg-border)",
                background:
                  "linear-gradient(160deg, var(--jpg-surface-raised), var(--jpg-surface))",
              }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: spotlight, opacity: glow }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                  opacity: 0.55,
                }}
              />
            </div>

            {/* Content sits slightly in front of the surface */}
            <div
              className="relative flex h-full min-h-[400px] flex-col p-7 sm:p-8"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                  style={{
                    borderColor: "var(--jpg-border)",
                    color: pillar.color,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {pillar.icon}
                  </svg>
                </span>

                <span
                  aria-hidden="true"
                  className="text-xs tabular-nums"
                  style={{ color: "var(--jpg-muted)" }}
                >
                  {pillar.index}
                </span>
              </div>

              <h3 className="mt-10 text-3xl font-medium tracking-tight sm:text-4xl">
                {pillar.title}
              </h3>

              <p
                className="mt-4 text-sm leading-7"
                style={{ color: "var(--jpg-muted)" }}
              >
                {pillar.body}
              </p>

              <ul
                className="mt-auto space-y-3 border-t pt-6 text-sm"
                style={{ borderColor: "var(--jpg-border)" }}
              >
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: pillar.color }}
                    />
                    <span style={{ color: "var(--jpg-cream)", opacity: 0.85 }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ValueGrid() {
  const reduced = useReducedMotion();

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{
        backgroundColor: "var(--jpg-black)",
        color: "var(--jpg-cream)",
      }}
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 15% 30%, rgba(249,29,29,0.07), transparent 70%), radial-gradient(ellipse 45% 40% at 85% 70%, rgba(255,106,0,0.07), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease }}
          className="mb-14 max-w-2xl sm:mb-20"
        >
          <h2 className="text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Built for how
            <br />
            <span style={{ color: "var(--jpg-muted)" }}>creatives work.</span>
          </h2>

          <p
            className="mt-5 max-w-lg text-sm leading-7 sm:text-base"
            style={{ color: "var(--jpg-muted)" }}
          >
            Three things, done properly: finding your people, being seen with
            intention, and showing your work on a real stage.
          </p>
        </motion.div>

        <div className="grid items-start gap-6 md:grid-cols-3 lg:gap-8">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              index={index}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}