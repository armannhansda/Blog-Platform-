# 🗄️ How to Change the Database

## Current Database

**Currently using:** Neon PostgreSQL (Cloud Database)

- **Host:** ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech
- **Database:** blogplatform
- **Region:** Asia Pacific (ap-southeast-1)

## 🔧 Option 1: Change to Local PostgreSQL

If you want to use a local PostgreSQL database instead:

### Step 1: Install PostgreSQL locally

- Download from: https://www.postgresql.org/download/windows/
- Install and remember your password

### Step 2: Create a database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE blog_platform;

# Create user
CREATE USER blog_user WITH PASSWORD 'your_password';

# Grant privileges
ALTER ROLE blog_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE blog_platform TO blog_user;
```

### Step 3: Update `.env.local`

Change the `DATABASE_URL` line to:

```bash
DATABASE_URL=postgresql://blog_user:your_password@localhost:5432/blog_platform
```

## 🔧 Option 2: Use Another Neon Database

If you want to use a different Neon project:

### Step 1: Go to Neon Console

- Visit: https://console.neon.tech
- Create a new project or select existing one

### Step 2: Get Connection String

- Click on your project
- Go to "Connection strings"
- Copy the "Connection string" (with pooler endpoint)

### Step 3: Update `.env.local`

```bash
DATABASE_URL=postgresql://your_user:your_password@your_host-pooler.region.aws.neon.tech/your_database?sslmode=require
```

## 🔧 Option 3: Use Another PostgreSQL Provider

Popular alternatives:

- **Railway:** https://railway.app (easy deployment)
- **Supabase:** https://supabase.com (similar to Neon)
- **AWS RDS:** https://aws.amazon.com/rds/
- **DigitalOcean Managed Database:** https://www.digitalocean.com/

Each provides a connection string in the format:

```bash
postgresql://username:password@host:port/database
```

## 📝 Update Environment Variable

Once you have your new connection string:

1. Edit `.env.local` file
2. Update the `DATABASE_URL` line
3. **Important:** After changing database, run migrations to create tables:

```bash
# Push schema to new database
node push-schema.mjs

# Seed data if needed
node seed-database.mjs
```

## ✅ Verify Connection

After changing database, verify it works:

```bash
# Test connection
node investigate-db.mjs

# You should see:
# ✅ Connected successfully!
# 📊 Tables in database: (should show your tables)
```

## 🔐 Security Notes

⚠️ **IMPORTANT:**

- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep passwords secure
- Use strong passwords for production
- For production, use Neon or similar managed service with SSL
- Never share connection strings publicly

## 📝 Example: Complete `.env.local` with Local DB

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image

# Local PostgreSQL
DATABASE_URL=postgresql://blog_user:your_password@localhost:5432/blog_platform
```

## 🚀 After Changing Database

1. Update `DATABASE_URL` in `.env.local`
2. Run: `node push-schema.mjs` (creates tables)
3. Run: `node seed-database.mjs` (adds sample data)
4. Restart dev server: `npm run dev`
5. Test: `node investigate-db.mjs`

---

**Need help?** The connection string format is always:

```
postgresql://username:password@host:port/database[?options]
```
