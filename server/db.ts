import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import pg from "pg";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

const { Pool } = pg;

// For serverless environments, we need to handle connections more carefully
let db: any;
let pool: any = null;
let sqlite: any = null;

function initializeDatabase() {
  // For demo mode, we don't need a real database connection
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE === "true") {
    console.log("Demo mode: Skipping database initialization");
    return null; // Return null to indicate no database
  }

  if (db) {
    return db; // Return existing connection
  }

  // Check if we're using SQLite (for development) or PostgreSQL (for production)
  if (process.env.DATABASE_URL.startsWith("file:")) {
    // SQLite for development
    const dbPath = process.env.DATABASE_URL.replace("file:", "");
    sqlite = new Database(dbPath);
    db = drizzleSqlite(sqlite, { schema });
  } else {
    // PostgreSQL for production with serverless-optimized pool
    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1, // Limit connections in serverless
        idleTimeoutMillis: 10000, // Close idle connections quickly
        connectionTimeoutMillis: 5000, // Fast timeout for connections
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
      });
    }
    db = drizzle(pool, { schema });
  }

  return db;
}

// Graceful cleanup for serverless
function closeDatabase() {
  if (pool) {
    pool.end();
    pool = null;
  }
  if (sqlite) {
    sqlite.close();
    sqlite = null;
  }
  db = null;
}

// Export function to get database instance
export function getDatabase() {
  return initializeDatabase();
}

export { closeDatabase, pool };
