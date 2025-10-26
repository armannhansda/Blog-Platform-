# 🔄 Quick Database Change Guide

## Current Setup

Your current database connection in `.env.local`:

```
DATABASE_URL=postgresql://neondb_owner:npg_yXs4LQO0wSxv@ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech/blogplatform?sslmode=require&channel_binding=require
```

Breaking it down:

- **Type:** PostgreSQL
- **Host:** ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech
- **User:** neondb_owner
- **Password:** npg_yXs4LQO0wSxv
- **Database:** blogplatform
- **Region:** Asia Pacific (Singapore)
- **SSL:** Required

---

## 🚀 How to Change

### For Local PostgreSQL:

1. Install PostgreSQL: https://www.postgresql.org/download/windows/
2. Open `.env.local` in editor
3. Replace DATABASE_URL with:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/blog_platform
   ```
4. Save file
5. Run: `node push-schema.mjs`
6. Run: `npm run dev`

### For Neon (Different Project):

1. Go to https://console.neon.tech
2. Copy your connection string
3. Edit `.env.local`
4. Replace DATABASE_URL with your string
5. Save and run: `node push-schema.mjs`

### For Other Providers (Railway, Supabase, AWS):

- Get connection string from their dashboard
- Same format: `postgresql://user:password@host:port/db`
- Edit `.env.local`
- Replace DATABASE_URL
- Run: `node push-schema.mjs`

---

## ⚠️ After Changing Database

ALWAYS run these commands:

```bash
# Create tables in new database
node push-schema.mjs

# Add sample data (optional)
node seed-database.mjs

# Verify connection
node investigate-db.mjs

# Start server
npm run dev
```

---

## 📂 Files You'll Edit

**File:** `.env.local`

```
Location: c:\Users\BIT\Desktop\Blogging Plateform\blog-platform\.env.local
Change: The DATABASE_URL line
```

---

## ✅ Verify It Works

After making changes, run:

```bash
node investigate-db.mjs
```

You should see:

```
✅ Connected successfully!
📊 Tables in database:
   📋 posts: X rows
   📋 users: X rows
   📋 categories: X rows
```

That's it! The database is now changed.
