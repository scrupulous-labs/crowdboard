import { rmSync } from "node:fs";
import { join } from "node:path";

import * as esbuild from "esbuild";

const entryFile = join(import.meta.dirname, "../src/index.ts");
const outputDir = join(import.meta.dirname, "../dist");
const outputFile = join(outputDir, "./index.cjs");

await esbuild.build({
  entryPoints: [entryFile],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node26",
  outfile: outputFile,
  plugins: [
    {
      name: "clear-output",
      setup(build) {
        build.onStart(() => {
          rmSync(outputDir, { recursive: true, force: true });
        });
      },
    },
  ],
});
