import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaCheck,
  FaChevronDown,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXmark,
  FaXTwitter,
} from "react-icons/fa6";
import { ACCOUNT } from "../instagram/data";

const ease = [0.22, 1, 0.36, 1];

/* ---------- Placeholders: replace with the real details ---------- */
const CONTACT = {
  email: "hello@thevibe.com",
  studios: [
    { city: "Lagos, Nigeria", note: "Visits by appointment" },
    { city: "London, United Kingdom", note: "Visits by appointment" },
  ],
  hours: [
    ["Monday to Friday", "9:00 to 18:00 WAT"],
    ["Saturday", "By appointment"],
    ["Sunday", "Closed"],
  ],
  socials: [
    { label: "Instagram", href: ACCOUNT.profileUrl, Icon: FaInstagram },
    { label: "X", href: "https://x.com/thevibe", Icon: FaXTwitter },
    { label: "TikTok", href: "https://tiktok.com/@thevibe", Icon: FaTiktok },
    { label: "LinkedIn", href: "https://linkedin.com/company/thevibe", Icon: FaLinkedinIn },
  ],
};

const ROLES = ["Fine Artist", "Photographer", "Collector", "Agency"];

// The Services "Inquire Now" buttons link here as /contact?service=<slug>
const SERVICES = {
  "fine-art-curation": "Fine Art Curation & Digital Exhibition Hosting",
  "commercial-photography": "Commercial Photography & Visual Direction",
  "artist-branding": "Artist Branding & Digital Identity Systems",
  "creator-network": "Creator Network & Portfolio Management",
};

/* ---------- Submission. Flip USE_MOCK once your backend exists ---------- */
const USE_MOCK = true;

