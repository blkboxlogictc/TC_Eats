import pg from "pg";

const { Pool } = pg;

async function checkDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
  });

  try {
    console.log("📡 Testing database connection...");
    
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");

    // List existing tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("📋 Existing tables:", result.rows.map(row => row.table_name));

    // Create our specific tables if they don't exist
    const ourTables = ['restaurants', 'offers', 'patrons', 'sms_campaigns'];
    const missingTables = ourTables.filter(table => !result.rows.some(row => row.table_name === table));
    
    if (missingTables.length > 0) {
      console.log("🏗️  Creating missing database tables:", missingTables);
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id SERIAL PRIMARY KEY,
          owner_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          zip TEXT NOT NULL,
          cuisine TEXT NOT NULL,
          phone TEXT,
          website TEXT,
          logo_url TEXT,
          hero_image_url TEXT,
          subscription_tier TEXT NOT NULL DEFAULT 'silver',
          is_featured BOOLEAN DEFAULT FALSE,
          print_credits INTEGER DEFAULT 0,
          sms_credits INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS offers (
          id SERIAL PRIMARY KEY,
          restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS patrons (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT UNIQUE NOT NULL,
          email TEXT,
          zip TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS sms_campaigns (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          sent_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log("✅ Tables created successfully!");
    } else {
      console.log("ℹ️  All required tables already exist");
    }

  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await pool.end();
  }
}

checkDatabase();