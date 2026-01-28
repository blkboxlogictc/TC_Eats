# Treasure Coast Restaurants - Treasure Coast Restaurant Directory

A modern, responsive restaurant directory website for the Treasure Coast of Florida. Built with React, TypeScript, and styled with Tailwind CSS.

## Features

- **Enhanced Search & Filtering**: Advanced search with multiple filter options including location, cuisine, price range, dining types, and distance-based filtering with geolocation support
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Interactive Homepage**: Features carousel of places to discover, metrics with counting animations, latest listings, and featured restaurants
- **Professional Pages**: Fully redesigned About Us, How It Works, and Contact pages
- **Modern UI/UX**: Clean, professional design with smooth animations and transitions

## Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
├── server/                   # Backend Express.js server
├── shared/                   # Shared code between client/server
├── dist/                     # Production build output
└── netlify.toml             # Netlify configuration
```

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd treasure-coast-restaurants
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Initialize the database
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build both client and server for production
- `npm run build:static` - Build only the client for static hosting
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Deployment

### Static Site Deployment (Netlify)

This project is configured for static site deployment to Netlify:

1. **Build the static site**:
   ```bash
   npm run build:static
   ```

2. **Deploy to Netlify**:
   - The build output is in `dist/public/`
   - Netlify configuration is already set up in `netlify.toml`
   - The site will be a static React SPA with client-side routing

3. **Netlify Settings**:
   - Build command: `npm run build:static`
   - Publish directory: `dist/public`
   - Functions: Not used (static site only)

### Manual Deployment Steps

1. **Prepare the build**:
   ```bash
   npm install
   npm run build:static
   ```

2. **Deploy the `dist/public` folder** to your hosting provider
   - All necessary static files are in this directory
   - The site will work as a client-side only application
   - API calls are mocked for demo purposes

## Environment Variables

Required environment variables for development:

```bash
# Database Configuration
DATABASE_URL=file:./dev.db

# Server Configuration  
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=dev-session-secret-key

# Development placeholders
REPL_ID=dev-placeholder
ISSUER_URL=https://replit.com/oidc
```

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and state management
- **Wouter** - Lightweight client-side routing
- **Radix UI** - Accessible UI components
- **Lucide React** - Modern icon library

### Backend (Development)
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite** - Database for development
- **Drizzle ORM** - Type-safe database queries

### Build Tools
- **Vite** - Fast build tool and development server
- **esbuild** - Fast JavaScript bundler for production

## Key Features

### Homepage Enhancements
- **Enhanced Search Bar**: 3-field search with what/category/location
- **Places to Discover**: Auto-rotating carousel of dining categories
- **Metrics Section**: Animated counters showing platform statistics
- **Latest Listings**: Showcase of recently added restaurants
- **Featured Restaurants**: Highlighted top establishments

### Advanced Filtering System
- **Location-based**: County and city filtering
- **Cuisine Types**: Comprehensive cuisine categories
- **Dining Types**: Multi-select options (Catering, Delivery, Take-Out, Dine In, Drive Thru, Ghost Kitchen)
- **Price Range**: $ to $$$$ pricing filters
- **Distance**: Geolocation-based distance filtering with 1-120 mile radius
- **Real-time Search**: Instant filtering as you type

### Professional Pages
- **About Us**: Company story, values, and mission with engaging visuals
- **How It Works**: Step-by-step guide with interactive elements
- **Contact**: Professional contact form with multiple contact methods

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 2s
- Total Bundle Size: ~692KB (gzipped: ~211KB)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, contact the development team or visit our contact page.

## Demo Data

The application includes seed data for demonstration:
- 8+ sample restaurants across the Treasure Coast
- Various cuisine types and price ranges
- Sample offers and promotions
- Geographic distribution across Martin, St. Lucie, Indian River, and Palm Beach counties