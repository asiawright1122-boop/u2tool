import path from "node:path";

import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

const repoRoot = process.env.GANTT_FIXTURE_REPO_ROOT;
const outDir = process.env.GANTT_FIXTURE_OUT_DIR;
const cacheDir = process.env.GANTT_FIXTURE_CACHE_DIR;

if (!repoRoot || !outDir || !cacheDir) {
  throw new Error("Gantt fixture paths are required");
}

export default defineConfig({
  srcDir: path.join(
    repoRoot,
    "src/components/tools/test-fixtures/gantt-chart-generator/src",
  ),
  publicDir: path.join(cacheDir, "public"),
  output: "static",
  outDir,
  cacheDir: path.join(cacheDir, "astro"),
  integrations: [svelte()],
  vite: {
    cacheDir: path.join(cacheDir, "vite"),
    resolve: { alias: { "@": path.join(repoRoot, "src") } },
  },
});
