import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const images = [
  "photo-1531058020387-3be344556be6",
  "photo-1549490349-8643362247b5",
  "photo-1579783902614-a3fb3927b6a5",
  "photo-1577083552431-6e5fd01aa342",
  "photo-1541961017774-22349e4a1262",
  "photo-1513364776144-60967b0f800f",
  "photo-1515405295579-ba7b45403062",
  "photo-1501472312651-726afe119ff1",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1500648767791-00dcc994a43e",
  "photo-1534528741775-53994a69daeb",
  "photo-1524504388940-b1c1722653e1",
  "photo-1492684223066-81342ee5ff30",
  "photo-1516280440614-37939bbacd81",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1470252649378-9c29740c9fa8",
  "photo-1494438639946-1ebd1d20bf85",
  "photo-1518005020951-eccb494ad742",
  "photo-1515886657613-9f3515b0c78f",
  "photo-1519681393784-d120267933ba",
  "photo-1500534623283-312aade485b7",
  "photo-1517841905240-472988babdf9",
  "photo-1531123897727-8f129e1688ce",
  "photo-1529139574466-a303027c1d8b",
  "photo-1508214751196-bcfd4ca60f91",
  "photo-1534528741775-53994a69daeb",
  "photo-1529626455594-4ff0802cfb7e",
  "photo-1504593811423-6dd665756598",
];

/**
 * Polygon rings. Index 0 = closest to the viewer.
 * 4 + 5 + 6 + 7 + 6 = 28 images.
 * radius    -> ring size while scattered
 * endRadius -> ring size at the end (pushed out to frame the message)
 */
const LAYERS = [
  { sides: 4, startAngle: 45,  radius: 1.05, endRadius: 1.1,  scale: 1.3,  opacity: 1,    blur: 0 },
  { sides: 5, startAngle: -90, radius: 0.88, endRadius: 1.0,  scale: 1.1,  opacity: 0.95, blur: 0 },
  { sides: 6, startAngle: 0,   radius: 0.72, endRadius: 0.95, scale: 0.92, opacity: 0.85, blur: 0.4 },
  { sides: 7, startAngle: -90, radius: 0.56, endRadius: 0.9,  scale: 0.76, opacity: 0.72, blur: 0.8 },
  { sides: 6, startAngle: 30,  radius: 0.4,  endRadius: 0.85, scale: 0.62, opacity: 0.6,  blur: 1.2 },
];

