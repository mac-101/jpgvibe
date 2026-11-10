import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
    FaInstagram,
    FaXTwitter,
    FaLinkedinIn,
    FaBehance,
    FaTiktok,
    FaArrowRight,
    FaXmark,
} from "react-icons/fa6";
import InstagramStrip from "../instagram/InstagramStrip";

const ease = [0.22, 1, 0.36, 1];

const SOCIAL = {
    instagram: { label: "Instagram", Icon: FaInstagram },
    x: { label: "X", Icon: FaXTwitter },
    linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
    behance: { label: "Behance", Icon: FaBehance },
    tiktok: { label: "TikTok", Icon: FaTiktok },
};

const team = [
    {
        id: "adaeze",
        name: "Adaeze Obi",
        role: "Fine Art Director",
        bio: "Shapes the gallery's voice, pairing emerging painters with the stories behind their work.",
        image:
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
        socials: [
            { type: "instagram", handle: "@adaeze.obi", href: "https://instagram.com/adaeze.obi" },
            { type: "x", handle: "@adaezeobi", href: "https://x.com/adaezeobi" },
        ],
    },
    {
        id: "kwame",
        name: "Kwame Mensah",
        role: "Lead Photographer",
        bio: "Documentary photographer chasing light across Accra, Lagos and London for the vibe's editorial features.",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        socials: [
            { type: "instagram", handle: "@kwame.frames", href: "https://instagram.com/kwame.frames" },
            { type: "behance", handle: "kwamemensah", href: "https://behance.net/kwamemensah" },
        ],
    },
    {
        id: "zainab",
        name: "Zainab Bello",
        role: "Head Curator",
        bio: "Builds the exhibitions, from first shortlist to opening night, with an eye for work that lasts.",
        image:
            "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
        socials: [
            { type: "instagram", handle: "@zainab.curates", href: "https://instagram.com/zainab.curates" },
            { type: "linkedin", handle: "/in/zainabbello", href: "https://linkedin.com/in/zainabbello" },
        ],
    },
    {
        id: "tunde",
        name: "Tunde Adebayo",
        role: "Visual Director",
        bio: "Turns ideas into the look of every campaign, show and story we put out.",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        socials: [
            { type: "instagram", handle: "@tunde.visual", href: "https://instagram.com/tunde.visual" },
            { type: "tiktok", handle: "@tunde.visual", href: "https://tiktok.com/@tunde.visual" },
        ],
    },
    {
        id: "folake",
        name: "Folake Martins",
        role: "Creative Producer",
        bio: "Keeps the shoots, shows and collaborations moving, and the artists at the centre of them.",
        image:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        socials: [
            { type: "instagram", handle: "@folake.makes", href: "https://instagram.com/folake.makes" },
            { type: "x", handle: "@folakemartins", href: "https://x.com/folakemartins" },
        ],
    },
    {
        id: "ife",
        name: "Ife Johnson",
        role: "Community Lead",
        bio: "Connects artists across the diaspora and makes sure every voice finds its people.",
        image:
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
        socials: [
            { type: "instagram", handle: "@ife.thevibe", href: "https://instagram.com/ife.thevibe" },
        ],
    },
];

/* Black to near-black, white to warm cream. Referenced from CSS as url(#duotone-cream). */
function DuotoneFilter() {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            width="0"
            height="0"
            style={{ position: "absolute" }}
        >
            <defs>
                <filter id="duotone-cream" colorInterpolationFilters="sRGB">
                    <feColorMatrix
                        type="matrix"
                        values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0      0      0      1 0"
                    />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.04 0.96" />
                        <feFuncG type="table" tableValues="0.03 0.91" />
                        <feFuncB type="table" tableValues="0.03 0.69" />
                    </feComponentTransfer>
                </filter>
            </defs>
        </svg>
    );
}

