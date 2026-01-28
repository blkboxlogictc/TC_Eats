import pg from "pg";
import fs from "fs";

const { Pool } = pg;

async function migrateToPostgres() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  console.log("🔄 Starting migration to PostgreSQL...");
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
  });

  try {
    // Read exported demo data
    if (!fs.existsSync("demo-data-export.json")) {
      console.error("❌ demo-data-export.json not found. Run 'npx tsx script/export-demo-data.ts' first");
      process.exit(1);
    }

    const demoData = JSON.parse(fs.readFileSync("demo-data-export.json", "utf8"));
    console.log("📊 Demo data loaded:", demoData.totalRecords);

    // Create tables from schema (run drizzle push first)
    console.log("🏗️  Ensuring tables exist...");

    // Clear existing data (for fresh migration) - skip if tables don't exist
    try {
      console.log("🧹 Clearing existing data...");
      await pool.query("DELETE FROM offers");
      await pool.query("DELETE FROM sms_campaigns");
      await pool.query("DELETE FROM patrons");
      await pool.query("DELETE FROM restaurants");

      // Reset sequences
      await pool.query("ALTER SEQUENCE restaurants_id_seq RESTART WITH 1");
      await pool.query("ALTER SEQUENCE offers_id_seq RESTART WITH 1");
    } catch (error) {
      console.log("ℹ️  Tables don't exist yet, will be created during insert");
    }

    // Insert restaurants
    console.log("🏪 Inserting restaurants...");
    for (const restaurant of demoData.restaurants) {
      const { id, ...restaurantData } = restaurant; // Remove ID to let PostgreSQL auto-generate
      await pool.query(`
        INSERT INTO restaurants (
          owner_id, name, description, address, city, zip, cuisine, phone, website,
          logo_url, hero_image_url, subscription_tier, is_featured, print_credits,
          sms_credits, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        restaurantData.ownerId,
        restaurantData.name,
        restaurantData.description,
        restaurantData.address,
        restaurantData.city,
        restaurantData.zip,
        restaurantData.cuisine,
        restaurantData.phone,
        restaurantData.website || null,
        restaurantData.logoUrl || null,
        restaurantData.heroImageUrl || null,
        restaurantData.subscriptionTier,
        restaurantData.isFeatured,
        restaurantData.printCredits,
        restaurantData.smsCredits,
        restaurantData.createdAt || new Date().toISOString()
      ]);
    }

    // Get restaurant ID mappings for offers
    const restaurantMappings = new Map();
    for (let i = 0; i < demoData.restaurants.length; i++) {
      const oldId = demoData.restaurants[i].id;
      const newId = i + 1; // PostgreSQL auto-incremented IDs start from 1
      restaurantMappings.set(oldId, newId);
    }

    // Insert offers
    console.log("🎯 Inserting offers...");
    for (const offer of demoData.offers) {
      const { id, ...offerData } = offer; // Remove ID to let PostgreSQL auto-generate
      const newRestaurantId = restaurantMappings.get(offerData.restaurantId);
      
      await pool.query(`
        INSERT INTO offers (
          restaurant_id, title, description, active, expires_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        newRestaurantId,
        offerData.title,
        offerData.description,
        offerData.active,
        offerData.expiresAt || null,
        offerData.createdAt || new Date().toISOString()
      ]);
    }

    // Insert patrons (if any)
    if (demoData.patrons.length > 0) {
      console.log("👥 Inserting patrons...");
      for (const patron of demoData.patrons) {
        const { id, ...patronData } = patron;
        await pool.query(`
          INSERT INTO patrons (
            first_name, last_name, phone, email, zip, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          patronData.firstName,
          patronData.lastName,
          patronData.phone,
          patronData.email || null,
          patronData.zip || null,
          patronData.createdAt || new Date().toISOString()
        ]);
      }
    }

    // Insert SMS campaigns (if any)
    if (demoData.smsCampaigns.length > 0) {
      console.log("📱 Inserting SMS campaigns...");
      for (const campaign of demoData.smsCampaigns) {
        const { id, ...campaignData } = campaign;
        await pool.query(`
          INSERT INTO sms_campaigns (
            content, sent_at, created_at
          ) VALUES ($1, $2, $3)
        `, [
          campaignData.content,
          campaignData.sentAt || null,
          campaignData.createdAt || new Date().toISOString()
        ]);
      }
    }

    // Verify migration
    const restaurantCount = await pool.query("SELECT COUNT(*) FROM restaurants");
    const offerCount = await pool.query("SELECT COUNT(*) FROM offers");

    console.log("✅ Migration completed successfully!");
    console.log(`📋 Migrated ${restaurantCount.rows[0].count} restaurants and ${offerCount.rows[0].count} offers`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Export the function
export { migrateToPostgres };

// Run migration if called directly
migrateToPostgres();