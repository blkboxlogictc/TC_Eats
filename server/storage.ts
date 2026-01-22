import { db } from "./db";
import { 
  restaurants, offers, patrons, smsCampaigns,
  type Restaurant, type InsertRestaurant,
  type Offer, type InsertOffer,
  type Patron, type InsertPatron,
  type SmsCampaign, type InsertSmsCampaign,
  type RestaurantWithOffers
} from "@shared/schema";
import { eq, ilike, and, sql, desc } from "drizzle-orm";

export interface IStorage {
  // Restaurants
  getRestaurants(filters?: { search?: string, cuisine?: string, city?: string }): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<RestaurantWithOffers | undefined>;
  getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant & { ownerId: string }): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  
  // Offers
  getOffers(restaurantId?: number): Promise<(Offer & { restaurant?: Restaurant })[]>;
  createOffer(offer: InsertOffer & { restaurantId: number }): Promise<Offer>;
  
  // Patrons
  createPatron(patron: InsertPatron): Promise<Patron>;
  
  // Admin
  getStats(): Promise<{ totalRestaurants: number, totalPatrons: number, totalOffers: number }>;
  createSmsCampaign(campaign: InsertSmsCampaign): Promise<SmsCampaign>;
}

export class DatabaseStorage implements IStorage {
  async getRestaurants(filters?: { search?: string, cuisine?: string, city?: string }): Promise<Restaurant[]> {
    let conditions = [];
    
    if (filters?.search) {
      conditions.push(ilike(restaurants.name, `%${filters.search}%`));
    }
    if (filters?.cuisine) {
      conditions.push(ilike(restaurants.cuisine, `%${filters.cuisine}%`));
    }
    if (filters?.city) {
      conditions.push(ilike(restaurants.city, `%${filters.city}%`));
    }

    return await db.select()
      .from(restaurants)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(restaurants.isFeatured), restaurants.name);
  }

  async getRestaurant(id: number): Promise<RestaurantWithOffers | undefined> {
    const restaurant = await db.query.restaurants.findFirst({
      where: eq(restaurants.id, id),
      with: {
        offers: true
      }
    });
    return restaurant as RestaurantWithOffers | undefined;
  }

  async getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | undefined> {
    return await db.query.restaurants.findFirst({
      where: eq(restaurants.ownerId, ownerId),
    });
  }

  async createRestaurant(insertRestaurant: InsertRestaurant & { ownerId: string }): Promise<Restaurant> {
    const [restaurant] = await db
      .insert(restaurants)
      .values(insertRestaurant)
      .returning();
    return restaurant;
  }

  async updateRestaurant(id: number, updates: Partial<InsertRestaurant>): Promise<Restaurant> {
    const [updated] = await db
      .update(restaurants)
      .set(updates)
      .where(eq(restaurants.id, id))
      .returning();
    return updated;
  }

  async getOffers(restaurantId?: number): Promise<(Offer & { restaurant?: Restaurant })[]> {
    if (restaurantId) {
      return await db.query.offers.findMany({
        where: eq(offers.restaurantId, restaurantId),
        orderBy: desc(offers.createdAt)
      });
    }
    
    // Public feed - with restaurant info
    return await db.query.offers.findMany({
      where: eq(offers.active, true),
      with: {
        restaurant: true
      },
      orderBy: desc(offers.createdAt),
      limit: 50
    });
  }

  async createOffer(insertOffer: InsertOffer & { restaurantId: number }): Promise<Offer> {
    const [offer] = await db
      .insert(offers)
      .values(insertOffer)
      .returning();
    return offer;
  }

  async createPatron(insertPatron: InsertPatron): Promise<Patron> {
    const [patron] = await db
      .insert(patrons)
      .values(insertPatron)
      .returning();
    return patron;
  }

  async getStats(): Promise<{ totalRestaurants: number, totalPatrons: number, totalOffers: number }> {
    const [r] = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
    const [p] = await db.select({ count: sql<number>`count(*)` }).from(patrons);
    const [o] = await db.select({ count: sql<number>`count(*)` }).from(offers);
    
    return {
      totalRestaurants: Number(r.count),
      totalPatrons: Number(p.count),
      totalOffers: Number(o.count),
    };
  }

  async createSmsCampaign(insertCampaign: InsertSmsCampaign): Promise<SmsCampaign> {
    const [campaign] = await db
      .insert(smsCampaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }
}

export const storage = new DatabaseStorage();
