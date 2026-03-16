import { build, context } from "esbuild";
import { mkdirSync, rmSync } from "node:fs";

const args = new Set(process.argv.slice(2));
const watch = args.has("--watch");
const production = args.has("--production");

const shared = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/extension.js",
  format: "cjs",
  platform: "node",
  target: "node20",
  external: ["vscode"],
  sourcemap: production ? false : true,
  minify: production,
  legalComments: "none",
  logLevel: "info",
};

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

if (watch) {
  const ctx = await context(shared);
  await ctx.watch();
} else {
  await build(shared);
}
