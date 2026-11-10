
import { FaArrowTrendUp, FaArrowRight, FaChevronDown } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Team", href: "/team" },
  { label: "Art Feed", href: "/art-feed" },
  { label: "Contact", href: "/contact" },
];

const ease = [0.22, 1, 0.36, 1];

const menuVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.45,
      ease,
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 12 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease },
  },
};

export default function Navbar() {
  const reduced = useReducedMotion();
  const buttonRef = useRef(null);
  const desktopMenuButtonRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const { scrollY, scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    setScrolled(latest > 30);
    setHidden(latest > previous && latest > 180 && !menuOpen);
  });

  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const onChange = (e) => {
      if (e.matches) closeMenu();
    };

    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  const active = links.find(
    (link) =>
      link.href === "/"
        ? pathname === "/"
        : pathname.startsWith(link.href)
  )?.href;

  const closeDesktopMenu = () => setDesktopMenuOpen(false);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={reduced ? false : { y: -70, opacity: 0 }}
        animate={{
          y: hidden ? "-130%" : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.55, ease }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10"
      >
        <nav
          aria-label="Main navigation"
          className={`
            relative mx-auto max-w-7xl
            rounded-[20px] border
            transition-all duration-500
            ${
              scrolled || menuOpen
                ? "border-[var(--jpg-cream)]/15 bg-[var(--jpg-black)]/95 shadow-[0_18px_70px_rgba(0,0,0,0.4)]"
                : "border-[var(--jpg-cream)]/10 bg-[var(--jpg-black)]/65"
            }
            backdrop-blur-2xl
          `}
        >
          <div className="flex h-[76px] items-center justify-between px-5 sm:px-7">

            {/* Brand */}
            <Link
              to="/"
              onClick={closeMenu}
              aria-label="thevibe home"
              className="group relative z-10 flex items-center gap-2.5"
            >
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-heading text-[27px] tracking-[-1.5px] text-[var(--jpg-cream)]">
                thevibe
                <span className="text-[var(--jpg-red)] pl-1 transition-colors duration-300 group-hover:text-[var(--jpg-orange)]">
                  .
                </span>
              </span>

            </Link>

            {/* Desktop menu */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setDesktopMenuOpen(true)}
              onMouseLeave={closeDesktopMenu}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  closeDesktopMenu();
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeDesktopMenu();
                  desktopMenuButtonRef.current?.focus();
                }
              }}
            >
              <button
                ref={desktopMenuButtonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={desktopMenuOpen}
                onFocus={() => setDesktopMenuOpen(true)}
                onClick={() => setDesktopMenuOpen(true)}
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2.5
                  text-[12px] font-medium tracking-wide
                  transition-colors duration-300
                  ${
                    active
                      ? "text-[var(--jpg-cream)]"
                      : "text-[var(--jpg-cream)]/65 hover:text-[var(--jpg-cream)]"
                  }
                `}
              >
                Explore
                <FaChevronDown
                  aria-hidden="true"
                  className={`text-[10px] transition-transform duration-300 ${
                    desktopMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {desktopMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease }}
                    className="absolute right-0 top-full z-50 w-64 pt-3"
                  >
                    <div className="rounded-2xl border border-[var(--jpg-cream)]/10 bg-[var(--jpg-black)]/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                      {links.map((link) => {
                        const isActive = active === link.href;

                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={closeDesktopMenu}
                            aria-current={isActive ? "page" : undefined}
                            className={`
                              flex items-center justify-between rounded-xl
                              px-4 py-3 text-sm transition-colors duration-200
                              ${
                                isActive
                                  ? "bg-[var(--jpg-cream)]/[0.07] text-[var(--jpg-cream)]"
                                  : "text-[var(--jpg-cream)]/65 hover:bg-[var(--jpg-cream)]/[0.05] hover:text-[var(--jpg-cream)]"
                              }
                            `}
                          >
                            {link.label}
                            {isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--jpg-red)]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <motion.a
              href="/contact"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="
                group hidden items-center gap-4
                rounded-full border border-[var(--jpg-cream)]/20
                bg-[var(--jpg-cream)]/[0.04]
                py-3 pl-5 pr-3
                text-[11px] font-semibold uppercase tracking-[0.12em]
                text-[var(--jpg-cream)]
                transition-all duration-300
                hover:border-[var(--jpg-red)]/50
                hover:bg-[var(--jpg-red)]/10
                md:flex
              "
            >
              Join the waitlist

              <span className="
                flex h-8 w-8 items-center justify-center
                rounded-full bg-[var(--jpg-red)]
                text-[var(--jpg-black)]
                transition-transform duration-300
                group-hover:rotate-45
              ">
                <FaArrowTrendUp />
              </span>
            </motion.a>

            {/* Mobile toggle */}
            <button
              ref={buttonRef}
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="
                relative z-10 flex h-11 w-11
                flex-col items-center justify-center
                gap-[6px] rounded-full
                border border-[var(--jpg-cream)]/15
                transition-colors duration-300
                hover:border-[var(--jpg-red)]/60
                md:hidden
              "
            >
              <motion.span
                animate={
                  menuOpen
                    ? { y: 3.75, rotate: 45 }
                    : { y: 0, rotate: 0 }
                }
                className="h-[1.5px] w-5 bg-[var(--jpg-cream)]"
              />

              <motion.span
                animate={
                  menuOpen
                    ? { y: -3.75, rotate: -45 }
                    : { y: 0, rotate: 0 }
                }
                className="h-[1.5px] w-5 bg-[var(--jpg-cream)]"
              />
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="mobile-navigation"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="overflow-hidden md:hidden"
              >
                <div className="border-t border-[var(--jpg-cream)]/10 px-5 pb-6 pt-5">

                  <div className="space-y-1">
                    {links.map((link) => (
                      <motion.div
                        key={link.href}
                        variants={itemVariants}
                      >
                        <Link
                          to={link.href}
                          onClick={closeMenu}
                          className="
                            group flex items-center justify-between
                            rounded-xl px-3 py-4
                            transition-colors duration-300
                            hover:bg-[var(--jpg-cream)]/[0.05]
                          "
                        >
                          <span
                            className="
                              text-sm
                              text-[var(--jpg-cream)]/80
                              transition-all duration-300
                              group-hover:translate-x-1
                              group-hover:text-[var(--jpg-cream)]
                            "
                          >
                            {link.label}
                          </span>

                          <FaArrowRight className="
                            text-xs text-[var(--jpg-cream)]/45
                            opacity-0 transition-all duration-300
                            group-hover:translate-x-1
                            group-hover:text-[var(--jpg-cream)]
                            group-hover:opacity-100
                          " />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.a
                    variants={itemVariants}
                    href="/contact"
                    onClick={closeMenu}
                    className="
                      mt-5 flex items-center justify-between
                      rounded-full bg-[image:var(--jpg-gradient)]
                      px-5 py-4
                      text-xs font-semibold uppercase tracking-wider
                      text-[var(--jpg-black)]
                    "
                  >
                    Join the waitlist
                    <FaArrowTrendUp />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll progress */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="
              absolute inset-x-0 bottom-0 h-[2px]
              origin-left rounded-b-[20px] bg-[image:var(--jpg-gradient)]
            "
          />
        </nav>
      </motion.header>
    </>
  );
}
