const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// What the dropdown on the Contact page sends in `service`
const INQUIRY_TYPES = {
  general: "General",
  artist: "Artist",
  "brand-partnership": "Brand and partnership",
  press: "Press",
};

// Optional: which service page the visitor came from (sent as `interest`)
const SERVICES = {
  "fine-art-curation": "Fine Art Curation & Digital Exhibition Hosting",
  "commercial-photography": "Commercial Photography & Visual Direction",
  "artist-branding": "Artist Branding & Digital Identity Systems",
  "creator-network": "Creator Network & Portfolio Management",
  "creative-direction": "Creative Direction",
};

const lookup = (map, key) =>
  typeof key === "string" && Object.hasOwn(map, key) ? map[key] : null;

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const fail = (status, error) => {
  console.error("Contact rejected:", status, error);
  return { status, body: { error } };
};

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

// Everything a visitor types is escaped before it goes into an email
const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const withBreaks = (s) => escapeHtml(s).replace(/\r?\n/g, "<br>");

// Phone-pasted settings often carry stray spaces or quotes. Strip them.
const clean = (value) =>
  String(value ?? "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();

async function sendEmail(apiKey, payload) {
  let response;
  try {
    response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Could not reach Brevo:", err.cause?.code ?? err.message);
    return false;
  }

  if (!response.ok) {
    let detail = "";
    try {
      const json = await response.json();
      detail = json?.message ?? json?.code ?? "";
    } catch {
      // ignore
    }
    console.error("Brevo request failed", response.status, detail);
    return false;
  }
  return true;
}

const row = (label, value) =>
  `<tr><td style="padding:6px 16px 6px 0;color:#777;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`;

export async function submitContact({ body, env }) {
  const data = parseBody(body);
  if (!data) return fail(400, "Invalid request.");

  // Honeypot: bots fill it, people never see it. Pretend it worked.
  if (typeof data.website === "string" && data.website.trim()) {
    return { status: 200, body: { ok: true } };
  }

  const name =
    typeof data.name === "string" ? data.name.replace(/\s+/g, " ").trim() : "";
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const typeLabel = lookup(INQUIRY_TYPES, data.service);
  const serviceTitle = lookup(SERVICES, data.interest);

  if (name.length < 2 || name.length > 120) return fail(400, "Enter your full name.");
  if (email.length > 254 || !EMAIL_RE.test(email)) return fail(400, "Enter a valid email address.");
  if (!typeLabel) return fail(400, "Choose an inquiry type.");
  if (message.length < 10 || message.length > 2000) {
    return fail(400, "Your message must be between 10 and 2000 characters.");
  }

  const BREVO_API_KEY = clean(env.BREVO_API_KEY);
  const CONTACT_FROM_EMAIL = clean(env.CONTACT_FROM_EMAIL);
  const fromName = clean(env.CONTACT_FROM_NAME) || "thevibe.";
  const teamInboxes = clean(env.CONTACT_TO_EMAIL)
    .split(",")
    .map(clean)
    .filter(Boolean);

  if (!BREVO_API_KEY || !CONTACT_FROM_EMAIL || !teamInboxes.length) {
    console.error("Contact email is not configured.");
    return fail(500, "Messaging is temporarily unavailable.");
  }

  const sender = { name: fromName, email: CONTACT_FROM_EMAIL };

  // 1. The message to the team. This one must succeed.
  const teamSent = await sendEmail(BREVO_API_KEY, {
    sender,
    to: teamInboxes.map((address) => ({ email: address })),
    replyTo: { email, name },
    subject: `New ${typeLabel.toLowerCase()} inquiry from ${name}`,
    htmlContent: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
<h2 style="margin:0 0 16px">New inquiry</h2>
<table>
${row("Name", escapeHtml(name))}
${row("Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
${row("Inquiry type", escapeHtml(typeLabel))}
${serviceTitle ? row("Service page", escapeHtml(serviceTitle)) : ""}
</table>
<p style="margin:20px 0 6px;color:#777">Message</p>
<p style="margin:0">${withBreaks(message)}</p>
<p style="margin:24px 0 0;color:#777;font-size:13px">Hit reply to answer ${escapeHtml(name)} directly.</p>
</div>`,
    textContent: [
      "New inquiry",
      `Name: ${name}`,
      `Email: ${email}`,
      `Inquiry type: ${typeLabel}`,
      serviceTitle ? `Service page: ${serviceTitle}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  if (!teamSent) {
    return fail(502, "We couldn't send your message right now. Please try again.");
  }

  // 2. The confirmation to the visitor. A failure here doesn't fail the form.
  const first = name.split(" ")[0];
  const confirmSent = await sendEmail(BREVO_API_KEY, {
    sender,
    to: [{ email, name }],
    replyTo: { email: teamInboxes[0] },
    subject: "We got your message",
    htmlContent: `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#111;max-width:520px">
<p>Hi ${escapeHtml(first)},</p>
<p>Thanks for getting in touch. We've received your message${
      serviceTitle ? ` about <strong>${escapeHtml(serviceTitle)}</strong>` : ""
    } and a member of the team will reply soon.</p>
<p>If you'd like to add anything, just reply to this email.</p>
<p style="margin-top:28px">thevibe<span style="color:#F91D1D">.</span></p>
<p style="font-size:12px;color:#888;margin-top:28px">You're receiving this because you submitted the contact form on our website. If that wasn't you, you can ignore this email.</p>
</div>`,
    textContent: `Hi ${first},\n\nThanks for getting in touch. We've received your message${
      serviceTitle ? ` about ${serviceTitle}` : ""
    } and a member of the team will reply soon.\n\nIf you'd like to add anything, just reply to this email.\n\nthevibe.\n\nYou're receiving this because you submitted the contact form on our website. If that wasn't you, you can ignore this email.`,
  });
  if (!confirmSent) console.error("Confirmation email failed to send.");

  return { status: 200, body: { ok: true } };
} 