import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export auth models
export * from "./models/auth";

// === ENUMS ===
export const subscriptionTiers = ["free", "silver", "gold", "platinum"] as const;
export type SubscriptionTier = typeof subscriptionTiers[number];

// === TABLE DEFINITIONS ===

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id").notNull(), // Links to auth users.id
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  city: text("city"),
  zip: text("zip"),
  cuisine: text("cuisine"), // Could be array or comma-separated
  phone: text("phone"),
  website: text("website"),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  subscriptionTier: text("subscription_tier", { enum: subscriptionTiers }).default("free").notNull(),
  isFeatured: boolean("is_featured").default(false),
  printCredits: integer("print_credits").default(0),
  smsCredits: integer("sms_credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  active: boolean("active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patrons = pgTable("patrons", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(), // Simple unique constraint for MVP
  city: text("city"),
  zip: text("zip"),
  cuisinePreferences: jsonb("cuisine_preferences").$type<string[]>(), // Array of cuisines
  consentedAt: timestamp("consented_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const smsCampaigns = pgTable("sms_campaigns", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  targetCriteria: jsonb("target_criteria"), // e.g. { city: "Stuart", cuisine: "Italian" }
  recipientCount: integer("recipient_count").default(0),
});

// === RELATIONS ===

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  offers: many(offers),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [offers.restaurantId],
    references: [restaurants.id],
  }),
}));

// === ZOD SCHEMAS & TYPES ===

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ 
  id: true, 
  createdAt: true,
  ownerId: true // set by backend
});

export const insertOfferSchema = createInsertSchema(offers).omit({ 
  id: true, 
  createdAt: true,
  restaurantId: true // set by backend from context
});

export const insertPatronSchema = createInsertSchema(patrons).omit({ 
  id: true, 
  createdAt: true,
  consentedAt: true 
}).extend({
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms." }) })
});

export const insertSmsCampaignSchema = createInsertSchema(smsCampaigns).omit({
  id: true,
  sentAt: true,
  recipientCount: true
});

// === API TYPES ===

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Patron = typeof patrons.$inferSelect;
export type InsertPatron = z.infer<typeof insertPatronSchema>;
export type SmsCampaign = typeof smsCampaigns.$inferSelect;
export type InsertSmsCampaign = z.infer<typeof insertSmsCampaignSchema>;

// Complex responses
export type RestaurantWithOffers = Restaurant & { offers: Offer[] };
