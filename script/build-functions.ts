import { build } from "esbuild";
import { promises as fs } from "fs";
import path from "path";

async function buildFunctions() {
  // Ensure output directory exists
  await fs.mkdir("dist/functions", { recursive: true });

  try {
    // Build the API function
    await build({
      entryPoints: ["functions/api.ts"],
      bundle: true,
      platform: "node",
      target: "node18",
      format: "cjs",
      outdir: "dist/functions",
      external: [
        "@netlify/functions",
        "better-sqlite3",
        "pg",
        "pg-native"
      ],
      define: {
        "process.env.NODE_ENV": '"production"'
      },
      minify: true,
      sourcemap: false,
      tsconfig: "tsconfig.json"
    });

    console.log("✓ Netlify functions built successfully!");
  } catch (error) {
    console.error("✗ Error building functions:", error);
    process.exit(1);
  }
}

buildFunctions();