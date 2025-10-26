# Quick Vercel Deployment Checklist

## ⚡ Fast Track Deployment (5 minutes)

### Step 1: Install Vercel CLI (Optional but recommended)

```bash
npm i -g vercel
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Step 3: Create Vercel Project

**Option A: Using CLI**

```bash
vercel login
vercel
```

**Option B: Using Web Dashboard**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import GitHub repository

### Step 4: Add Environment Variables in Vercel

Go to **Settings → Environment Variables** and add:

```env
DATABASE_URL=postgresql://neondb_owner:npg_yXs4LQO0wSxv@ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=use-a-strong-random-32-character-string-here
TOKEN_EXPIRATION=1d
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image
```

### Step 5: Deploy!

- If using CLI: `vercel --prod`
- If using web: Click "Deploy" button

### Step 6: Test

Visit your deployment URL and test:

- ✅ Home page loads
- ✅ Posts visible
- ✅ Signup works
- ✅ File uploads work

---

## Common Environment Variables

| Key                                    | Value                       | Purpose                       |
| -------------------------------------- | --------------------------- | ----------------------------- |
| `DATABASE_URL`                         | Your Neon connection string | PostgreSQL connection         |
| `JWT_SECRET`                           | Min 32 random characters    | Session/Auth tokens           |
| `TOKEN_EXPIRATION`                     | `1d` or `7d`                | How long tokens last          |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | `dadafm6bs`                 | Image uploads (public)        |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `cover_image`               | Upload configuration (public) |

---

## Deployment URL Format

After deployment, your app will be available at:

```
https://blog-platform.vercel.app
```

Or with a custom domain:

```
https://yourdomain.com
```

---

## Need Help?

📚 **Full Guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`
🔗 **Vercel Docs:** https://vercel.com/docs
🐘 **Neon Docs:** https://neon.tech/docs

---

## After Deployment

1. **Auto-redeploy:** Push to main branch → automatic deployment
2. **Preview URLs:** Pull requests get preview deployments
3. **Monitor:** Check Vercel dashboard for traffic and errors
4. **Custom Domain:** Add under Settings → Domains

---

✅ **All done!** Your blog platform is now live! 🎉
