# Treasure Coast Restaurants MVP

## Overview

A local restaurant discovery and marketing platform for the Treasure Coast region (Stuart to Vero Beach, Florida). The application enables restaurant listings, patron opt-in for SMS/email offers, tiered restaurant subscriptions, and admin dashboards. Built as a full-stack TypeScript application with React frontend and Express backend, designed for immediate usability with future extensibility for mobile apps and additional marketing channels.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom coastal-themed color palette (deep ocean blue primary, golden sand accent)
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Animations**: Framer Motion for page transitions and scroll animations

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in shared route contracts (`shared/routes.ts`)
- **Authentication**: Replit Auth integration using OpenID Connect with Passport.js
- **Session Management**: Express sessions stored in PostgreSQL via connect-pg-simple

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`migrations/` directory)

### Key Data Models
- **Restaurants**: Core listing entity with subscription tiers (free/silver/gold/platinum), owner relationship, and credit tracking
- **Offers**: Time-limited promotions linked to restaurants
- **Patrons**: SMS opt-in subscribers with cuisine preferences
- **SMS Campaigns**: Admin-created marketing messages
- **Users/Sessions**: Replit Auth managed authentication tables

### Shared Code Strategy
- `shared/` directory contains code used by both frontend and backend
- Route contracts (`shared/routes.ts`) define API endpoints with Zod schemas for type-safe request/response handling
- Schema definitions shared between ORM and frontend validation

### Build System
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Build script bundles common dependencies to reduce cold start times

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Passport.js**: Authentication middleware with OIDC strategy
- Required environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### UI Framework Dependencies
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **shadcn/ui**: Pre-built component library configured in `components.json`
- **Tailwind CSS**: Utility-first styling with custom theme extensions

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-zod`: Database ORM and validation
- `react-hook-form`: Form state management
- `framer-motion`: Animation library
- `wouter`: Lightweight routing
- `date-fns`: Date formatting utilities