const SLOTS = (() => {
  const slots = [];
  let cursor = 0;
  LAYERS.forEach((layer, layerIndex) => {
    for (let i = 0; i < layer.sides && cursor < images.length; i++) {
      slots.push({ image: images[cursor], index: cursor, layerIndex, vertex: i, layer });
      cursor++;
    }
  });
  return slots;
})();

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* One card. Reads the shared scroll progress and derives its own motion values. */
function Card({ slot, progress, width, height, mobile }) {
  const { image, index, layerIndex, vertex, layer } = slot;

  const cardW = mobile
    ? clamp(width * 0.12, 46, 68)
    : clamp(width * 0.065, 62, 96);
  const cardH = (cardW * 4) / 3;

  const angle =
    ((layer.startAngle + (360 / layer.sides) * vertex) * Math.PI) / 180;

  // Small deterministic jitter so it feels hand-placed
  const jx = (((index * 37) % 11) - 5) * (mobile ? 1.5 : 3);
  const jy = (((index * 53) % 11) - 5) * (mobile ? 1.5 : 3);

  // Starting pile
  const stackX = ((index % 7) - 3) * (mobile ? 1.5 : 3);
  const stackY = ((index % 9) - 4) * (mobile ? 1.5 : 2);
  const stackRot = ((index % 5) - 2) * 3;
  const endRot = (((index * 7) % 7) - 3) * 1.2;

  // Compute everything once per scroll tick, then slice it into motion values
  const state = useTransform(progress, (p) => {
    const scatter = clamp((p - 0.05) / 0.45, 0, 1);
    const delay = layerIndex * 0.07;
    const t = easeOutCubic(
      clamp((scatter - delay) / (1 - delay * (LAYERS.length - 1) * 0.6), 0, 1)
    );
    const drift = easeInOut(clamp((p - 0.5) / 0.35, 0, 1));

    const radius = lerp(layer.radius, layer.endRadius, drift);
    const rawX = Math.cos(angle) * (width / 2) * radius + jx;
    const rawY = Math.sin(angle) * (height / 2) * radius + jy;

    const scale = lerp(0.8, layer.scale * (mobile ? 0.85 : 1), t);

    // Keep every card fully on screen
    const maxX = width / 2 - (cardW * scale) / 2 - 8;
    const maxY = height / 2 - (cardH * scale) / 2 - 8;

    const scatteredOpacity = lerp(1, layer.opacity, t);
    const opacity = lerp(scatteredOpacity, Math.max(layer.opacity, 0.9), drift);

    return {
      x: lerp(stackX, clamp(rawX, -maxX, maxX), t),
      y: lerp(stackY, clamp(rawY, -maxY, maxY), t),
      rotate: lerp(stackRot, endRot, t),
      scale,
      opacity,
      blur: layer.blur * t * (1 - drift),
    };
  });

  const x = useTransform(state, (s) => s.x);
  const y = useTransform(state, (s) => s.y);
  const rotate = useTransform(state, (s) => s.rotate);
  const scale = useTransform(state, (s) => s.scale);
  const opacity = useTransform(state, (s) => s.opacity);
  const filter = useTransform(state, (s) =>
    s.blur > 0.05 ? `blur(${s.blur}px)` : "none"
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        className="rounded-lg border border-white/15 bg-[var(--jpg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] will-change-transform"
        style={{
          width: cardW,
          height: cardH,
          x,
          y,
          rotate,
          scale,
          opacity,
          filter,
          zIndex: 500 + (LAYERS.length - layerIndex) * 10,
        }}
      >
        <img
          src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=300&q=75`}
          alt="Creative photography and visual art"
          loading="lazy"
          draggable="false"
          className="h-full w-full rounded-[7px] object-cover"
        />
      </motion.div>
    </div>
  );
}

export default function VisualStory() {
  const sectionRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const resize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Raw scroll progress through the section, then smoothed with a spring
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  const { width, height } = viewport;
  const mobile = width < 640;

  // Background glow fades out so the end state is pure black
  const glowOpacity = useTransform(progress, [0.55, 0.85], [1, 0]);

  // Black pocket behind the text so the cards never fight it
  const pocketOpacity = useTransform(progress, [0.5, 0.72], [0, 1]);

  // Staggered text reveal
  const eyebrowOpacity = useTransform(progress, [0.56, 0.68], [0, 1]);
  const eyebrowY = useTransform(progress, [0.56, 0.68], [24, 0]);
  const titleOpacity = useTransform(progress, [0.6, 0.74], [0, 1]);
  const titleY = useTransform(progress, [0.6, 0.74], [36, 0]);
  const bodyOpacity = useTransform(progress, [0.66, 0.8], [0, 1]);
  const bodyY = useTransform(progress, [0.66, 0.8], [24, 0]);

  const slots = useMemo(() => SLOTS, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[340vh] bg-[var(--jpg-black)]"
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-[var(--jpg-black)]">
        {/* Soft glow */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(ellipse at center, rgba(249,29,29,0.10), rgba(255,106,0,0.035) 35%, transparent 75%)",
          }}
        />

        {/* Cards stay visible all the way to the end */}
        {slots.map((slot) => (
          <Card
            key={`${slot.image}-${slot.index}`}
            slot={slot}
            progress={progress}
            width={width}
            height={height}
            mobile={mobile}
          />
        ))}

        {/* Black pocket behind the message */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[900]"
          style={{
            opacity: pocketOpacity,
            background:
              "radial-gradient(ellipse 45% 38% at center, rgba(0,0,0,0.92), rgba(0,0,0,0.6) 55%, transparent 100%)",
          }}
        />

        {/* Message */}
        <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <motion.p
              style={{ opacity: eyebrowOpacity, y: eyebrowY }}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--jpg-orange)] sm:text-sm"
            >
              More than an image
            </motion.p>

            <motion.h2
              style={{ opacity: titleOpacity, y: titleY }}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--jpg-cream)] sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Every vision
              <br />
              <span className="text-[var(--jpg-red)]">deserves a place.</span>
            </motion.h2>

            <motion.p
              style={{ opacity: bodyOpacity, y: bodyY }}
              className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[var(--jpg-muted)] sm:text-base"
            >
              A space for artists, photographers and visual thinkers to share
              their perspective and discover what is possible.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}