function TeamCard({ member, index, open, onClose, onToggle, reduced }) {
    // Hover only clears the portrait. It never opens the socials.
    const [hovered, setHovered] = useState(false);
    const clear = open || hovered;

    const firstName = member.name.split(" ")[0];
    const panelId = `socials-${member.id}`;
    const fade = (ms) => (reduced ? "none" : `opacity ${ms}ms ease`);

    return (
        <motion.article
            data-team-card
            initial={reduced ? false : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease, delay: (index % 3) * 0.12 }}
            whileHover={
                reduced
                    ? undefined
                    : { y: -6, transition: { type: "spring", stiffness: 260, damping: 22 } }
            }
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            className="relative h-full"
        >
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-[var(--jpg-surface)] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                {/* Portrait: duotone at rest, original colour on hover or when open */}
                <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-black">
                    <div
                        className="absolute inset-0"
                        style={{
                            transform: clear ? "scale(1.05)" : "scale(1)",
                            transition: reduced
                                ? "none"
                                : "transform 1200ms cubic-bezier(0.22,1,0.36,1)",
                        }}
                    >
                        <img
                            src={member.image}
                            alt={`Portrait of ${member.name}`}
                            loading="lazy"
                            draggable="false"
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{ filter: "url(#duotone-cream) contrast(1.1)" }}
                        />
                        <img
                            src={member.image}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            draggable="false"
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{
                                opacity: clear ? 1 : 0,
                                transition: fade(700),
                                filter: "saturate(1.05) contrast(1.05)",
                            }}
                        />
                    </div>

                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-black"
                        style={{ opacity: clear ? 0.03 : 0.42, transition: fade(700) }}
                    />

                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                            opacity: clear ? 0.4 : 0.75,
                            transition: fade(700),
                            background:
                                "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(249,29,29,0.32), transparent 70%)",
                        }}
                    />

                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--jpg-surface)] to-transparent"
                    />

                    {/* Click or tap the portrait to open or close the socials.
              Keyboard users get the same action from the button below. */}
                    <div
                        aria-hidden="true"
                        onClick={onToggle}
                        className="absolute inset-0 z-10 cursor-pointer"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col px-6 pb-6 pt-2 sm:px-7 sm:pb-7">
                    <h3
                        className="text-2xl leading-tight sm:text-3xl"
                        style={{ color: "var(--jpg-cream)" }}
                    >
                        {member.name}
                    </h3>

                    <p
                        className="mt-3 flex items-center gap-3 font-label"
                        style={{ color: "var(--jpg-cream)", opacity: 0.75 }}
                    >
                        <span
                            aria-hidden="true"
                            className="h-px w-6 shrink-0"
                            style={{ backgroundColor: "var(--jpg-red)" }}
                        />
                        {member.role}
                    </p>

                    {/* Bio area. The black panel slides up over this. */}
                    <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl">
                        <p
                            className="text-base leading-7"
                            style={{ color: "var(--jpg-cream)", opacity: 0.78 }}
                        >
                            {member.bio}
                        </p>

                        <motion.div
                            id={panelId}
                            aria-hidden={!open}
                            initial={false}
                            animate={{ y: open ? "0%" : "101%" }}
                            transition={{ duration: reduced ? 0 : 0.65, ease }}
                            style={{
                                pointerEvents: open ? "auto" : "none",
                                borderColor: "var(--jpg-border)",
                            }}
                            className="absolute inset-0 flex items-center justify-center rounded-2xl border bg-black"
                        >
                            <ul className="flex flex-wrap items-center justify-center gap-3">
                                {member.socials.map((social, i) => {
                                    const { label, Icon } = SOCIAL[social.type];
                                    return (
                                        <motion.li
                                            key={social.type}
                                            initial={false}
                                            animate={{ opacity: open ? 1 : 0, y: open ? 0 : 14 }}
                                            transition={{
                                                duration: reduced ? 0 : 0.5,
                                                ease,
                                                delay: open && !reduced ? 0.22 + i * 0.07 : 0,
                                            }}
                                        >
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                tabIndex={open ? 0 : -1}
                                                title={`${label} ${social.handle}`}
                                                aria-label={`${member.name} on ${label}: ${social.handle}`}
                                                className="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:border-[var(--jpg-red)] hover:bg-[var(--jpg-red)]/10 hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                                                style={{
                                                    color: "var(--jpg-cream)",
                                                    borderColor: "var(--jpg-border)",
                                                    fontSize: "1.2rem",
                                                    letterSpacing: "normal",
                                                }}
                                            >
                                                <Icon aria-hidden="true" />
                                            </a>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    </div>

                    {/* The small CTA that opens and closes the socials */}
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-expanded={open}
                        aria-controls={panelId}
                        className=" inline-flex mt-5 items-center gap-2.5 self-start rounded-full border px-4 py-2.5 font-label transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                        style={{
                            color: "var(--jpg-cream)",
                            borderColor: "var(--jpg-border)",
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {open ? "Close" : `Meet ${firstName}`}
                        {open ? (
                            <FaXmark aria-hidden="true" />
                        ) : (
                            <FaArrowRight aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Red border: strong along the top at rest, full outline when open */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                    opacity: open ? 1 : 0.6,
                    transition: fade(500),
                    padding: 1.5,
                    background:
                        "linear-gradient(180deg, rgba(249,29,29,0.85), rgba(249,29,29,0.14) 45%, rgba(249,29,29,0.06))",
                    WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude",
                }}
            />
        </motion.article>
    );
}

export default function TeamPage() {
    const reduced = useReducedMotion();
    const [openId, setOpenId] = useState(null);

    // Tapping outside the cards closes the open one (touch devices)
    useEffect(() => {
        const onDown = (e) => {
            if (!e.target.closest("[data-team-card]")) setOpenId(null);
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
            <DuotoneFilter />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 35% at 12% 12%, rgba(249,29,29,0.09), transparent 70%), radial-gradient(ellipse 45% 35% at 90% 85%, rgba(249,29,29,0.06), transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease }}
                    className="mb-14 max-w-3xl sm:mb-20"
                >
                    <h1
                        className="text-4xl leading-[1.1] sm:text-5xl md:text-6xl"
                        style={{ color: "var(--jpg-cream)" }}
                    >
                        Meet the
                        <br />
                        <span style={{ color: "var(--jpg-muted)" }}>
                            Curators &amp; Visionaries
                        </span>
                    </h1>

                    <p
                        className="mt-6 max-w-xl text-lg leading-8"
                        style={{ color: "var(--jpg-cream)", opacity: 0.8 }}
                    >
                        The people behind the work, shaping how African and diaspora art is
                        seen, shown and remembered.
                    </p>
                </motion.div>

                <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {team.map((member, index) => (
                        <TeamCard
                            key={member.id}
                            member={member}
                            index={index}
                            reduced={reduced}
                            open={openId === member.id}
                            onClose={() => setOpenId((cur) => (cur === member.id ? null : cur))}
                            onToggle={() =>
                                setOpenId((cur) => (cur === member.id ? null : member.id))
                            }
                        />
                    ))}
                </div>
            </div>
                <InstagramStrip start={8} /> 
        </section>
    );
}