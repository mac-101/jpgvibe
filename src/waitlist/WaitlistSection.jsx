import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaCheck, FaPlus, FaXmark } from "react-icons/fa6";
import {
  BOOKING_FOR,
  CITIES,
  COUNTRY_GROUPS,
  DISCIPLINE_GROUPS,
  PITCH,
  PRIVACY_PATH,
  submitWaitlist,
} from "./data";
import { Field, SelectBox, TextInput, optionStyle } from "./fields";

const ease = [0.22, 1, 0.36, 1];

const TABS = [
  { id: "artist", label: "Artist waitlist", short: "Artist" },
  { id: "client", label: "Client waitlist", short: "Client" },
];

const MAX_DISCIPLINES = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IG_RE = /^[A-Za-z0-9._]{1,30}$/;
const X_RE = /^[A-Za-z0-9_]{1,15}$/;
const FIELD_ORDER = ["name", "email", "country", "city", "bookingFor", "disciplines", "instagram", "x", "consent"];

const fieldId = (kind, key) =>
  key === "disciplines" ? `${kind}-disciplines-0` : `${kind}-${key}`;

// Accepts "@name", "name" or a profile link, and returns just the handle
const cleanHandle = (value = "") =>
  value
    .trim()
    .replace(/^https?:\/\/(www\.)?(instagram\.com|x\.com|twitter\.com)\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");

const makeForm = (kind) => ({
  values: {
    name: "",
    email: "",
    country: "",
    city: "",
    disciplines: [""],
    consent: false,
    website: "", // honeypot
    ...(kind === "artist" ? { instagram: "", x: "" } : { bookingFor: "" }),
  },
  errors: {},
  status: "idle", // idle | sending | sent | error
});

function validate(kind, v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.country) e.country = "Select your country.";
  if (v.city.trim().length < 2) e.city = "Enter your city.";
  if (!v.disciplines[0])
    e.disciplines = kind === "artist" ? "Choose what you do." : "Choose who you would like to book.";

  if (kind === "artist") {
    const ig = cleanHandle(v.instagram);
    const x = cleanHandle(v.x);
    if (ig && !IG_RE.test(ig)) e.instagram = "Use letters, numbers, dots and underscores only.";
    if (x && !X_RE.test(x)) e.x = "Up to 15 letters, numbers or underscores.";
  } else if (!v.bookingFor) {
    e.bookingFor = "Tell us who you're booking for.";
  }

  if (!v.consent) e.consent = "Please agree to continue.";
  return e;
}

function buildPayload(kind, v) {
  const chosen = v.disciplines.filter(Boolean);
  const base = {
    type: kind,
    name: v.name.trim(),
    email: v.email.trim(),
    country: v.country,
    city: v.city.trim(),
    consent: true,
    consentedAt: new Date().toISOString(),
  };
  return kind === "artist"
    ? { ...base, disciplines: chosen, instagram: cleanHandle(v.instagram) || null, x: cleanHandle(v.x) || null }
    : { ...base, bookingFor: v.bookingFor, whoToBook: chosen };
}

