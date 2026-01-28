# 🚀 Netlify Deployment Guide

Your TC Eats project is fully prepared for Netlify deployment with all demo data!

## Pre-Deployment Checklist

- ✅ Netlify Functions configured
- ✅ Build scripts optimized
- ✅ Demo data exported
- ✅ Migration scripts ready
- ✅ Favicon updated (TC Lifestyle logo)
- ✅ Environment configuration prepared

## Step-by-Step Deployment

### 1. Set Up Database (Required First!)

Follow the [`DATABASE_SETUP.md`](DATABASE_SETUP.md) guide to:
- Create Neon PostgreSQL database
- Get your connection string
- Run database migration with demo data

Quick commands after setting up Neon:
```bash
# Set your database URL
export DATABASE_URL="postgresql://your-neon-connection-string"

# Set up database with demo data
npm run db:setup
```

### 2. Deploy to Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect GitHub account (blkboxlogictc)
   - Import `TC_Eats` repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `dist/functions`

3. **Set Environment Variables**
   In Netlify Dashboard → Site Settings → Environment Variables:
   ```
   DATABASE_URL = your-neon-postgresql-connection-string
   NODE_ENV = production
   SESSION_SECRET = generate-a-strong-random-secret
   ```

4. **Deploy**
   - Click "Deploy Site"
   - Wait for build to complete

## What You Get

Your deployed site will have:
- 🏪 All 8 TC area restaurants with full details
- 🎯 Special offers and promotions
- 🗺️ Interactive map functionality
- 📱 Responsive design
- ⚡ Serverless API functions
- 🔍 Working search and filters

## Verification

After deployment, verify:
- [ ] Site loads at your Netlify URL
- [ ] Restaurant directory shows all 8 locations
- [ ] Offers page displays current promotions
- [ ] Search functionality works
- [ ] Map displays restaurant locations

## Troubleshooting

**Build Fails**: Check environment variables are set
**API Errors**: Verify DATABASE_URL is correct
**No Data**: Ensure migration was run successfully

## Updates

To update demo data:
1. Modify local database
2. Run `npm run db:export`
3. Commit changes
4. Netlify will rebuild automatically

Your TC Eats demo is now live! 🎉