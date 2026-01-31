// Static demo data - no API calls needed
export const DEMO_OWNER_ID = "demo-owner-123";

export const DEMO_USER = {
  id: DEMO_OWNER_ID,
  email: "owner@thetwistedtuna.com",
  firstName: "Sarah",
  lastName: "Johnson",
  profileImageUrl: null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-15T00:00:00.000Z"),
};

// For legacy compatibility with server auth
export const DEMO_USER_WITH_CLAIMS = {
  ...DEMO_USER,
  claims: {
    sub: DEMO_OWNER_ID,
    email: "owner@thetwistedtuna.com",
    first_name: "Sarah",
    last_name: "Johnson"
  }
};

// Restaurant data
export const DEMO_RESTAURANTS = [
  {
    id: 1,
    ownerId: DEMO_OWNER_ID, // This restaurant is owned by our demo user
    name: "The Twisted Tuna",
    description: "Waterfront dining with fresh seafood and live music.",
    address: "4290 SE Salerno Rd",
    city: "Stuart",
    zip: "34997",
    cuisine: "Seafood",
    phone: "772-600-7239",
    website: "https://thetwistedtuna.com",
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
    subscriptionTier: "gold",
    isFeatured: true,
    printCredits: 100,
    smsCredits: 50,
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: 2,
    ownerId: "seed-user-2",
    name: "Kyle G's Prime Seafood",
    description: "Upscale oceanfront dining experience.",
    address: "10900 S Ocean Dr",
    city: "Jensen Beach",
    zip: "34957",
    cuisine: "Steakhouse",
    phone: "772-237-5461",
    website: "https://kylegsprime.com",
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    subscriptionTier: "platinum",
    isFeatured: true,
    printCredits: 200,
    smsCredits: 100,
    createdAt: "2024-01-10T09:00:00.000Z",
  },
  {
    id: 3,
    ownerId: "seed-user-3",
    name: "Dolphin Bar & Shrimp House",
    description: "Historic waterfront restaurant with amazing views.",
    address: "1401 NE Ocean Blvd",
    city: "Jensen Beach",
    zip: "34957",
    cuisine: "Seafood",
    phone: "772-225-2747",
    website: null,
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80",
    subscriptionTier: "silver",
    isFeatured: false,
    printCredits: 25,
    smsCredits: 25,
    createdAt: "2024-01-12T11:00:00.000Z",
  },
  {
    id: 4,
    ownerId: "seed-user-4",
    name: "Pietro's on the Ocean",
    description: "Fine Italian dining with an ocean view.",
    address: "10900 S Ocean Dr",
    city: "Jensen Beach",
    zip: "34957",
    cuisine: "Italian",
    phone: "772-229-3131",
    website: null,
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80",
    subscriptionTier: "gold",
    isFeatured: false,
    printCredits: 75,
    smsCredits: 40,
    createdAt: "2024-01-08T14:00:00.000Z",
  },
  {
    id: 5,
    ownerId: "seed-user-5",
    name: "Conchy Joe's Seafood",
    description: "Bahamian-style seafood in a rustic setting.",
    address: "3945 NE Indian River Dr",
    city: "Jensen Beach",
    zip: "34957",
    cuisine: "Seafood",
    phone: "772-334-1130",
    website: null,
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1534080564607-c9275445f29c?auto=format&fit=crop&q=80",
    subscriptionTier: "silver",
    isFeatured: false,
    printCredits: 30,
    smsCredits: 20,
    createdAt: "2024-01-20T16:00:00.000Z",
  },
  {
    id: 6,
    ownerId: "seed-user-6",
    name: "Stringers Tavern & Oyster Bar",
    description: "Modern tavern with fresh oysters and craft beer.",
    address: "3754 NE Indian River Dr",
    city: "Jensen Beach",
    zip: "34957",
    cuisine: "American",
    phone: "772-208-5464",
    website: null,
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80",
    subscriptionTier: "gold",
    isFeatured: true,
    printCredits: 80,
    smsCredits: 45,
    createdAt: "2024-01-05T13:00:00.000Z",
  },
  {
    id: 7,
    ownerId: "seed-user-7",
    name: "Guanabanas Restaurant",
    description: "Lush tropical outdoor dining experience.",
    address: "960 N Hwy A1A",
    city: "Jupiter",
    zip: "33477",
    cuisine: "American",
    phone: "561-747-8878",
    website: null,
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1502301103675-91d57632d076?auto=format&fit=crop&q=80",
    subscriptionTier: "platinum",
    isFeatured: true,
    printCredits: 150,
    smsCredits: 80,
    createdAt: "2024-01-18T12:00:00.000Z",
  },
  {
    id: 8,
    ownerId: "seed-user-8",
    name: "Taco Shack",
    description: "Casual local spot for fresh tacos and bowls.",
    address: "1155 SE Federal Hwy",
    city: "Stuart",
    zip: "34994",
    cuisine: "Mexican",
    phone: "772-288-9641",
    website: null,
    logoUrl: null,
    heroImageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
    subscriptionTier: "silver",
    isFeatured: false,
    printCredits: 20,
    smsCredits: 15,
    createdAt: "2024-01-22T15:00:00.000Z",
  },
];

