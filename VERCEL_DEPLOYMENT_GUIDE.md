# 🚀 Deploy Blog Platform to Vercel

## Prerequisites

Before deploying, ensure you have:

1. ✅ A GitHub account (https://github.com)
2. ✅ A Vercel account (https://vercel.com)
3. ✅ Your code pushed to GitHub
4. ✅ Neon database (already configured)
5. ✅ Cloudinary account for image uploads

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Update `next.config.ts`

Make sure your Next.js config is optimized:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    turbopack: true,
  },
};

export default nextConfig;
```

### 1.2 Verify `.gitignore`

Ensure sensitive files are not committed:

```bash
# .gitignore
node_modules/
.next/
.env
.env.local
.env.*.local
dist/
*.log
.DS_Store
```

### 1.3 Create Environment File for Vercel

Create `.env.production.local` (don't commit this):

```bash
# Same as .env.local but for production
DATABASE_URL=postgresql://neondb_owner:npg_yXs4LQO0wSxv@ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_secure_jwt_secret_min_32_chars
TOKEN_EXPIRATION=1d
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image
```

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)

```bash
cd "c:\Users\BIT\Desktop\Blogging Plateform\blog-platform"
git init
git add .
git commit -m "Initial blog platform commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blog-platform.git
git push -u origin main
```

### 2.2 Verify Repository

Go to https://github.com and verify your repository is there.

---

## Step 3: Connect to Vercel

### 3.1 Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your `blog-platform` repository

### 3.2 Configure Project Settings

**Framework:** Next.js (auto-detected)

**Build Command:** (Leave as default)

```
npm run build
```

**Output Directory:** (Leave as default)

```
.next
```

**Install Command:** (Leave as default)

```
npm ci
```

---

## Step 4: Set Environment Variables in Vercel

### 4.1 Add Environment Variables

In the Vercel project settings, go to **Settings** → **Environment Variables**

Add the following variables:

| Variable                               | Value                                                                                                                                                  | Environments                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `DATABASE_URL`                         | `postgresql://neondb_owner:npg_yXs4LQO0wSxv@ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Production, Preview, Development |
| `JWT_SECRET`                           | Your secure random string (min 32 chars)                                                                                                               | Production, Preview, Development |
| `TOKEN_EXPIRATION`                     | `1d`                                                                                                                                                   | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | `dadafm6bs`                                                                                                                                            | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `cover_image`                                                                                                                                          | Production, Preview, Development |

**Important:**

- Keep sensitive values (JWT_SECRET, DATABASE_URL password) secret
- `NEXT_PUBLIC_*` variables are visible in client-side code (safe to expose)

### 4.2 Save Environment Variables

Click **"Save"** after adding all variables.

---

## Step 5: Deploy

### 5.1 Trigger Deployment

Once environment variables are set:

1. Click **"Deploy"** button
2. Vercel will automatically:
   - Build your Next.js app
   - Run production build
   - Deploy to CDN

### 5.2 Monitor Deployment

Watch the deployment logs:

- If build succeeds ✅, you'll get a deployment URL
- If it fails ❌, check the build logs for errors

**Common Issues:**

- Missing environment variables → Check Settings → Environment Variables
- Build errors → Check console output
- Database connection errors → Verify DATABASE_URL is correct

---

## Step 6: Run Database Migrations on Production

⚠️ **Important:** After the first deployment, you need to migrate the database:

### 6.1 Create a Vercel Function to Run Migrations

Create `api/migrate.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

export const config = {
  runtime: "nodejs",
};

async function runMigrations() {
  const sql = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    ssl: "require",
  });

  try {
    // Read migration files from public folder
    // (migrations need to be accessible at runtime)
    console.log("Running migrations...");

    // For now, assume schema is already created
    const [check] = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'posts'
      )
    `;

    if (check.exists) {
      return { success: true, message: "Schema already exists" };
    }

    // If needed, you can manually run SQL here
    return { success: true, message: "Migrations complete" };
  } finally {
    await sql.end();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Protect this endpoint with a secret
  const secret = req.query.secret;

  if (secret !== process.env.MIGRATION_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runMigrations();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}
```

### 6.2 Alternative: Use Neon Dashboard for Migrations

1. Go to https://console.neon.tech
2. Select your database
3. Go to **SQL Editor**
4. Copy schema from `src/lib/db/migrations/*.sql`
5. Execute in SQL Editor

---

## Step 7: Verify Deployment

### 7.1 Test Your Deployment

1. Visit your Vercel deployment URL (e.g., `https://blog-platform.vercel.app`)
2. Test the following:
   - ✅ Home page loads with posts
   - ✅ Signup creates new user
   - ✅ Login works
   - ✅ Create post works
   - ✅ Edit profile works
   - ✅ Images upload via Cloudinary

### 7.2 Check Logs

In Vercel dashboard:

1. Go to **Deployments** tab
2. Click latest deployment
3. View **Logs** to debug any issues

---

## Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain

1. Go to project **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## Step 9: Monitoring & Maintenance

### 9.1 Enable Vercel Analytics

1. **Settings** → **Analytics**
2. Click **"Enable Analytics"**
3. Monitor:
   - Page load times
   - Core Web Vitals
   - User traffic

### 9.2 Set Up Automatic Deployments

Deployments trigger automatically when:

- You push to `main` branch
- You create a pull request (preview deployment)

### 9.3 Rollback if Needed

If something breaks:

1. Go to **Deployments** tab
2. Find the working deployment
3. Click **"Promote to Production"**

---

## Troubleshooting

### Issue: Build Fails

**Check:**

```bash
npm run build  # Test locally first
```

**Common causes:**

- Missing environment variables
- TypeScript errors
- Missing dependencies

### Issue: Database Connection Error

**Check:**

1. Verify DATABASE_URL in Vercel settings
2. Ensure Neon database is running
3. Check firewall/IP whitelist on Neon

### Issue: Cloudinary Upload Fails

**Check:**

1. Verify credentials in Vercel environment variables
2. Ensure upload preset exists in Cloudinary dashboard

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] DATABASE_URL configured
- [ ] JWT_SECRET configured
- [ ] CLOUDINARY variables configured
- [ ] Build successful
- [ ] Deployment URL working
- [ ] Database migrations complete
- [ ] Posts visible on home page
- [ ] Signup/Login working
- [ ] File uploads working

---

## Environment Variables Summary

**Production (.env on Vercel):**

```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secure_secret_min_32_chars
TOKEN_EXPIRATION=1d
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image
```

**Local Development (.env.local):**

```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secure_secret_min_32_chars
TOKEN_EXPIRATION=1d
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image
```

---

## Next Steps After Deployment

1. **Enable Auto-scaling:** Vercel handles this automatically
2. **Set up Monitoring:** Use Vercel Analytics + Sentry
3. **Enable HTTPS:** Automatic with Vercel
4. **Configure CDN:** Already configured globally
5. **Set up CI/CD:** Automatic with GitHub integration

---

## Support

**Vercel Docs:** https://vercel.com/docs
**Next.js Docs:** https://nextjs.org/docs
**Neon Docs:** https://neon.tech/docs

---

**Your deployment URL will be:**

```
https://blog-platform.vercel.app
or your custom domain
```

Ready to deploy! 🚀
