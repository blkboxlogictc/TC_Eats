import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

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
    // Initialize Neon serverless connection
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const sql = neon(process.env.DATABASE_URL);

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
      result = await handleRestaurants(sql, query);
    } else if (path.match(/^\/restaurants\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/')[2]);
      result = await handleRestaurantById(sql, id);
    } else if (path === '/my-restaurant' && method === 'GET') {
      result = await handleMyRestaurant();
    } else if (path === '/offers' && method === 'GET') {
      result = await handleOffers(sql);
    } else if (path === '/admin/stats' && method === 'GET') {
      result = await handleAdminStats(sql);
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

async function handleRestaurants(sql: any, query: any) {
  try {
    let sqlQuery = `
      SELECT id, owner_id as "ownerId", name, description, address, city, zip, 
             cuisine, phone, website, logo_url as "logoUrl", hero_image_url as "heroImageUrl",
             subscription_tier as "subscriptionTier", is_featured as "isFeatured", 
             print_credits as "printCredits", sms_credits as "smsCredits", 
             created_at as "createdAt"
      FROM restaurants 
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let conditions: string[] = [];
    
    if (query.search) {
      conditions.push(`name ILIKE '%${query.search}%'`);
    }
    
    if (query.cuisine) {
      conditions.push(`cuisine ILIKE '%${query.cuisine}%'`);
    }
    
    if (query.city) {
      conditions.push(`city ILIKE '%${query.city}%'`);
    }
    
    if (conditions.length > 0) {
      sqlQuery += ' AND ' + conditions.join(' AND ');
    }
    
    sqlQuery += ` ORDER BY is_featured DESC, name`;
    
    const result = await sql(sqlQuery);
    
    return {
      statusCode: 200,
      body: result
    };
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching restaurants' }
    };
  }
}

async function handleRestaurantById(sql: any, id: number) {
  try {
    const restaurantQuery = `
      SELECT id, owner_id as "ownerId", name, description, address, city, zip, 
             cuisine, phone, website, logo_url as "logoUrl", hero_image_url as "heroImageUrl",
             subscription_tier as "subscriptionTier", is_featured as "isFeatured", 
             print_credits as "printCredits", sms_credits as "smsCredits", 
             created_at as "createdAt"
      FROM restaurants 
      WHERE id = ${id}
    `;
    
    const offersQuery = `
      SELECT id, restaurant_id as "restaurantId", title, description, active, 
             expires_at as "expiresAt", created_at as "createdAt"
      FROM offers 
      WHERE restaurant_id = ${id}
    `;
    
    const [restaurantResult, offersResult] = await Promise.all([
      sql(restaurantQuery),
      sql(offersQuery)
    ]);
    
    if (restaurantResult.length === 0) {
      return {
        statusCode: 404,
        body: { message: "Restaurant not found" }
      };
    }
    
    const restaurant = restaurantResult[0];
    restaurant.offers = offersResult;
    
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

async function handleOffers(sql: any) {
  try {
    const sqlQuery = `
      SELECT o.id, o.restaurant_id as "restaurantId", o.title, o.description, 
             o.active, o.expires_at as "expiresAt", o.created_at as "createdAt",
             json_build_object(
               'id', r.id,
               'ownerId', r.owner_id,
               'name', r.name,
               'description', r.description,
               'address', r.address,
               'city', r.city,
               'zip', r.zip,
               'cuisine', r.cuisine,
               'phone', r.phone,
               'website', r.website,
               'logoUrl', r.logo_url,
               'heroImageUrl', r.hero_image_url,
               'subscriptionTier', r.subscription_tier,
               'isFeatured', r.is_featured,
               'printCredits', r.print_credits,
               'smsCredits', r.sms_credits,
               'createdAt', r.created_at
             ) as restaurant
      FROM offers o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.active = true
      ORDER BY o.created_at DESC
      LIMIT 50
    `;
    
    const result = await sql(sqlQuery);
    
    return {
      statusCode: 200,
      body: result
    };
  } catch (error) {
    console.error('Error fetching offers:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching offers' }
    };
  }
}

async function handleAdminStats(sql: any) {
  try {
    const [restaurants, patrons, offers] = await Promise.all([
      sql('SELECT COUNT(*) FROM restaurants'),
      sql('SELECT COUNT(*) FROM patrons'),
      sql('SELECT COUNT(*) FROM offers')
    ]);
    
    return {
      statusCode: 200,
      body: {
        totalRestaurants: parseInt(restaurants[0].count),
        totalPatrons: parseInt(patrons[0].count),
        totalOffers: parseInt(offers[0].count)
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