// Offers data
export const DEMO_OFFERS = [
  {
    id: 1,
    restaurantId: 1, // The Twisted Tuna (owned by demo user)
    title: "Free Appetizer",
    description: "Get a free calamari with any two entrees.",
    active: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: "2024-01-25T10:00:00.000Z",
    restaurant: DEMO_RESTAURANTS[0], // The Twisted Tuna
  },
  {
    id: 2,
    restaurantId: 1, // The Twisted Tuna (owned by demo user) - another offer
    title: "Happy Hour Special",
    description: "Half price drinks from 4-6 PM Monday through Thursday.",
    active: true,
    expiresAt: null,
    createdAt: "2024-01-20T14:00:00.000Z",
    restaurant: DEMO_RESTAURANTS[0], // The Twisted Tuna
  },
  {
    id: 3,
    restaurantId: 2, // Kyle G's Prime Seafood
    title: "Sunset Special",
    description: "Half price cocktails from 4-6pm.",
    active: true,
    expiresAt: null,
    createdAt: "2024-01-24T09:00:00.000Z",
    restaurant: DEMO_RESTAURANTS[1], // Kyle G's
  },
  {
    id: 4,
    restaurantId: 6, // Stringers Tavern
    title: "Oyster Night",
    description: "$1 oysters every Tuesday night.",
    active: true,
    expiresAt: null,
    createdAt: "2024-01-23T11:00:00.000Z",
    restaurant: DEMO_RESTAURANTS[5], // Stringers
  },
  {
    id: 5,
    restaurantId: 7, // Guanabanas
    title: "Weekend Brunch",
    description: "Bottomless mimosas with brunch on weekends.",
    active: true,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    createdAt: "2024-01-21T08:00:00.000Z",
    restaurant: DEMO_RESTAURANTS[6], // Guanabanas
  },
];

// Patrons data (for admin stats)
export const DEMO_PATRONS = [
  {
    id: 1,
    phone: "+1-772-555-0101",
    city: "Stuart",
    zip: "34997",
    cuisinePreferences: '["Seafood", "American"]',
    consentedAt: "2024-01-15T12:00:00.000Z",
    createdAt: "2024-01-15T12:00:00.000Z",
  },
  {
    id: 2,
    phone: "+1-772-555-0102",
    city: "Jensen Beach",
    zip: "34957",
    cuisinePreferences: '["Italian", "Steakhouse"]',
    consentedAt: "2024-01-18T15:30:00.000Z",
    createdAt: "2024-01-18T15:30:00.000Z",
  },
  {
    id: 3,
    phone: "+1-561-555-0103",
    city: "Jupiter",
    zip: "33477",
    cuisinePreferences: '["Mexican", "American", "Seafood"]',
    consentedAt: "2024-01-20T10:15:00.000Z",
    createdAt: "2024-01-20T10:15:00.000Z",
  },
  {
    id: 4,
    phone: "+1-772-555-0104",
    city: "Stuart",
    zip: "34994",
    cuisinePreferences: '["Seafood"]',
    consentedAt: "2024-01-22T14:45:00.000Z",
    createdAt: "2024-01-22T14:45:00.000Z",
  },
  {
    id: 5,
    phone: "+1-772-555-0105",
    city: "Jensen Beach",
    zip: "34957",
    cuisinePreferences: '["American", "Italian"]',
    consentedAt: "2024-01-24T09:20:00.000Z",
    createdAt: "2024-01-24T09:20:00.000Z",
  },
];

// Admin statistics
export const DEMO_STATS = {
  totalRestaurants: DEMO_RESTAURANTS.length,
  totalPatrons: DEMO_PATRONS.length,
  totalOffers: DEMO_OFFERS.length,
};

// Helper functions for filtering
export function getRestaurants(filters?: { search?: string, cuisine?: string, city?: string }) {
  let filtered = [...DEMO_RESTAURANTS];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(search) ||
      (r.description && r.description.toLowerCase().includes(search))
    );
  }

  if (filters?.cuisine) {
    const cuisine = filters.cuisine.toLowerCase();
    filtered = filtered.filter(r => 
      r.cuisine && r.cuisine.toLowerCase().includes(cuisine)
    );
  }

  if (filters?.city) {
    const city = filters.city.toLowerCase();
    filtered = filtered.filter(r => 
      r.city && r.city.toLowerCase().includes(city)
    );
  }

  // Sort by featured first, then by name
  return filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function getRestaurantById(id: number) {
  const restaurant = DEMO_RESTAURANTS.find(r => r.id === id);
  if (!restaurant) return undefined;

  const restaurantOffers = DEMO_OFFERS.filter(o => o.restaurantId === id);
  
  return {
    ...restaurant,
    offers: restaurantOffers.map(offer => ({
      id: offer.id,
      restaurantId: offer.restaurantId,
      title: offer.title,
      description: offer.description,
      active: offer.active,
      expiresAt: offer.expiresAt,
      createdAt: offer.createdAt,
    }))
  };
}

export function getMyRestaurant() {
  return DEMO_RESTAURANTS.find(r => r.ownerId === DEMO_OWNER_ID) || null;
}

export function getOffers() {
  return DEMO_OFFERS.filter(o => o.active);
}

export function getStats() {
  return DEMO_STATS;
}