# Vercel Configuration & Optimization

## `vercel.json` (Optional but Recommended)

Create a `vercel.json` file in your project root for advanced configuration:

```json
{
  "name": "blog-platform",
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "public": true,
  "env": {
    "DATABASE_URL": "@DATABASE_URL",
    "JWT_SECRET": "@JWT_SECRET",
    "TOKEN_EXPIRATION": "@TOKEN_EXPIRATION",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME": "@NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET": "@NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
  },
  "regions": ["sfo1", "sin1", "hnd1"],
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/blog",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

---

## Production Environment Variables

**Set in Vercel Dashboard → Settings → Environment Variables**

### Required Variables

```env
# Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-holy-scene...neon.tech/neondb?sslmode=require&channel_binding=require

# Authentication
JWT_SECRET=5e0e8cfbf1e1c6a3d85a5f7daa184ee9d4ba2c5a20663c1ea813be0b3b7ab720
TOKEN_EXPIRATION=1d

# Image Upload (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image
```

### Optional Variables

```env
# Sentry Error Tracking (optional)
SENTRY_DSN=your_sentry_dsn

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA_YOUR_ID

# API Configuration
NODE_ENV=production
```

---

## Pre-Deployment Checklist

### Code Quality

```bash
# Run linter
npm run lint

# Build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Performance Optimization

**next.config.ts:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack for faster builds
  experimental: {
    turbopack: true,
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Compress assets
  compress: true,

  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
```

---

## Deployment Workflow

### 1. Local Development → GitHub

```bash
# Make changes locally
npm run dev

# Test changes
npm run build

# Commit and push
git add .
git commit -m "feature: add new feature"
git push origin main
```

### 2. GitHub → Vercel (Automatic)

- Vercel detects push to `main`
- Triggers automatic build and deployment
- Creates production deployment (~5-10 minutes)

### 3. Monitor Deployment

In Vercel Dashboard:

- Check **Deployments** tab
- View build logs
- Monitor **Analytics**

---

## Security Best Practices

### 1. Secrets Management

✅ **DO:**

- Store sensitive values in Vercel environment variables
- Use `@` prefix in `vercel.json` to reference secrets
- Rotate JWT_SECRET periodically

❌ **DON'T:**

- Commit `.env` files to GitHub
- Expose secrets in client-side code (unless NEXT*PUBLIC*)
- Use weak JWT secrets

### 2. Database Security

✅ **DO:**

- Use SSL/TLS connections (Neon requires it)
- Restrict database access by IP (if possible)
- Monitor database activity
- Regular backups

❌ **DON'T:**

- Expose DATABASE_URL in client code
- Use weak database passwords
- Leave debug mode enabled in production

### 3. API Security

✅ **DO:**

- Validate all user inputs
- Use rate limiting on API routes
- Enable CORS headers properly
- Hash passwords (using bcryptjs ✅)

❌ **DON'T:**

- Trust client-side validation alone
- Expose internal error details
- Log sensitive data

---

## Performance Monitoring

### Vercel Analytics

1. **Enable in Dashboard:**

   - Settings → Analytics → Enable Web Analytics

2. **Track Core Web Vitals:**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

### Optimize Performance

**Next.js Built-in Features:**

- ✅ Image Optimization (next/image)
- ✅ Automatic Code Splitting
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ API Route Compression

---

## Rollback Procedure

If deployment breaks:

1. **Go to Deployments tab** in Vercel
2. **Find last working deployment**
3. **Click "Promote to Production"**
4. **Instant rollback** (less than 1 minute)

---

## Domain Configuration

### Add Custom Domain

1. **Settings → Domains**
2. **Add Domain**
3. **Update DNS Records:**

```
CNAME: blog.yourdomain.com → cname.vercel-dns.com
```

4. **Wait for DNS propagation** (5 minutes - 48 hours)

---

## CI/CD Configuration

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

---

## Troubleshooting

### Build Failed: "Module not found"

```bash
# Solution: Reinstall dependencies locally
rm -rf node_modules
npm install
npm run build
```

### Database Connection Timeout

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

- Verify DATABASE_URL in Vercel settings
- Check Neon database status
- Verify firewall/network settings

### TypeScript Compilation Error

```bash
# Find the error locally
npx tsc --noEmit

# Fix and retry
npm run build
```

---

## Monitoring & Alerts

### Set Up Email Alerts

In Vercel Settings:

- **Notifications** → Enable email alerts
- Get notified of:
  - Deployment successes/failures
  - High error rates
  - Performance issues

### Third-Party Monitoring

Consider adding:

- **Sentry:** Error tracking and monitoring
- **LogRocket:** Session replay and logging
- **New Relic:** Application performance monitoring

---

## Cost Optimization

### Vercel Pricing

- **Hobby (Free):** Perfect for blog platform
  - 1 concurrent build
  - 100GB bandwidth/month
  - Unlimited deployments
- **Pro ($20/month):** For scaling
  - 3 concurrent builds
  - 1TB bandwidth/month
  - Priority support

### Cost Saving Tips

✅ Use preview deployments instead of staging environment
✅ Leverage caching headers
✅ Optimize image sizes before upload
✅ Use Cloudinary for images (not Vercel storage)

---

## Maintenance

### Monthly Checks

- [ ] Review analytics dashboard
- [ ] Check error rates
- [ ] Update dependencies: `npm outdated`
- [ ] Test critical user flows
- [ ] Review database usage (Neon)

### Quarterly Tasks

- [ ] Rotate JWT_SECRET
- [ ] Review security headers
- [ ] Update Node.js version if needed
- [ ] Performance optimization review

---

## Resources

- 📖 **Vercel Documentation:** https://vercel.com/docs
- 📖 **Next.js Documentation:** https://nextjs.org/docs
- 📖 **Environment Variables:** https://vercel.com/docs/projects/environment-variables
- 📖 **Custom Domains:** https://vercel.com/docs/custom-domains
- 📖 **Analytics:** https://vercel.com/docs/analytics

---

**Your deployment is now production-ready! 🚀**
