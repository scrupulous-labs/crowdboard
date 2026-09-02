import { rmSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import * as esbuild from "esbuild";

const entryFile = join(import.meta.dirname, "../src/index.ts");
const outputDir = join(import.meta.dirname, "../dist");
const outputFile = join(outputDir, "./index.cjs");
const migrationsOutputDir = join(outputDir, "./migrations");
const migrationsSourceDir = join(
  dirname(fileURLToPath(import.meta.resolve("@crowdboard-backend/db-migration"))),
  "./migrations",
);

await esbuild.build({
  entryPoints: [entryFile],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node26",
  outfile: outputFile,
  minify: true,
  define: {
    "import.meta.dirname": "__dirname",
    "import.meta.filename": "__filename",
  },
  plugins: [
    {
      name: "clear-output",
      setup(build) {
        build.onStart(() => {
          rmSync(outputDir, { recursive: true, force: true });
        });
      },
    },
    {
      name: "copy-migrations",
      setup(build) {
        build.onStart(() => {
          cpSync(migrationsSourceDir, migrationsOutputDir, { recursive: true });
        });
      },
    },
  ],
});
