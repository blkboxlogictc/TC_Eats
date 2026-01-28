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
        "pg-native"
      ],
      define: {
        "process.env.NODE_ENV": '"production"'
      },
      minify: false, // Keep unminified for debugging
      sourcemap: true,
      tsconfig: "tsconfig.json",
      resolveExtensions: ['.ts', '.js'],
      loader: {
        '.ts': 'ts'
      }
    });

    console.log("✓ Netlify functions built successfully!");
  } catch (error) {
    console.error("✗ Error building functions:", error);
    process.exit(1);
  }
}

buildFunctions();