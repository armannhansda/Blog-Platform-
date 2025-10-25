# Deploying Blog Platform to Vercel 🚀

This guide will help you deploy your Blog Platform to Vercel in just a few minutes.

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - You'll need a hosted PostgreSQL instance (we'll use Neon DB as it's free and easy)

---

## Step 1: Prepare Your Project

### 1.1 Clean Up Git Repository

```bash
# Navigate to your project
cd "Blog Platform/blog-platform"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Blog Platform"
```

### 1.2 Create `.gitignore` File

Make sure these files are ignored:

```
node_modules/
.next/
.env
.env.local
.env.*.local
dist/
*.log
.DS_Store
.vscode/
```

---

## Step 2: Set Up PostgreSQL Database (Neon DB - FREE)

### 2.1 Create Neon DB Account

1. Go to [neon.tech](https://neon.tech)
2. Click "Sign up"
3. Sign up with GitHub (easiest option)
4. Create a new project

### 2.2 Get Database Connection String

1. In Neon Dashboard, go to "Connection string"
2. Select "Node.js" from dropdown
3. Copy the connection string (it looks like: `postgresql://user:password@host/database`)
4. **Save this** - you'll need it later!

### 2.3 Initialize Database Schema

Run this locally to set up your tables:

```bash
# Make sure DATABASE_URL is set in .env.local
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

---

## Step 3: Push to GitHub

### 3.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `blog-platform`
3. **Do NOT** initialize with README (you already have files)

### 3.2 Push Your Code

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/blog-platform.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 4: Deploy on Vercel

### 4.1 Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL or select from list
5. Click "Import"

### 4.2 Configure Environment Variables

On the "Configure Project" page:

**Add these environment variables:**

```
DATABASE_URL = postgresql://user:password@host/database
JWT_SECRET = your_super_secret_key_min_32_chars
NODE_ENV = production
```

**How to generate JWT_SECRET:**

```bash
# Run this in terminal to generate a secure key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.3 Build Settings

Make sure these are set:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4.4 Deploy

Click "Deploy" and wait for the build to complete (usually 2-5 minutes).

**You'll see:**
- ✅ Build succeeds
- ✅ Deployment URL is assigned
- ✅ Your site is live!

---

## Step 5: Post-Deployment Setup

### 5.1 Update Environment Variables in Production

1. Go to your project in Vercel Dashboard
2. Go to "Settings" → "Environment Variables"
3. Verify all variables are set correctly

### 5.2 Initialize Database on Production

If database is new, you need to initialize it:

```bash
# In your local terminal, with DATABASE_URL pointing to production DB
npm run db:push
npm run db:seed
```

Or use Neon Studio to manage your production database directly.

### 5.3 Test Your Deployment

1. Visit your Vercel deployment URL
2. Test creating an account
3. Test creating a blog post
4. Test viewing posts
5. Test all features

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. Go to Vercel Project → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update DNS records at your domain registrar

---

## Troubleshooting

### Build Fails: "DATABASE_URL not set"

**Solution:**
- Go to Vercel Dashboard
- Settings → Environment Variables
- Make sure `DATABASE_URL` is set
- Redeploy

### Posts Not Loading

**Solution:**
- Check if database is initialized: `npm run db:push`
- Check environment variable is correct
- Check PostgreSQL database credentials

### JWT Errors on Login

**Solution:**
- Verify `JWT_SECRET` is set in Vercel environment variables
- Make sure `JWT_SECRET` is same as local development (if you had one)
- The secret must be at least 32 characters

### "Cannot find module" Errors

**Solution:**
- Delete `node_modules` folder
- Run `npm install`
- Commit and push changes
- Trigger redeploy in Vercel

### Database Connection Timeout

**Solution:**
- Check if Neon DB is up and running
- Verify PostgreSQL connection string is correct
- Check if your IP/Vercel is whitelisted (Neon allows all by default)

---

## Monitoring & Logs

### View Deployment Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on specific deployment
5. Click "Logs" to see build and runtime logs

### Monitor Database

1. Go to [neon.tech](https://neon.tech)
2. View query insights
3. Monitor connection pool usage

---

## Next Steps

After deployment:

1. **Share your URL** - Get feedback from friends
2. **Add custom domain** - Make it professional
3. **Set up analytics** - Use Vercel Analytics
4. **Enable automatic deployments** - Push to main branch = auto deploy
5. **Add HTTPS** - Vercel does this automatically ✅

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Test production build locally
npm run build && npm start

# Database management
npm run db:push        # Sync schema
npm run db:seed        # Add sample data
npm run db:studio      # Open database UI

# View deployed logs
vercel logs [project-name]
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Neon DB Docs**: https://neon.tech/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**Congratulations! Your Blog Platform is now live on Vercel! 🎉**

For questions or issues, check the troubleshooting section above or consult the official documentation.
