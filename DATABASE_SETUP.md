# 🚀 Database Setup for Production Deployment

## Quick Setup with Neon (Recommended)

Neon is a serverless PostgreSQL service with an excellent free tier, perfect for your TC Eats demo.

### Step 1: Create Neon Account
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub (blkboxlogictc account)
3. Create a new project named "TC_Eats"

### Step 2: Get Connection String
1. In your Neon dashboard, go to "Dashboard" → "Connection Details"
2. Copy the connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Set Up Local Environment
1. Create a `.env.production` file:
   ```bash
   DATABASE_URL=your-neon-connection-string-here
   NODE_ENV=production
   SESSION_SECRET=a-very-strong-random-secret-here
   ```

### Step 4: Create Database Schema
Run this command to create the PostgreSQL tables:
```bash
# Set the production database URL
export DATABASE_URL="your-neon-connection-string"

# Generate and push schema to PostgreSQL
npm run db:push
```

### Step 5: Migrate Demo Data
Run the migration script to import all your demo restaurant data:
```bash
# Make sure DATABASE_URL is set to your Neon database
export DATABASE_URL="your-neon-connection-string"

# Run the migration
npx tsx script/migrate-to-postgres.ts
```

## Alternative: Supabase Setup

If you prefer Supabase:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Follow steps 3-5 above with your Supabase URL

## Netlify Environment Variables

Once your database is set up, add these environment variables in your Netlify dashboard:

```
DATABASE_URL=your-postgres-connection-string
NODE_ENV=production
SESSION_SECRET=your-strong-random-secret
```

## Verification

After migration, your database should contain:
- ✅ 8 Restaurants (from TC area)
- ✅ 2 Special offers
- ✅ All demo data working exactly like local development

## Troubleshooting

- **Connection issues**: Make sure SSL is enabled in connection string
- **Schema issues**: Run `npm run db:push` first
- **Data conflicts**: The migration script clears existing data first

Your TC Eats site will now work identically on Netlify as it does locally! 🎉