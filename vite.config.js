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

export default defineConfig(({ mode }) => {
  // Reads .env.local. The "" means all variables, not just VITE_ ones.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(), tailwindcss(),
      feedApi(env),
    ],
  };
});

