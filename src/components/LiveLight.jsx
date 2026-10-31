import { motion, useReducedMotion } from "framer-motion";

export default function LiveLight({ className = "" }) {
  const reduced = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-3 w-3 shrink-0 ${className}`}
    >
      {/* Ring that pulses outward */}
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full bg-[var(--jpg-red)]"
          animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* The light itself: on, quick dim, on, like a camera's record light */}
      <motion.span
        className="relative h-3 w-3 rounded-full bg-[var(--jpg-red)] shadow-[0_0_12px_3px_rgba(249,29,29,0.7)]"
        animate={reduced ? undefined : { opacity: [1, 1, 0.15, 0.15, 1] }}
        transition={{
          duration: 1.6,
          times: [0, 0.45, 0.55, 0.9, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}