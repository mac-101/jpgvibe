import { submitContact } from "../server/contact.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  
  const result = await submitContact({ body: req.body, env: process.env });
  return res.status(result.status).json(result.body);
}