/* ---------- Tabs ---------- */
function Tabs({ active, onChange }) {
  const refs = useRef({});

  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active);
    let next = null;
    if (e.key === "ArrowRight") next = TABS[(i + 1) % TABS.length];
    if (e.key === "ArrowLeft") next = TABS[(i - 1 + TABS.length) % TABS.length];
    if (e.key === "Home") next = TABS[0];
    if (e.key === "End") next = TABS[TABS.length - 1];
    if (next) {
      e.preventDefault();
      onChange(next.id);
      refs.current[next.id]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Choose your waitlist"
      onKeyDown={onKeyDown}
      className="flex w-full gap-1 rounded-full border p-1.5 sm:inline-flex sm:w-auto"
      style={{ borderColor: "var(--jpg-border)", backgroundColor: "rgba(255,255,255,0.03)" }}
    >
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => (refs.current[tab.id] = el)}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={selected ? `panel-${tab.id}` : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className="font-label relative flex-1 whitespace-nowrap rounded-full px-4 py-3 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jpg-cream)] sm:flex-none sm:px-6"
            style={{ color: selected ? "var(--jpg-black)" : "var(--jpg-cream)" }}
          >
            {selected && (
              <motion.span
                layoutId="waitlist-tab"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-[image:var(--jpg-gradient)]"
              />
            )}
            <span className="relative z-10">
              <span className="sm:hidden">{tab.short}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Left column ---------- */
function Pitch({ kind }) {
  const pitch = PITCH[kind];
  return (
    <div className="lg:sticky lg:top-32">
      <h2 className="font-heading leading-[1.05]">
        <span className="block text-6xl text-[var(--jpg-red)] sm:text-7xl md:text-8xl">VibeGig</span>
        <span className="mt-5 block text-3xl text-[var(--jpg-cream)] sm:text-4xl">{pitch.tagline}</span>
      </h2>

      <p className="mt-6 text-xl leading-8" style={{ color: "var(--jpg-cream)", opacity: 0.9 }}>
        {pitch.lead}
      </p>

      <ul className="mt-9 space-y-5">
        {pitch.points.map((point) => (
          <li key={point.lead} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--jpg-red)" }}
            />
            <p className="text-lg leading-8">
              <strong className="font-semibold" style={{ color: "var(--jpg-cream)" }}>
                {point.lead}
              </strong>{" "}
              <span style={{ color: "var(--jpg-cream)", opacity: 0.8 }}>{point.rest}</span>
            </p>
          </li>
        ))}
      </ul>

      <p
        className="mt-9 max-w-md border-t pt-6 text-lg leading-8"
        style={{ borderColor: "var(--jpg-border)", color: "var(--jpg-cream)", opacity: 0.85 }}
      >
        {pitch.closing}
      </p>
    </div>
  );
}

