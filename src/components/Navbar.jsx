import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const links = [
  { label: "Explore", href: "#explore" },
  { label: "Artists", href: "#artists" },
  { label: "Services", href: "#services" },
  { label: "Journal", href: "#journal" },
];

const ease = [0.22, 1, 0.36, 1];

const menuVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.3, ease } },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.4,
      ease,
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const menuItem = {
  closed: { opacity: 0, x: -14 },
  open: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

export default function Navbar() {
  const reduced = useReducedMotion();
  const buttonRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  const closeMenu = () => setMenuOpen(false);

  // Page scroll progress shown as a thin bar along the bottom of the nav
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    setHidden(latest > previous && latest > 140 && !menuOpen);
  });

  // Highlight the link for the section currently in view
  useEffect(() => {
    const targets = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes the menu and returns focus to the button
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Close the menu if the screen grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const highlighted = hovered ?? active;

  return (
    <>
      {/* Backdrop behind the mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: reduced ? 0 : -90, opacity: 0 }}
        animate={{ y: hidden ? "-130%" : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10"
      >
        <nav
          aria-label="Main navigation"
          className={`relative mx-auto max-w-7xl overflow-hidden rounded-2xl border px-5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:px-7 ${
            scrolled || menuOpen
              ? "border-[var(--jpg-cream)]/[0.16] bg-[var(--jpg-black)]/80 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              : "border-[var(--jpg-cream)]/[0.08] bg-[var(--jpg-black)]/30"
          }`}
        >
          <div className="flex h-[76px] items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              onClick={closeMenu}
              aria-label="jpgvibe home"
              className="group relative text-2xl font-extrabold tracking-[-0.075em] text-[var(--jpg-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
            >
              jpgvibe
              <span className="text-[var(--jpg-red)] transition-colors duration-300 group-hover:text-[var(--jpg-orange)]">
                .
              </span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[image:var(--jpg-gradient)] transition-all duration-500 ease-out group-hover:w-full" />
            </a>

            {/* Desktop navigation: one pill slides between links */}
            <div
              className="relative isolate hidden items-center gap-1 md:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {links.map((link) => {
                const isHighlighted = highlighted === link.href;
                const isActive = active === link.href;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--jpg-cream)] ${
                      isHighlighted
                        ? "text-[var(--jpg-cream)]"
                        : "text-[var(--jpg-cream)]/60"
                    }`}
                  >
                    {isHighlighted && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full bg-[var(--jpg-cream)]/[0.07]"
                      />
                    )}
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--jpg-red)]"
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <motion.a
              href="#explore"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group hidden items-center gap-3 rounded-full border border-[var(--jpg-cream)]/20 px-5 py-3 text-sm font-medium text-[var(--jpg-cream)] transition-colors duration-300 hover:border-[var(--jpg-red)]/70 hover:bg-[var(--jpg-red)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] md:inline-flex"
            >
              Join the collective
              <span
                aria-hidden="true"
                className="inline-block text-[var(--jpg-red)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                ↗
              </span>
            </motion.a>

            {/* Mobile menu button */}
            <button
              ref={buttonRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full border border-[var(--jpg-cream)]/15 transition-colors duration-300 hover:border-[var(--jpg-red)]/70 hover:bg-[var(--jpg-red)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jpg-cream)] md:hidden"
            >
              <motion.span
                animate={menuOpen ? { y: 3.75, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease }}
                className="h-[1.5px] w-5 rounded-full bg-[var(--jpg-cream)]"
              />
              <motion.span
                animate={menuOpen ? { y: -3.75, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease }}
                className="h-[1.5px] w-5 rounded-full bg-[var(--jpg-cream)]"
              />
            </button>
          </div>

          {/* Mobile navigation: only mounted while open, so hidden links can't be tabbed to */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="mobile-navigation"
                key="menu"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="overflow-hidden md:hidden"
              >
                <div className="border-t border-[var(--jpg-cream)]/10 pb-5 pt-3">
                  {links.map((link, index) => (
                    <motion.a
                      key={link.label}
                      variants={menuItem}
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-center justify-between rounded-xl px-3 py-3.5 text-base text-[var(--jpg-cream)]/75 transition-[background-color,color,padding] duration-300 hover:bg-[var(--jpg-cream)]/[0.05] hover:pl-5 hover:text-[var(--jpg-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--jpg-cream)]"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          aria-hidden="true"
                          className="text-[10px] tracking-[0.2em] text-[var(--jpg-red)]"
                        >
                          0{index + 1}
                        </span>
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[var(--jpg-red)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </motion.a>
                  ))}

                  <motion.a
                    variants={menuItem}
                    href="#explore"
                    onClick={closeMenu}
                    className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[image:var(--jpg-gradient)] px-5 py-3.5 text-sm font-bold text-[var(--jpg-black)] transition-transform duration-300 active:scale-[0.98]"
                  >
                    Join the collective <span aria-hidden="true">↗</span>
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll progress */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[image:var(--jpg-gradient)]"
          />
        </nav>
      </motion.header>
    </>
  );
}