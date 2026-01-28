import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import pg from "pg";

const { Pool } = pg;

// Database connection
let pool: pg.Pool;

function getDbPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 1, // Limit connections in serverless
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Get the API path from the URL
    const path = event.path.replace('/.netlify/functions/api', '') || '/';
    const method = event.httpMethod;
    
    console.log(`[Netlify Function] ${method} ${path}`);
    console.log('Query params:', event.queryStringParameters);

    // Parse query parameters
    const query = event.queryStringParameters || {};
    
    // Parse body if present
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        console.warn("Could not parse body as JSON");
      }
    }

    let result;

    // Route handlers
    if (path === '/auth/user' && method === 'GET') {
      result = await handleAuth();
    } else if (path === '/restaurants' && method === 'GET') {
      result = await handleRestaurants(query);
    } else if (path.match(/^\/restaurants\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/')[2]);
      result = await handleRestaurantById(id);
    } else if (path === '/my-restaurant' && method === 'GET') {
      result = await handleMyRestaurant();
    } else if (path === '/offers' && method === 'GET') {
      result = await handleOffers();
    } else if (path === '/admin/stats' && method === 'GET') {
      result = await handleAdminStats();
    } else if (path === '/logout' && method === 'GET') {
      result = await handleLogout();
    } else {
      result = {
        statusCode: 404,
        body: { message: `Route not found: ${method} ${path}` }
      };
    }

    return {
      statusCode: result.statusCode,
      headers,
      body: JSON.stringify(result.body),
    };

  } catch (error) {
    console.error('[Netlify Function] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

// Route handlers
async function handleAuth() {
  return {
    statusCode: 200,
    body: {
      id: "demo-user-1",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      claims: {
        sub: "demo-user-1",
        email: "demo@example.com",
        first_name: "Demo",
        last_name: "User"
      }
    }
  };
}

async function handleRestaurants(query: any) {
  const db = getDbPool();
  
  try {
    let sql = `
      SELECT id, owner_id as "ownerId", name, description, address, city, zip, 
             cuisine, phone, website, logo_url as "logoUrl", hero_image_url as "heroImageUrl",
             subscription_tier as "subscriptionTier", is_featured as "isFeatured", 
             print_credits as "printCredits", sms_credits as "smsCredits", 
             created_at as "createdAt"
      FROM restaurants 
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (query.search) {
      sql += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${query.search}%`);
      paramIndex++;
    }
    
    if (query.cuisine) {
      sql += ` AND cuisine ILIKE $${paramIndex}`;
      params.push(`%${query.cuisine}%`);
      paramIndex++;
    }
    
    if (query.city) {
      sql += ` AND city ILIKE $${paramIndex}`;
      params.push(`%${query.city}%`);
      paramIndex++;
    }
    
    sql += ` ORDER BY is_featured DESC, name`;
    
    const result = await db.query(sql, params);
    
    return {
      statusCode: 200,
      body: result.rows
    };
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching restaurants' }
    };
  }
}

async function handleRestaurantById(id: number) {
  const db = getDbPool();
  
  try {
    const restaurantQuery = `
      SELECT id, owner_id as "ownerId", name, description, address, city, zip, 
             cuisine, phone, website, logo_url as "logoUrl", hero_image_url as "heroImageUrl",
             subscription_tier as "subscriptionTier", is_featured as "isFeatured", 
             print_credits as "printCredits", sms_credits as "smsCredits", 
             created_at as "createdAt"
      FROM restaurants 
      WHERE id = $1
    `;
    
    const offersQuery = `
      SELECT id, restaurant_id as "restaurantId", title, description, active, 
             expires_at as "expiresAt", created_at as "createdAt"
      FROM offers 
      WHERE restaurant_id = $1
    `;
    
    const [restaurantResult, offersResult] = await Promise.all([
      db.query(restaurantQuery, [id]),
      db.query(offersQuery, [id])
    ]);
    
    if (restaurantResult.rows.length === 0) {
      return {
        statusCode: 404,
        body: { message: "Restaurant not found" }
      };
    }
    
    const restaurant = restaurantResult.rows[0];
    restaurant.offers = offersResult.rows;
    
    return {
      statusCode: 200,
      body: restaurant
    };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching restaurant' }
    };
  }
}

async function handleMyRestaurant() {
  // For demo purposes, return null (no restaurant for demo user)
  return {
    statusCode: 200,
    body: null
  };
}

async function handleOffers() {
  const db = getDbPool();
  
  try {
    const sql = `
      SELECT o.id, o.restaurant_id as "restaurantId", o.title, o.description, 
             o.active, o.expires_at as "expiresAt", o.created_at as "createdAt",
             r.id as "restaurant.id", r.owner_id as "restaurant.ownerId", 
             r.name as "restaurant.name", r.description as "restaurant.description",
             r.address as "restaurant.address", r.city as "restaurant.city", 
             r.zip as "restaurant.zip", r.cuisine as "restaurant.cuisine",
             r.phone as "restaurant.phone", r.website as "restaurant.website",
             r.logo_url as "restaurant.logoUrl", r.hero_image_url as "restaurant.heroImageUrl",
             r.subscription_tier as "restaurant.subscriptionTier", 
             r.is_featured as "restaurant.isFeatured",
             r.print_credits as "restaurant.printCredits", 
             r.sms_credits as "restaurant.smsCredits",
             r.created_at as "restaurant.createdAt"
      FROM offers o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.active = true
      ORDER BY o.created_at DESC
      LIMIT 50
    `;
    
    const result = await db.query(sql);
    
    // Transform flat result into nested structure
    const offers = result.rows.map(row => {
      const offer = {
        id: row.id,
        restaurantId: row.restaurantId,
        title: row.title,
        description: row.description,
        active: row.active,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
        restaurant: {
          id: row['restaurant.id'],
          ownerId: row['restaurant.ownerId'],
          name: row['restaurant.name'],
          description: row['restaurant.description'],
          address: row['restaurant.address'],
          city: row['restaurant.city'],
          zip: row['restaurant.zip'],
          cuisine: row['restaurant.cuisine'],
          phone: row['restaurant.phone'],
          website: row['restaurant.website'],
          logoUrl: row['restaurant.logoUrl'],
          heroImageUrl: row['restaurant.heroImageUrl'],
          subscriptionTier: row['restaurant.subscriptionTier'],
          isFeatured: row['restaurant.isFeatured'],
          printCredits: row['restaurant.printCredits'],
          smsCredits: row['restaurant.smsCredits'],
          createdAt: row['restaurant.createdAt']
        }
      };
      return offer;
    });
    
    return {
      statusCode: 200,
      body: offers
    };
  } catch (error) {
    console.error('Error fetching offers:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching offers' }
    };
  }
}

async function handleAdminStats() {
  const db = getDbPool();
  
  try {
    const [restaurants, patrons, offers] = await Promise.all([
      db.query('SELECT COUNT(*) FROM restaurants'),
      db.query('SELECT COUNT(*) FROM patrons'),
      db.query('SELECT COUNT(*) FROM offers')
    ]);
    
    return {
      statusCode: 200,
      body: {
        totalRestaurants: parseInt(restaurants.rows[0].count),
        totalPatrons: parseInt(patrons.rows[0].count),
        totalOffers: parseInt(offers.rows[0].count)
      }
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching stats' }
    };
  }
}

async function handleLogout() {
  return {
    statusCode: 200,
    body: { message: "Demo logout successful" }
  };
}