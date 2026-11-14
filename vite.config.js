import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig, loadEnv } from "vite";
// ...keep your existing imports (react, tailwindcss, etc.)

// Serves /api/feed while you run `npm run dev`, using server/x.js
function feedApi(env) {
  return {
    name: "local-feed-api",
    configureServer(server) {
      server.middlewares.use("/api/feed", async (req, res) => {
        res.setHeader("Content-Type", "application/json");
        try {
          const { getXFeed } = await server.ssrLoadModule("/server/x.js");
          const url = new URL(req.url, "http://localhost");
          const result = await getXFeed({
            limit: Number(url.searchParams.get("limit")) || 20,
            after: url.searchParams.get("after"),
            env,
          });
          res.statusCode = result.ok ? 200 : result.status;
          res.end(JSON.stringify(result.ok ? result.body : { error: result.error }));
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "server_error" }));
        }
      });
    },
  };
}

async function readWaitlistBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16 * 1024) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

function waitlistApi(env) {
  return {
    name: "local-waitlist-api",
    configureServer(server) {
      server.middlewares.use("/api/waitlist", async (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");

        if (req.method !== "POST") {
          res.setHeader("Allow", "POST");
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed." }));
          return;
        }

        try {
          const body = await readWaitlistBody(req);
          const { submitWaitlist } = await server.ssrLoadModule(
            "/server/waitlist.js",
          );
          const result = await submitWaitlist({
            body,
            databaseUrl: env.DATABASE_URL,
          });
          res.statusCode = result.status;
          res.end(JSON.stringify(result.body));
        } catch (error) {
          if (error.statusCode === 413) {
            res.statusCode = 413;
            res.end(JSON.stringify({ error: error.message }));
            return;
          }

          console.error("Local waitlist API failed.");
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Unable to process the signup." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Reads .env.local. The "" means all variables, not just VITE_ ones.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(), tailwindcss(),
      feedApi(env),
      waitlistApi(env),
    ],
  };
});

