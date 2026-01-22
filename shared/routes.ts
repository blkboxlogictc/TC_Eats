import { z } from 'zod';
import { 
  insertRestaurantSchema, 
  insertOfferSchema, 
  insertPatronSchema, 
  insertSmsCampaignSchema,
  restaurants,
  offers,
  patrons,
  smsCampaigns
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  restaurants: {
    list: {
      method: 'GET' as const,
      path: '/api/restaurants',
      input: z.object({
        search: z.string().optional(),
        cuisine: z.string().optional(),
        city: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof restaurants.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/restaurants/:id',
      responses: {
        200: z.custom<typeof restaurants.$inferSelect & { offers: typeof offers.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/restaurants',
      input: insertRestaurantSchema,
      responses: {
        201: z.custom<typeof restaurants.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/restaurants/:id',
      input: insertRestaurantSchema.partial(),
      responses: {
        200: z.custom<typeof restaurants.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    getMyRestaurant: {
      method: 'GET' as const,
      path: '/api/my-restaurant', // For logged-in owner
      responses: {
        200: z.custom<typeof restaurants.$inferSelect | null>(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  offers: {
    listPublic: {
      method: 'GET' as const,
      path: '/api/offers',
      responses: {
        200: z.array(z.custom<typeof offers.$inferSelect & { restaurant: typeof restaurants.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/restaurants/:restaurantId/offers',
      input: insertOfferSchema,
      responses: {
        201: z.custom<typeof offers.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  patrons: {
    create: {
      method: 'POST' as const,
      path: '/api/patrons',
      input: insertPatronSchema,
      responses: {
        201: z.custom<typeof patrons.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  admin: {
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats',
      responses: {
        200: z.object({
          totalRestaurants: z.number(),
          totalPatrons: z.number(),
          totalOffers: z.number(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    sendSms: {
      method: 'POST' as const,
      path: '/api/admin/sms/send',
      input: insertSmsCampaignSchema,
      responses: {
        200: z.custom<typeof smsCampaigns.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
