import type { Express } from "express";
import type { Server } from "http";
import { setupDemoAuth } from "./auth";
import { DemoStorage } from "./demo-storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { restaurants, offers } from "@shared/schema"; // For types/seeds

// Use demo storage instead of database storage
const storage = new DemoStorage();

// Extend Express Request interface to include auth properties
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated?: () => boolean;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  setupDemoAuth(app);

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
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.restaurants.create.input.parse(req.body);
      const ownerId = req.user?.claims?.sub;
      
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
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });

    const id = Number(req.params.id);
    const ownerId = req.user?.claims?.sub;
    
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
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });
    const ownerId = req.user?.claims?.sub;
    const item = await storage.getRestaurantByOwnerId(ownerId);
    res.json(item || null);
  });

  // === OFFERS ===
  app.get(api.offers.listPublic.path, async (req, res) => {
    const items = await storage.getOffers();
    res.json(items);
  });

  app.post(api.offers.create.path, async (req, res) => {
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });

    const restaurantId = Number(req.params.restaurantId);
    const ownerId = req.user?.claims?.sub;
    
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
      } else if ((err as any).message?.includes("already registered")) {
        res.status(400).json({ message: "This phone number is already registered." });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // === ADMIN ===
  app.get(api.admin.stats.path, async (req, res) => {
    // In real app: Check for admin role
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.post(api.admin.sendSms.path, async (req, res) => {
    // In real app: Check for admin role
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.admin.sendSms.input.parse(req.body);
      const campaign = await storage.createSmsCampaign(input);
      // Here we would call Twilio
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ message: "Failed to send campaign" });
    }
  });

  // No need to seed database - using hardcoded data
  console.log("Using hardcoded demo data - no database seeding required");

  return httpServer;
}
