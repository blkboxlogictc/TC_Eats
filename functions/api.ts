import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Import demo storage instead of database
import { DemoStorage, DEMO_OWNER_ID } from "../server/demo-storage";

const storage = new DemoStorage();

// Demo user for authentication
const DEMO_USER = {
  id: DEMO_OWNER_ID,
  email: "owner@thetwistedtuna.com",
  firstName: "Sarah",
  lastName: "Johnson",
  claims: {
    sub: DEMO_OWNER_ID,
    email: "owner@thetwistedtuna.com",
    first_name: "Sarah",
    last_name: "Johnson"
  }
};

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
    console.log('Demo Mode: Using hardcoded data');

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
    } else if (path === '/login' && method === 'GET') {
      result = await handleLogin();
    } else if (path === '/logout' && method === 'GET') {
      result = await handleLogout();
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
    } else if (path === '/patrons' && method === 'POST') {
      result = await handleCreatePatron(body);
    } else if (path.match(/^\/restaurants\/\d+\/offers$/) && method === 'POST') {
      const restaurantId = parseInt(path.split('/')[2]);
      result = await handleCreateOffer(restaurantId, body);
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

// Route handlers using demo storage

async function handleAuth() {
  return {
    statusCode: 200,
    body: DEMO_USER
  };
}

async function handleLogin() {
  return {
    statusCode: 200,
    body: { message: "Demo login successful", user: DEMO_USER }
  };
}

async function handleLogout() {
  return {
    statusCode: 200,
    body: { message: "Demo logout successful" }
  };
}

async function handleRestaurants(query: any) {
  try {
    const restaurants = await storage.getRestaurants({
      search: query.search,
      cuisine: query.cuisine,
      city: query.city
    });
    
    return {
      statusCode: 200,
      body: restaurants
    };
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return {
      statusCode: 500,
      body: { message: 'Failed to fetch restaurants' }
    };
  }
}

async function handleRestaurantById(id: number) {
  try {
    const restaurant = await storage.getRestaurant(id);
    
    if (!restaurant) {
      return {
        statusCode: 404,
        body: { message: 'Restaurant not found' }
      };
    }
    
    return {
      statusCode: 200,
      body: restaurant
    };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return {
      statusCode: 500,
      body: { message: 'Failed to fetch restaurant' }
    };
  }
}

async function handleMyRestaurant() {
  try {
    const restaurant = await storage.getRestaurantByOwnerId(DEMO_OWNER_ID);
    
    return {
      statusCode: 200,
      body: restaurant || null
    };
  } catch (error) {
    console.error('Error fetching my restaurant:', error);
    return {
      statusCode: 500,
      body: { message: 'Failed to fetch restaurant' }
    };
  }
}

async function handleOffers() {
  try {
    const offers = await storage.getOffers();
    
    return {
      statusCode: 200,
      body: offers
    };
  } catch (error) {
    console.error('Error fetching offers:', error);
    return {
      statusCode: 500,
      body: { message: 'Failed to fetch offers' }
    };
  }
}

async function handleAdminStats() {
  try {
    const stats = await storage.getStats();
    
    return {
      statusCode: 200,
      body: stats
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      statusCode: 500,
      body: { message: 'Failed to fetch stats' }
    };
  }
}

async function handleCreatePatron(body: any) {
  try {
    // Validate required fields
    if (!body.phone) {
      return {
        statusCode: 400,
        body: { message: 'Phone number is required' }
      };
    }

    // Add terms accepted validation
    if (!body.termsAccepted) {
      return {
        statusCode: 400,
        body: { message: 'You must accept the terms' }
      };
    }

    const patron = await storage.createPatron(body);
    
    return {
      statusCode: 201,
      body: patron
    };
  } catch (error) {
    console.error('Error creating patron:', error);
    
    if (error instanceof Error && error.message.includes("already registered")) {
      return {
        statusCode: 400,
        body: { message: "This phone number is already registered." }
      };
    }
    
    return {
      statusCode: 500,
      body: { message: 'Failed to create patron' }
    };
  }
}

async function handleCreateOffer(restaurantId: number, body: any) {
  try {
    // Verify restaurant exists and is owned by demo user
    const restaurant = await storage.getRestaurant(restaurantId);
    if (!restaurant) {
      return {
        statusCode: 404,
        body: { message: 'Restaurant not found' }
      };
    }

    if (restaurant.ownerId !== DEMO_OWNER_ID) {
      return {
        statusCode: 401,
        body: { message: 'Not authorized' }
      };
    }

    // Validate required fields
    if (!body.title || !body.description) {
      return {
        statusCode: 400,
        body: { message: 'Title and description are required' }
      };
    }

    const offer = await storage.createOffer({ 
      ...body, 
      restaurantId 
    });
    
    return {
      statusCode: 201,
      body: offer
    };
  } catch (error) {
    console.error('Error creating offer:', error);
    return {
      statusCode: 500,
      body: { message: 'Failed to create offer' }
    };
  }
}