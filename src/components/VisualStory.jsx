
import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";

import LiveLight from "./LiveLight";
import { useInstagram } from "../feed/InstagramContext";

// Adjust this import path if VisualStory.jsx is in a different folder.
// Use the same import path as InstagramStrip.jsx.

// Polygon rings. Index 0 = closest to the viewer.
const LAYERS = [
  {
    sides: 4,
    startAngle: 45,
    radius: 1.05,
    endRadius: 1.1,
    scale: 1.3,
    opacity: 1,
    blur: 0,
  },
  {
    sides: 5,
    startAngle: -90,
    radius: 0.88,
    endRadius: 1.0,
    scale: 1.1,
    opacity: 0.95,
    blur: 0,
  },
  {
    sides: 6,
    startAngle: 0,
    radius: 0.72,
    endRadius: 0.95,
    scale: 0.92,
    opacity: 0.85,
    blur: 0.4,
  },
  {
    sides: 7,
    startAngle: -90,
    radius: 0.56,
    endRadius: 0.9,
    scale: 0.76,
    opacity: 0.72,
    blur: 0.8,
  },
  {
    sides: 6,
    startAngle: 30,
    radius: 0.4,
    endRadius: 0.85,
    scale: 0.62,
    opacity: 0.6,
    blur: 1.2,
  },
];

const MAX_CARDS = LAYERS.reduce(
  (total, layer) => total + layer.sides,
  0
);

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const easeInOut = (t) =>
  t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * Converts real feed posts into visual cards.
 * Each card retains its original post index so the
 * existing lightbox can open the correct post.
 */
function buildSlots(posts) {
  const visualItems = [];

  posts.forEach((post, postIndex) => {
    if (!Array.isArray(post.media)) return;

    post.media.forEach((media, mediaIndex) => {
      const image =
        media.thumb ||
        (media.type === "image" ? media.url : null);

      if (!image) return;

      visualItems.push({
        image,
        post,
        postIndex,
        mediaIndex,
      });
    });
  });

  const slots = [];
  let cursor = 0;

  LAYERS.forEach((layer, layerIndex) => {
    for (
      let vertex = 0;
      vertex < layer.sides && cursor < visualItems.length;
      vertex++
    ) {
      const item = visualItems[cursor];

      slots.push({
        ...item,
        index: cursor,
        layerIndex,
        vertex,
        layer,
      });

      cursor++;
    }
  });

  return slots.slice(0, MAX_CARDS);
}

