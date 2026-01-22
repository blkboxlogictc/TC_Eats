import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { restaurants, offers } from "@shared/schema"; // For types/seeds

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // === RESTAURANTS ===
  app.get(api.restaurants.list.path, async (req, res) => {
    const query = req.query as { search?: string, cuisine?: string, city?: string };
    const items = await storage.getRestaurants(query);
    res.json(items);
  });

  app.get(api.restaurants.get.path, async (req, res) => {
    const item = await storage.getRestaurant(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Restaurant not found" });
    res.json(item);
  });

  // Protected: Create Restaurant (Owner)
  app.post(api.restaurants.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.restaurants.create.input.parse(req.body);
      const ownerId = (req.user as any).claims.sub;
      
      // Check if user already has a restaurant (MVP restriction: 1 per user)
      const existing = await storage.getRestaurantByOwnerId(ownerId);
      if (existing) {
         return res.status(400).json({ message: "You already have a restaurant profile." });
      }

      const item = await storage.createRestaurant({ ...input, ownerId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Protected: Update Restaurant (Owner only)
  app.patch(api.restaurants.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const id = Number(req.params.id);
    const ownerId = (req.user as any).claims.sub;
    
    const existing = await storage.getRestaurant(id);
    if (!existing) return res.status(404).json({ message: "Restaurant not found" });
    if (existing.ownerId !== ownerId) return res.status(401).json({ message: "Not authorized to edit this restaurant" });

    try {
      const input = api.restaurants.update.input.parse(req.body);
      const updated = await storage.updateRestaurant(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.restaurants.getMyRestaurant.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const ownerId = (req.user as any).claims.sub;
    const item = await storage.getRestaurantByOwnerId(ownerId);
    res.json(item || null);
  });

  // === OFFERS ===
  app.get(api.offers.listPublic.path, async (req, res) => {
    const items = await storage.getOffers();
    res.json(items);
  });

  app.post(api.offers.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const restaurantId = Number(req.params.restaurantId);
    const ownerId = (req.user as any).claims.sub;
    
    // Verify ownership
    const restaurant = await storage.getRestaurant(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurant.ownerId !== ownerId) return res.status(401).json({ message: "Not authorized" });

    try {
      const input = api.offers.create.input.parse(req.body);
      const item = await storage.createOffer({ ...input, restaurantId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // === PATRONS ===
  app.post(api.patrons.create.path, async (req, res) => {
    try {
      const input = api.patrons.create.input.parse(req.body);
      // In real app: verify phone via Twilio
      const item = await storage.createPatron(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else if ((err as any).code === '23505') { // Unique violation
        res.status(400).json({ message: "This phone number is already registered." });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // === ADMIN ===
  app.get(api.admin.stats.path, async (req, res) => {
    // In real app: Check for admin role
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.post(api.admin.sendSms.path, async (req, res) => {
    // In real app: Check for admin role
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.admin.sendSms.input.parse(req.body);
      const campaign = await storage.createSmsCampaign(input);
      // Here we would call Twilio
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ message: "Failed to send campaign" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getRestaurants();
  if (existing.length === 0) {
    console.log("Seeding database...");
    // Create a dummy restaurant linked to a fake owner ID (for display purposes)
    // Real users will claim their own via Auth
    
    const r1 = await storage.createRestaurant({
      ownerId: "seed-user-1",
      name: "The Twisted Tuna",
      description: "Waterfront dining with fresh seafood and live music.",
      address: "4290 SE Salerno Rd",
      city: "Stuart",
      zip: "34997",
      cuisine: "Seafood",
      phone: "772-600-7239",
      subscriptionTier: "gold",
      isFeatured: true,
      heroImageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
    });

    await storage.createOffer({
      restaurantId: r1.id,
      title: "Free Appetizer",
      description: "Get a free calamari with any two entrees.",
      active: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    const r2 = await storage.createRestaurant({
      ownerId: "seed-user-2",
      name: "Kyle G's Prime Seafood",
      description: "Upscale oceanfront dining experience.",
      address: "10900 S Ocean Dr",
      city: "Jensen Beach",
      zip: "34957",
      cuisine: "Steakhouse",
      phone: "772-237-5461",
      subscriptionTier: "platinum",
      isFeatured: true,
      heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    });

    await storage.createOffer({
      restaurantId: r2.id,
      title: "Sunset Special",
      description: "Half price cocktails from 4-6pm.",
      active: true,
    });

    // 6 more varied listings
    const r3 = await storage.createRestaurant({
      ownerId: "seed-user-3",
      name: "Dolphin Bar & Shrimp House",
      description: "Historic waterfront restaurant with amazing views.",
      address: "1401 NE Ocean Blvd",
      city: "Jensen Beach",
      zip: "34957",
      cuisine: "Seafood",
      phone: "772-225-2747",
      subscriptionTier: "silver",
      heroImageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80",
    });

    const r4 = await storage.createRestaurant({
      ownerId: "seed-user-4",
      name: "Pietro's on the Ocean",
      description: "Fine Italian dining with an ocean view.",
      address: "10900 S Ocean Dr",
      city: "Jensen Beach",
      zip: "34957",
      cuisine: "Italian",
      phone: "772-229-3131",
      subscriptionTier: "gold",
      heroImageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80",
    });

    const r5 = await storage.createRestaurant({
      ownerId: "seed-user-5",
      name: "Conchy Joe's Seafood",
      description: "Bahamian-style seafood in a rustic setting.",
      address: "3945 NE Indian River Dr",
      city: "Jensen Beach",
      zip: "34957",
      cuisine: "Seafood",
      phone: "772-334-1130",
      subscriptionTier: "silver",
      heroImageUrl: "https://images.unsplash.com/photo-1534080564607-c9275445f29c?auto=format&fit=crop&q=80",
    });

    const r6 = await storage.createRestaurant({
      ownerId: "seed-user-6",
      name: "Stringers Tavern & Oyster Bar",
      description: "Modern tavern with fresh oysters and craft beer.",
      address: "3754 NE Indian River Dr",
      city: "Jensen Beach",
      zip: "34957",
      cuisine: "American",
      phone: "772-208-5464",
      subscriptionTier: "gold",
      heroImageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80",
    });

    const r7 = await storage.createRestaurant({
      ownerId: "seed-user-7",
      name: "Guanabanas Restaurant",
      description: "Lush tropical outdoor dining experience.",
      address: "960 N Hwy A1A",
      city: "Jupiter",
      zip: "33477",
      cuisine: "American",
      phone: "561-747-8878",
      subscriptionTier: "platinum",
      heroImageUrl: "https://images.unsplash.com/photo-1502301103675-91d57632d076?auto=format&fit=crop&q=80",
    });

    const r8 = await storage.createRestaurant({
      ownerId: "seed-user-8",
      name: "Taco Shack",
      description: "Casual local spot for fresh tacos and bowls.",
      address: "1155 SE Federal Hwy",
      city: "Stuart",
      zip: "34994",
      cuisine: "Mexican",
      phone: "772-288-9641",
      subscriptionTier: "silver",
      heroImageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
    });
    
    console.log("Seeding complete.");
  }
}