async function submitInquiry(payload) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 900)); // fake network
    console.log("Inquiry (mock):", payload);
    return { ok: true };
  }
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Contact request failed (${res.status})`);
  return res.json();
}

/* ---------- Validation ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ORDER = ["name", "email", "role", "message"];

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!v.role) errors.role = "Choose the role that fits you best.";
  if (v.message.trim().length < 10)
    errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
}

/* ---------- Field: 1px cream border that turns into a glowing gradient on focus ---------- */
function Field({ id, label, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 block font-label"
        style={{ color: "var(--jpg-cream)", opacity: 0.8 }}
      >
        {label}
      </label>

      <div className="group relative rounded-xl p-px">
        {/* Glow, visible only on focus */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-focus-within:opacity-60 motion-reduce:transition-none"
          style={{ background: "var(--jpg-gradient)" }}
        />
        {/* The 1px border: cream, or red when there's an error */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ background: error ? "var(--jpg-red)" : "var(--jpg-cream)" }}
        />
        {/* Gradient border fades in over it on focus */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 motion-reduce:transition-none"
          style={{ background: "var(--jpg-gradient)" }}
        />
        {children}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm"
          style={{ color: "var(--jpg-red)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "relative z-10 block w-full rounded-[11px] bg-[#000000] px-4 py-3.5 font-body text-lg text-[var(--jpg-cream)] placeholder:text-[var(--jpg-cream)]/40 focus:outline-none";

/* ---------- Left column pieces ---------- */
function InfoBlock({ title, children }) {
  return (
    <div>
      <h2
        className="mb-3 font-label"
        style={{ color: "var(--jpg-cream)", opacity: 0.6 }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ---------- Page ---------- */
export default function ContactPage() {
  const reduced = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const serviceSlug = params.get("service");
  const serviceTitle = SERVICES[serviceSlug] ?? null;

  const [values, setValues] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
    website: "", // honeypot: real people never see or fill this
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const successRef = useRef(null);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    const first = FIELD_ORDER.find((key) => found[key]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    // Bots fill the hidden field. Act as if it worked, send nothing.
    if (values.website) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await submitInquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        message: values.message.trim(),
        service: serviceSlug && serviceTitle ? serviceSlug : null,
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", role: "", message: "", website: "" });
    setErrors({});
    setStatus("idle");
  };

  const firstName = values.name.trim().split(" ")[0];

  return (
    <section
      className="relative overflow-hidden pb-28 pt-32 sm:pb-36 sm:pt-40"
      style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 10% 10%, rgba(249,29,29,0.09), transparent 70%), radial-gradient(ellipse 45% 35% at 92% 85%, rgba(255,106,0,0.07), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid items-start gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* Left: direct communication info */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="lg:sticky lg:top-32"
          >
            <h1 className="text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Get in
              <br />
              <span style={{ color: "var(--jpg-muted)" }}>touch</span>
            </h1>

            <p
              className="mt-6 max-w-md text-lg leading-8"
              style={{ color: "var(--jpg-cream)", opacity: 0.8 }}
            >
              Tell us about your work, your project or the show you have in
              mind. We read every message.
            </p>

            <div className="mt-12 space-y-9">
              <InfoBlock title="Inquiries">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="font-body text-xl normal-case tracking-normal underline decoration-[var(--jpg-red)] decoration-1 underline-offset-8 transition-colors duration-300 hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] sm:text-2xl"
                  style={{ color: "var(--jpg-cream)" }}
                >
                  {CONTACT.email}
                </a>
              </InfoBlock>

              <InfoBlock title="Studios">
                <ul className="space-y-4">
                  {CONTACT.studios.map((studio) => (
                    <li key={studio.city}>
                      <p className="text-lg">{studio.city}</p>
                      <p className="text-base" style={{ opacity: 0.6 }}>
                        {studio.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </InfoBlock>

              <InfoBlock title="Hours">
                <dl className="space-y-1.5 text-lg">
                  {CONTACT.hours.map(([day, time]) => (
                    <div key={day} className="flex flex-wrap gap-x-4">
                      <dt style={{ opacity: 0.7 }}>{day}</dt>
                      <dd>{time}</dd>
                    </div>
                  ))}
                </dl>
              </InfoBlock>

              <InfoBlock title="Follow">
                <ul className="flex flex-wrap gap-3">
                  {CONTACT.socials.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
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
                    </li>
                  ))}
                </ul>
              </InfoBlock>
            </div>
          </motion.div>

          {/* Right: the form */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.12 }}
            className="rounded-3xl border bg-[var(--jpg-surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-10"
            style={{ borderColor: "var(--jpg-border)" }}
          >
            {status === "sent" ? (
              <motion.div
                role="status"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="py-6"
              >
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--jpg-gradient)] text-xl text-[var(--jpg-black)]"
                >
                  <FaCheck />
                </span>

                <h2
                  ref={successRef}
                  tabIndex={-1}
                  className="mt-6 text-3xl outline-none sm:text-4xl"
                >
                  Message sent.
                </h2>

                <p
                  className="mt-4 max-w-md text-lg leading-8"
                  style={{ opacity: 0.8 }}
                >
                  {firstName ? `Thank you, ${firstName}. ` : "Thank you. "}
                  We'll be in touch soon.
                </p>

                <button
                  type="button"
                  onClick={reset}
                  className="font-label mt-8 inline-flex items-center gap-3 rounded-full border px-5 py-3 transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                  style={{
                    color: "var(--jpg-cream)",
                    borderColor: "var(--jpg-border)",
                  }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-7">
                {serviceTitle && (
                  <div
                    className="flex items-start justify-between gap-4 rounded-2xl border p-4"
                    style={{ borderColor: "var(--jpg-border)" }}
                  >
                    <div className="min-w-0">
                      <p
                        className="font-label text-[9px]"
                        style={{ opacity: 0.6 }}
                      >
                        Inquiring about
                      </p>
                      <p className="mt-1.5 text-base leading-6">{serviceTitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setParams({}, { replace: true })}
                      aria-label="Remove selected service"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jpg-cream)]"
                      style={{
                        color: "var(--jpg-cream)",
                        borderColor: "var(--jpg-border)",
                      }}
                    >
                      <FaXmark aria-hidden="true" />
                    </button>
                  </div>
                )}

                <Field id="contact-name" label="Full name" error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={values.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={inputClass}
                  />
                </Field>

                <Field id="contact-email" label="Email address" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={inputClass}
                  />
                </Field>

                <Field id="contact-role" label="Creator role" error={errors.role}>
                  <select
                    id="contact-role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={Boolean(errors.role)}
                    aria-describedby={errors.role ? "contact-role-error" : undefined}
                    className={`${inputClass} cursor-pointer appearance-none pr-12 [color-scheme:dark] ${
                      values.role ? "" : "text-[var(--jpg-cream)]/40"
                    }`}
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    {ROLES.map((role) => (
                      <option
                        key={role}
                        value={role}
                        style={{ backgroundColor: "#000000", color: "#F6E8B1" }}
                      >
                        {role}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 z-20 -translate-y-1/2 text-sm"
                    style={{ color: "var(--jpg-cream)" }}
                  />
                </Field>

                <Field id="contact-message" label="Message" error={errors.message}>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    maxLength={2000}
                    placeholder="Tell us what you have in mind"
                    value={values.message}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${inputClass} resize-y`}
                  />
                </Field>

                {/* Honeypot */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={handleChange}
                  />
                </div>

                {status === "error" && (
                  <p
                    role="alert"
                    className="rounded-2xl border p-4 text-base"
                    style={{
                      borderColor: "var(--jpg-red)",
                      color: "var(--jpg-cream)",
                    }}
                  >
                    Something went wrong sending your message. Please try again,
                    or email us at{" "}
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="font-body normal-case tracking-normal underline"
                      style={{ fontSize: "inherit" }}
                    >
                      {CONTACT.email}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-button inline-flex w-full items-center justify-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-8 py-[18px] text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {status === "sending" ? "Sending..." : "Send message"}
                  {status !== "sending" && <FaArrowRight aria-hidden="true" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}