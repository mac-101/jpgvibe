import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ROUTES } from "../src/routes.js";

const root = fileURLToPath(new URL("../", import.meta.url));

function readEnvValue(contents, name) {
  const line = contents.match(new RegExp(`^\\s*${name}\\s*=\\s*(.*?)\\s*$`, "m"));
  if (!line) return undefined;
  return line[1].replace(/^(['"])(.*)\1$/, "$2").replace(/\s+#.*$/, "").trim();
}

async function findSiteUrl() {
  if (process.env.VITE_SITE_URL?.trim()) return process.env.VITE_SITE_URL.trim();

  for (const filename of [".env.local", ".env"]) {
    try {
      const contents = await readFile(path.join(root, filename), "utf8");
      const value = readEnvValue(contents, "VITE_SITE_URL");
      if (value) return value;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  throw new Error(
    "VITE_SITE_URL is required. Set it in the environment or in .env.local/.env (see .env.example)."
  );
}

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const siteUrl = (await findSiteUrl()).replace(/\/+$/, "");
let parsedUrl;
try {
  parsedUrl = new URL(siteUrl);
} catch {
  throw new Error("VITE_SITE_URL must be an absolute http(s) URL.");
}
if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
  throw new Error("VITE_SITE_URL must use http or https.");
}

const routes = [...new Set(Object.values(ROUTES))];
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${xmlEscape(`${siteUrl}${route}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

const publicDir = path.join(root, "public");
await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, "robots.txt"), robots),
  writeFile(path.join(publicDir, "sitemap.xml"), sitemap),
]);
