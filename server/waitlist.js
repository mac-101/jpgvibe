import { neon } from "@neondatabase/serverless";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISCIPLINES = new Set([
  "visual-arts",
  "photography",
  "film",
  "design",
  "other",
]);

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

function parsePortfolioUrl(value) {
  if (value == null || value === "") return { valid: true, value: null };
  if (typeof value !== "string" || value.length > 2048) {
    return { valid: false, value: null };
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { valid: false, value: null };
    }
    return { valid: true, value: url.href };
  } catch {
    return { valid: false, value: null };
  }
}

export async function submitWaitlist({ body, databaseUrl }) {
  const parsedBody = parseBody(body);
  if (!parsedBody) {
    return { status: 400, body: { error: "Invalid request." } };
  }

  if (typeof parsedBody.website === "string" && parsedBody.website.trim()) {
    return { status: 200, body: { ok: true } };
  }

  const name = typeof parsedBody.name === "string" ? parsedBody.name.trim() : "";
  const email =
    typeof parsedBody.email === "string"
      ? parsedBody.email.trim().toLowerCase()
      : "";
  const discipline =
    typeof parsedBody.discipline === "string" ? parsedBody.discipline : "";
  const portfolio = parsePortfolioUrl(parsedBody.portfolio);

  if (name.length < 2 || name.length > 120) {
    return {
      status: 400,
      body: { error: "Enter a name between 2 and 120 characters." },
    };
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: 400, body: { error: "Enter a valid email address." } };
  }
  if (!DISCIPLINES.has(discipline)) {
    return {
      status: 400,
      body: { error: "Choose a valid creative discipline." },
    };
  }
  if (!portfolio.valid) {
    return {
      status: 400,
      body: { error: "Enter a valid portfolio or social URL." },
    };
  }

  if (!databaseUrl) {
    console.error("Waitlist database is not configured.");
    return {
      status: 500,
      body: { error: "Waitlist signup is temporarily unavailable." },
    };
  }

  try {
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO artist_waitlist (name, email, discipline, portfolio_url)
      VALUES (${name}, ${email}, ${discipline}, ${portfolio.value})
      ON CONFLICT (email) DO NOTHING
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
