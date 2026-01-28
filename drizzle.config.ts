import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: process.env.DATABASE_URL.startsWith("file:") ? "sqlite" : "postgresql",
  dbCredentials: process.env.DATABASE_URL.startsWith("file:")
    ? { url: process.env.DATABASE_URL.replace("file:", "") }
    : { url: process.env.DATABASE_URL },
});
