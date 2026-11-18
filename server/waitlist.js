import { neon } from "@neondatabase/serverless";
// Single source of truth for the lists the form shows (the server never trusts the browser)
import {
  BOOKING_FOR,
  COUNTRY_GROUPS,
  DISCIPLINE_GROUPS,
} from "../src/waitlist/data.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IG_RE = /^[A-Za-z0-9._]{1,30}$/;
const X_RE = /^[A-Za-z0-9_]{1,15}$/;
const MAX_DISCIPLINES = 5;

const COUNTRIES = new Set(COUNTRY_GROUPS.flatMap((g) => g.options));
const DISCIPLINES = new Set(DISCIPLINE_GROUPS.flatMap((g) => g.options));
const BOOKING = new Set(BOOKING_FOR);

const fail = (error) => ({ status: 400, body: { error } });

function parseBody(body) {
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}

// Empty is fine. Otherwise accepts a handle with or without a leading @.
function parseHandle(value, pattern) {
  if (value == null || value === "") return { valid: true, value: null };
  if (typeof value !== "string") return { valid: false, value: null };
  const handle = value.trim().replace(/^@/, "");
  if (!handle) return { valid: true, value: null };
  return pattern.test(handle)
    ? { valid: true, value: handle }
    : { valid: false, value: null };
}

function parseDisciplines(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_DISCIPLINES) {
    return null;
  }
  const unique = [...new Set(value)];
  return unique.length === value.length && unique.every((v) => DISCIPLINES.has(v))
    ? unique
    : null;
}

export async function submitWaitlist({ body, databaseUrl }) {
  const data = parseBody(body);
  if (!data) return fail("Invalid request.");

  // Honeypot: bots fill it, people never see it. Pretend it worked.
  if (typeof data.website === "string" && data.website.trim()) {
    return { status: 200, body: { ok: true } };
  }

  const type = data.type;
  if (type !== "artist" && type !== "client") return fail("Invalid waitlist type.");

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const country = typeof data.country === "string" ? data.country : "";
  const city =
    typeof data.city === "string"
      ? data.city.replace(/\s+/g, " ").trim()
      : "";

  if (name.length < 2 || name.length > 120) {
    return fail("Enter a name between 2 and 120 characters.");
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return fail("Enter a valid email address.");
  }
  if (!COUNTRIES.has(country)) return fail("Choose a valid country.");
  if (city.length < 2 || city.length > 100 || /[\u0000-\u001f\u007f]/.test(city)) {
    return fail("Enter a valid city.");
  }

  // Artists send `disciplines`. Clients send `whoToBook`.
  const disciplines = parseDisciplines(
    type === "artist" ? data.disciplines : data.whoToBook
  );
  if (!disciplines) {
    return fail(
      type === "artist"
        ? "Choose what you do."
        : "Choose who you would like to book."
    );
  }

  let bookingFor = null;
  let instagram = null;
  let xHandle = null;

  if (type === "client") {
    if (!BOOKING.has(data.bookingFor)) return fail("Tell us who you're booking for.");
    bookingFor = data.bookingFor;
  } else {
    const ig = parseHandle(data.instagram, IG_RE);
    const x = parseHandle(data.x, X_RE);
    if (!ig.valid) return fail("Enter a valid Instagram handle.");
    if (!x.valid) return fail("Enter a valid X handle.");
    instagram = ig.value;
    xHandle = x.value;
  }

  if (data.consent !== true) return fail("Please agree to the privacy policy.");

  if (!databaseUrl) {
    console.error("Waitlist database is not configured.");
    return {
      status: 500,
      body: { error: "Waitlist signup is temporarily unavailable." },
    };
  }

  try {
    const sql = neon(databaseUrl);
    // consented_at and created_at use the database clock, never the browser's
    await sql`
      INSERT INTO waitlist_signups
        (type, name, email, country, city, disciplines, booking_for, instagram, x_handle)
      VALUES
        (${type}, ${name}, ${email}, ${country}, ${city}, ${disciplines}::text[],
         ${bookingFor}, ${instagram}, ${xHandle})
      ON CONFLICT (type, email) DO NOTHING
    `;
  } catch (error) {
    console.error("Waitlist submission failed.", error?.code ?? "database_error");
    return {
      status: 500,
      body: { error: "Unable to save your signup right now. Please try again." },
    };
  }

  return { status: 200, body: { ok: true } };
  }