/* ---------- Discipline dropdowns with "add another" ---------- */
function DisciplinePicker({ idPrefix, label, addLabel, values, onChange, error }) {
  const setAt = (i, value) => onChange(values.map((v, idx) => (idx === i ? value : v)));
  const add = () => onChange([...values, ""]);
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  const canAdd = values.length < MAX_DISCIPLINES && values[values.length - 1] !== "";

  return (
    <div className="space-y-3">
      {values.map((value, i) => {
        const id = `${idPrefix}-disciplines-${i}`;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <Field
                id={id}
                label={i === 0 ? label : `${label} ${i + 1}`}
                hideLabel={i > 0}
                error={i === 0 ? error : undefined}
              >
                <SelectBox
                  id={id}
                  value={value}
                  onChange={(e) => setAt(i, e.target.value)}
                  error={i === 0 ? error : undefined}
                >
                  <option value="" disabled style={optionStyle}>
                    Choose one
                  </option>
                  {DISCIPLINE_GROUPS.map((g) => (
                    <optgroup key={g.group} label={g.group} style={optionStyle}>
                      {g.options.map((option) => (
                        <option
                          key={option}
                          value={option}
                          style={optionStyle}
                          disabled={values.includes(option) && value !== option}
                        >
                          {option}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </SelectBox>
              </Field>
            </div>

            {i > 0 && (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
                className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jpg-cream)]"
                style={{ color: "var(--jpg-cream)", borderColor: "var(--jpg-border)" }}
              >
                <FaXmark aria-hidden="true" />
              </button>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={add}
          disabled={!canAdd}
          className="font-label inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--jpg-border)] disabled:hover:text-[var(--jpg-cream)]"
          style={{ color: "var(--jpg-cream)", borderColor: "var(--jpg-border)" }}
        >
          <FaPlus aria-hidden="true" />
          {addLabel}
        </button>
        {values.length >= MAX_DISCIPLINES && (
          <p className="text-sm" style={{ opacity: 0.6 }}>
            You can add up to {MAX_DISCIPLINES}.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- The form card (artist or client) ---------- */
function WaitlistForm({ kind, state, update }) {
  const { values, errors, status } = state;
  const pitch = PITCH[kind];
  const isArtist = kind === "artist";
  const successRef = useRef(null);
  const cityListId = `${kind}-cities`;

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const setValue = (name, value) =>
    update((s) => ({
      ...s,
      values: { ...s.values, [name]: value },
      errors: { ...s.errors, [name]: undefined },
    }));

  const onText = (e) => setValue(e.target.name, e.target.value);

  // Changing country clears a city that was only a suggestion for the old country
  const onCountry = (e) =>
    update((s) => {
      const oldCities = CITIES[s.values.country] ?? [];
      return {
        ...s,
        values: {
          ...s.values,
          country: e.target.value,
          city: oldCities.includes(s.values.city) ? "" : s.values.city,
        },
        errors: { ...s.errors, country: undefined },
      };
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(kind, values);
    update((s) => ({ ...s, errors: found }));
    const first = FIELD_ORDER.find((key) => found[key]);
    if (first) {
      document.getElementById(fieldId(kind, first))?.focus();
      return;
    }

    // Bots fill the hidden field. Act as if it worked, send nothing.
    if (values.website) {
      update((s) => ({ ...s, status: "sent" }));
      return;
    }

    update((s) => ({ ...s, status: "sending" }));
    try {
      await submitWaitlist(buildPayload(kind, values));
      update((s) => ({ ...s, status: "sent" }));
    } catch {
      update((s) => ({ ...s, status: "error" }));
    }
  };

  const firstName = values.name.trim().split(" ")[0];

  return (
    <div
      className="rounded-3xl border bg-[var(--jpg-surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-10"
      style={{ borderColor: "var(--jpg-border)" }}
    >
      {status === "sent" ? (
        <div role="status" className="py-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--jpg-gradient)] text-xl text-[var(--jpg-black)]"
          >
            <FaCheck />
          </span>
          <h3 ref={successRef} tabIndex={-1} className="mt-6 text-3xl outline-none sm:text-4xl">
            You're on the list.
          </h3>
          <p className="mt-4 max-w-md text-lg leading-8" style={{ opacity: 0.8 }}>
            {firstName ? `Thank you, ${firstName}. ` : "Thank you. "}
            {pitch.success}
          </p>
          <button
            type="button"
            onClick={() => update(() => makeForm(kind))}
            className="font-label mt-8 inline-flex items-center rounded-full border px-5 py-3 transition-colors duration-300 hover:border-[var(--jpg-red)] hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
            style={{ color: "var(--jpg-cream)", borderColor: "var(--jpg-border)" }}
          >
            Sign up another person
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-7">
          <h3 className="text-2xl sm:text-3xl">{pitch.formTitle}</h3>

          <Field id={`${kind}-name`} label="Full name" error={errors.name}>
            <TextInput
              id={`${kind}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={values.name}
              onChange={onText}
              error={errors.name}
            />
          </Field>

          <Field id={`${kind}-email`} label="Email address" error={errors.email}>
            <TextInput
              id={`${kind}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={onText}
              error={errors.email}
            />
          </Field>

          <div className="grid gap-7 sm:grid-cols-2">
            <Field id={`${kind}-country`} label="Country" error={errors.country}>
              <SelectBox
                id={`${kind}-country`}
                value={values.country}
                onChange={onCountry}
                error={errors.country}
              >
                <option value="" disabled style={optionStyle}>
                  Select country
                </option>
                {COUNTRY_GROUPS.map((g) => (
                  <optgroup key={g.group} label={g.group} style={optionStyle}>
                    {g.options.map((country) => (
                      <option key={country} value={country} style={optionStyle}>
                        {country}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectBox>
            </Field>

            {/* Pick a suggestion or type any city */}
            <Field id={`${kind}-city`} label="City" error={errors.city}>
              <TextInput
                id={`${kind}-city`}
                name="city"
                type="text"
                list={cityListId}
                autoComplete="off"
                placeholder="Type or choose your city"
                value={values.city}
                onChange={onText}
                error={errors.city}
              />
              <datalist id={cityListId}>
                {(CITIES[values.country] ?? []).map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </Field>
          </div>

          {!isArtist && (
            <Field id={`${kind}-bookingFor`} label="I'm booking for" error={errors.bookingFor}>
              <SelectBox
                id={`${kind}-bookingFor`}
                value={values.bookingFor}
                onChange={(e) => setValue("bookingFor", e.target.value)}
                error={errors.bookingFor}
              >
                <option value="" disabled style={optionStyle}>
                  Choose one
                </option>
                {BOOKING_FOR.map((option) => (
                  <option key={option} value={option} style={optionStyle}>
                    {option}
                  </option>
                ))}
              </SelectBox>
            </Field>
          )}

          <DisciplinePicker
            idPrefix={kind}
            label={isArtist ? "What do you do" : "Who would you like to book"}
            addLabel={isArtist ? "Add another discipline" : "Add another creative"}
            values={values.disciplines}
            onChange={(next) => setValue("disciplines", next)}
            error={errors.disciplines}
          />

          {isArtist && (
            <div className="grid gap-7 sm:grid-cols-2">
              {[
                { key: "instagram", label: "Instagram (optional)" },
                { key: "x", label: "X / Twitter (optional)" },
              ].map(({ key, label }) => (
                <Field key={key} id={`${kind}-${key}`} label={label} error={errors[key]}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-lg"
                    style={{ color: "var(--jpg-cream)", opacity: 0.5 }}
                  >
                    @
                  </span>
                  <TextInput
                    id={`${kind}-${key}`}
                    name={key}
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="yourhandle"
                    className="pl-9"
                    value={values[key]}
                    onChange={onText}
                    error={errors[key]}
                  />
                </Field>
              ))}
            </div>
          )}

          {/* Consent */}
          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id={`${kind}-consent`}
                type="checkbox"
                checked={values.consent}
                onChange={(e) => setValue("consent", e.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? `${kind}-consent-error` : undefined}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] text-[var(--jpg-black)] peer-checked:border-[var(--jpg-red)] peer-checked:bg-[var(--jpg-red)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--jpg-cream)] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                style={{ borderColor: errors.consent ? "var(--jpg-red)" : "var(--jpg-cream)" }}
              >
                <FaCheck />
              </span>
              <span className="text-base leading-6" style={{ opacity: 0.85 }}>
                I agree to the{" "}
                <Link
                  to={PRIVACY_PATH}
                  onClick={(e) => e.stopPropagation()}
                  className="font-body normal-case tracking-normal underline decoration-[var(--jpg-red)] underline-offset-4 hover:text-[var(--jpg-red)]"
                  style={{ fontSize: "inherit", color: "var(--jpg-cream)" }}
                >
                  privacy policy
                </Link>{" "}
                and to be contacted about early access.
              </span>
            </label>
            {errors.consent && (
              <p id={`${kind}-consent-error`} className="mt-2 text-sm" style={{ color: "var(--jpg-red)" }}>
                {errors.consent}
              </p>
            )}
          </div>

          {/* Honeypot */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${kind}-website`}>Website</label>
            <input
              id={`${kind}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={onText}
            />
          </div>

          {status === "error" && (
            <p
              role="alert"
              className="rounded-2xl border p-4 text-base"
              style={{ borderColor: "var(--jpg-red)", color: "var(--jpg-cream)" }}
            >
              Something went wrong. Please try again in a moment.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="font-button inline-flex w-full items-center justify-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-8 py-[18px] text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
          >
            {status === "sending" ? "Joining..." : pitch.submit}
            {status !== "sending" && <FaArrowRight aria-hidden="true" />}
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------- The section ---------- */
export default function WaitlistSection() {
  const reduced = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "client" ? "client" : "artist"; // artist is the default

  // Each tab keeps its own answers, so switching back doesn't lose anything
  const [forms, setForms] = useState(() => ({
    artist: makeForm("artist"),
    client: makeForm("client"),
  }));
  const updateFor = (kind) => (fn) =>
    setForms((f) => ({ ...f, [kind]: fn(f[kind]) }));

  const setTab = (id) => setParams(id === "artist" ? {} : { tab: id }, { replace: true });

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden pb-28 pt-32 sm:pb-36 sm:pt-40"
      style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 10% 12%, rgba(249,29,29,0.11), transparent 70%), radial-gradient(ellipse 45% 35% at 92% 85%, rgba(255,106,0,0.07), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <Tabs active={tab} onChange={setTab} />
        </motion.div>

        {/* The copy and the form both swap when the tab changes */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: reduced ? 0 : 0.45, ease }}
            className="mt-12 grid items-start gap-14 lg:mt-16 lg:grid-cols-[5fr_7fr] lg:gap-20"
          >
            <Pitch kind={tab} />
            <WaitlistForm kind={tab} state={forms[tab]} update={updateFor(tab)} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
    }
