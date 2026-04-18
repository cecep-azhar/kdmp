# Deployment Guide - KDMP (Koperasi Desa Merah Putih)

## Prerequisites

1. **Node.js 20.9+** installed
2. **Cloudflare Account** with Pages enabled
3. **PostgreSQL Database** (Cloudflare doesn't natively support Postgres, see options below)

### Database Options for Cloudflare

Since Cloudflare Workers/Pages doesn't natively support PostgreSQL, use one of these providers:

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| [Neon](https://neon.tech) | 0.5 GB storage, 1 project | Serverless Postgres, best for Cloudflare |
| [Supabase](https://supabase.com) | 500 MB database | Has additional features like Auth |
| [Railway](https://railway.app) | $5 free credits | Simple deployment |
| [Neon.tech](https://neon.tech) | Serverless | Recommended for this app |

## Step 1: Set Up Database

1. Create an account at [Neon](https://neon.tech) (recommended)
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/kdmp`)

## Step 2: Configure Environment Variables

In your Cloudflare Pages dashboard, set these environment variables:

### Required
```
DATABASE_URL=postgresql://user:password@your-neon-endpoint/kdmp
PAYLOAD_SECRET=generate-a-random-32-character-string
NEXT_PUBLIC_APP_URL=https://your-app.pages.dev
```

### Optional (for S3/R2 storage)
```
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=ap-southeast-1
S3_ENDPOINT=https://your-s3-endpoint.com
```

### For Cloudflare R2 (S3-compatible, cheaper)
```
S3_BUCKET=your-r2-bucket
S3_ACCESS_KEY_ID=your-r2-access-key
S3_SECRET_ACCESS_KEY=your-r2-secret-key
S3_REGION=auto
S3_ENDPOINT=https://abc123.r2.cloudflarestorage.com
```

## Step 3: Deploy to Cloudflare Pages

### Option A: Via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Connect your GitHub repository
4. Configure build settings:
   - **Project name:** `kdmp`
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
5. Add environment variables from Step 2
6. Click **Deploy**

### Option B: Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .next
```

## Step 4: Initialize the Database

After deployment, you need to seed the Chart of Accounts and create an admin user:

1. **Seed COA (Chart of Accounts):**
   ```bash
   npx tsx src/seed/coa.ts
   ```

2. **Create Admin User:**
   ```bash
   npx tsx create-admin.ts
   ```
   Or use the `/api/init-admin` endpoint after deployment.

3. **Seed 16 Buku (optional):**
   Visit `/api/seed-16buku` to seed additional data.

## Step 5: Configure Custom Domain (Optional)

1. In Cloudflare Pages settings, go to **Custom domains**
2. Add your domain (e.g., `koperasi.desa.id`)
3. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Troubleshooting

### "Connection refused" errors
- Verify `DATABASE_URL` is correctly set in Cloudflare Pages environment variables
- Ensure your Neon/Postgres project is active (not paused)

### Build failures
- Check that `NEXT_PUBLIC_APP_URL` is set
- Verify all required environment variables are present

### Payload Admin not loading
- Check `PAYLOAD_SECRET` is set (must be 32+ characters)
- Verify `DATABASE_URL` is accessible from Cloudflare Pages

## Important Notes

1. **Payoload CMS v3 requires Postgres** - SQLite (D1) is NOT supported
2. **Media storage** - The app uses `@payloadcms/storage-s3` which supports Cloudflare R2
3. **SHARP** - The `sharp` package is used for image processing and works on Cloudflare Pages

## Quick Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit

# Deploy to Cloudflare
wrangler pages deploy .next
```

## Useful Links

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Neon Database Docs](https://neon.tech/docs)
