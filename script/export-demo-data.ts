import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema";
import fs from "fs";

// Connect to your local SQLite database
const sqlite = new Database("dev.db");
const db = drizzle(sqlite, { schema });

async function exportDemoData() {
  try {
    console.log("📊 Exporting demo data from SQLite...");
    
    // Export all tables
    const restaurants = await db.select().from(schema.restaurants);
    const offers = await db.select().from(schema.offers);
    const patrons = await db.select().from(schema.patrons);
    const smsCampaigns = await db.select().from(schema.smsCampaigns);

    const exportData = {
      restaurants,
      offers,
      patrons,
      smsCampaigns,
      exportedAt: new Date().toISOString(),
      totalRecords: {
        restaurants: restaurants.length,
        offers: offers.length,
        patrons: patrons.length,
        smsCampaigns: smsCampaigns.length
      }
    };

    // Save to JSON file
    fs.writeFileSync("demo-data-export.json", JSON.stringify(exportData, null, 2));
    
    console.log("✅ Demo data exported successfully!");
    console.log(`📋 Exported ${restaurants.length} restaurants, ${offers.length} offers, ${patrons.length} patrons, ${smsCampaigns.length} SMS campaigns`);
    console.log("💾 Data saved to: demo-data-export.json");
    
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

exportDemoData();