/* Individual animated feed card */
function Card({
  slot,
  progress,
  width,
  height,
  mobile,
  mouse,
  onOpen,
}) {
  const {
    image,
    post,
    postIndex,
    index,
    layerIndex,
    vertex,
    layer,
  } = slot;

  const cardW = mobile
    ? clamp(width * 0.12, 46, 68)
    : clamp(width * 0.065, 62, 96);

  const cardH = (cardW * 4) / 3;

  const angle =
    ((layer.startAngle +
      (360 / layer.sides) * vertex) *
      Math.PI) /
    180;

  // Deterministic placement variation
  const jx =
    (((index * 37) % 11) - 5) *
    (mobile ? 1.5 : 3);

  const jy =
    (((index * 53) % 11) - 5) *
    (mobile ? 1.5 : 3);

  // Starting pile
  const stackX =
    ((index % 7) - 3) * (mobile ? 1.5 : 3);

  const stackY =
    ((index % 9) - 4) * (mobile ? 1.5 : 2);

  const stackRot = ((index % 5) - 2) * 3;

  const endRot = (((index * 7) % 7) - 3) * 1.2;

  const state = useTransform(progress, (p) => {
    const scatter = clamp((p - 0.05) / 0.45, 0, 1);

    const delay = layerIndex * 0.07;

    const t = easeOutCubic(
      clamp(
        (scatter - delay) /
          (1 - delay * (LAYERS.length - 1) * 0.6),
        0,
        1
      )
    );

    const drift = easeInOut(
      clamp((p - 0.5) / 0.35, 0, 1)
    );

    const radius = lerp(
      layer.radius,
      layer.endRadius,
      drift
    );

    const rawX =
      Math.cos(angle) * (width / 2) * radius + jx;

    const rawY =
      Math.sin(angle) * (height / 2) * radius + jy;

    const scale = lerp(
      0.8,
      layer.scale * (mobile ? 0.85 : 1),
      t
    );

    const maxX =
      width / 2 - (cardW * scale) / 2 - 8;

    const maxY =
      height / 2 - (cardH * scale) / 2 - 8;

    const scatteredOpacity = lerp(
      1,
      layer.opacity,
      t
    );

    const opacity = lerp(
      scatteredOpacity,
      Math.max(layer.opacity, 0.9),
      drift
    );

    return {
      x: lerp(
        stackX,
        clamp(rawX, -maxX, maxX),
        t
      ),
      y: lerp(
        stackY,
        clamp(rawY, -maxY, maxY),
        t
      ),
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

  // Mouse repulsion
  const repelX = useTransform(
    [mouse.x, x],
    ([mouseX, cardX]) => {
      if (mobile || mouseX == null) return 0;

      const screenX = width / 2 + cardX;
      const distance = screenX - mouseX;
      const range = 180;

      if (Math.abs(distance) >= range) return 0;

      return (
        Math.sign(distance || 1) *
        Math.pow(1 - Math.abs(distance) / range, 2) *
        55
      );
    }
  );

  const repelY = useTransform(
    [mouse.y, y],
    ([mouseY, cardY]) => {
      if (mobile || mouseY == null) return 0;

      const screenY = height / 2 + cardY;
      const distance = screenY - mouseY;
      const range = 180;

      if (Math.abs(distance) >= range) return 0;

      return (
        Math.sign(distance || 1) *
        Math.pow(1 - Math.abs(distance) / range, 2) *
        40
      );
    }
  );

  const smoothRepelX = useSpring(repelX, {
    stiffness: 180,
    damping: 22,
    mass: 0.45,
  });

  const smoothRepelY = useSpring(repelY, {
    stiffness: 180,
    damping: 22,
    mass: 0.45,
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.button
        type="button"
        aria-label={`Open post: ${post.text?.slice(0, 80) || "View artwork"}`}
        onClick={() => onOpen(postIndex)}
        className="pointer-events-auto cursor-pointer overflow-hidden rounded-lg border border-white/15 bg-[var(--jpg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
        style={{
          width: cardW,
          height: cardH,
          x: useTransform(
            [x, smoothRepelX],
            ([base, repel]) => base + repel
          ),
          y: useTransform(
            [y, smoothRepelY],
            ([base, repel]) => base + repel
          ),
          rotate,
          scale,
          opacity,
          filter,
          zIndex: 500 + (LAYERS.length - layerIndex) * 10,
        }}
      >
        <img
          src={image}
          alt={post.text || "Creative work from the JPGVibe community"}
          loading="lazy"
          draggable="false"
          className="h-full w-full rounded-[7px] object-cover"
        />
      </motion.button>
    </div>
  );
}

export default function VisualStory() {
  const sectionRef = useRef(null);

  const [viewport, setViewport] = useState({
    width: 1200,
    height: 800,
  });

  // Real Instagram and X feed data
  const { posts, status, openLightbox } = useInstagram();

  useEffect(() => {
    const resize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    resize();

    window.addEventListener("resize", resize);

    return () =>
      window.removeEventListener("resize", resize);
  }, []);

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  // Stable mouse motion values
  const mouseX = useMotionValue(null);
  const mouseY = useMotionValue(null);

  const mouse = {
    x: mouseX,
    y: mouseY,
  };

  const handleMouseMove = (event) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  const handleMouseLeave = () => {
    mouseX.set(null);
    mouseY.set(null);
  };

  const { width, height } = viewport;

  const mobile = width < 640;

  // Build cards whenever the feed changes
  const slots = useMemo(
    () => buildSlots(posts || []),
    [posts]
  );

  // Background glow
  const glowOpacity = useTransform(
    progress,
    [0.55, 0.85],
    [1, 0]
  );

  // Black pocket behind text
  const pocketOpacity = useTransform(
    progress,
    [0.5, 0.72],
    [0, 1]
  );

  // Staggered text reveal
  const eyebrowOpacity = useTransform(
    progress,
    [0.56, 0.68],
    [0, 1]
  );

  const eyebrowY = useTransform(
    progress,
    [0.56, 0.68],
    [24, 0]
  );

  const titleOpacity = useTransform(
    progress,
    [0.6, 0.74],
    [0, 1]
  );

  const titleY = useTransform(
    progress,
    [0.6, 0.74],
    [36, 0]
  );

  const bodyOpacity = useTransform(
    progress,
    [0.66, 0.8],
    [0, 1]
  );

  const bodyY = useTransform(
    progress,
    [0.66, 0.8],
    [24, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[340vh] bg-[var(--jpg-black)]"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-[var(--jpg-black)]"
      >
        {/* Soft background glow */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(ellipse at center, rgba(249,29,29,0.10), rgba(255,106,0,0.035) 35%, transparent 75%)",
          }}
        />

        {/* Real community artwork */}
        {slots.map((slot) => (
          <Card
            key={`${slot.post.id}-${slot.mediaIndex}`}
            slot={slot}
            progress={progress}
            width={width}
            height={height}
            mobile={mobile}
            mouse={mouse}
            onOpen={openLightbox}
          />
        ))}

        {/* Loading state */}
        {status === "loading" && slots.length === 0 && (
          <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--jpg-red)]" />
          </div>
        )}

        {/* Empty feed state */}
        {status === "ready" && slots.length === 0 && (
          <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center px-6 text-center">
            <p className="text-sm text-[var(--jpg-muted)]">
              Community artwork will appear here.
            </p>
          </div>
        )}

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
              style={{
                opacity: eyebrowOpacity,
                y: eyebrowY,
              }}
              className="mb-5 flex items-center justify-center gap-3 font-label text-[var(--jpg-cream)]"
            >
              <LiveLight />
              Live from the vibe
            </motion.p>

            <motion.h2
              style={{
                opacity: titleOpacity,
                y: titleY,
              }}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--jpg-cream)] sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Every vision
              <br />
              <span className="text-[var(--jpg-red)]">
                deserves a place.
              </span>
            </motion.h2>

            <motion.p
              style={{
                opacity: bodyOpacity,
                y: bodyY,
              }}
              className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[var(--jpg-muted)] sm:text-base"
            >
              Fresh from our community of black artists worldwide.
              <br />
              Tap any work to meet the creative.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
