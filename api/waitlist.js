import { submitWaitlist } from "../server/waitlist.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const result = await submitWaitlist({
    body: req.body,
    databaseUrl: process.env.DATABASE_URL,
  });

  return res.status(result.status).json(result.body);
}
