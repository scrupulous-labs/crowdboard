import { spawn } from "node:child_process";
import { join } from "node:path";

import * as esbuild from "esbuild";

const entryFile = join(import.meta.dirname, "../src/index.ts");
const outputFile = join(import.meta.dirname, "../dist/index.js");

let server;
async function restartServer() {
  !!server &&
    (await new Promise((resolve) => {
      server.once("exit", () => resolve());
      server.kill("SIGTERM");
    }));

  server = spawn("node", [outputFile], {
    stdio: "inherit",
    env: process.env,
  });

  server.on("exit", (code) => {
    !!code && console.error(`Server exited with code ${code}`);
  });
}

const esbuildContext = await esbuild.context({
  entryPoints: [entryFile],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node26",
  outfile: outputFile,
  packages: "external",
  sourcemap: true,
  plugins: [
    {
      name: "restart-server",
      setup(build) {
        build.onEnd(async (result) => {
          !result.errors.length && (await restartServer());
        });
      },
    },
  ],
});

await esbuildContext.watch();
