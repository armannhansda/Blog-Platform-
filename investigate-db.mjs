#!/usr/bin/env node

import postgres from 'postgres';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Investigating Database Connection...\n');

// Check environment files
console.log('📋 Environment Files:');
const envFiles = ['.env.local', '.env', '.env.production'];
for (const file of envFiles) {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${file}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
}

console.log('\n🔄 Loading environment variables...');
// Load .env.local first, then .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!');
  process.exit(1);
}

// Parse the connection string to extract details
const url = new URL(DATABASE_URL);
const host = url.hostname;
const database = url.pathname.replace('/', '');
const user = url.username;

console.log('\n✅ DATABASE_URL Found:');
console.log(`   Protocol: ${url.protocol}`);
console.log(`   Host: ${host}`);
console.log(`   Database: ${database}`);
console.log(`   User: ${user}`);
console.log(`   SSL: required`);

console.log('\n🔗 Connecting to database...');

const sql = postgres(DATABASE_URL, {
  prepare: false,
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
});

async function checkDatabase() {
  try {
    // Get database info
    const [dbInfo] = await sql`
      SELECT current_database() as db, current_user as user, now() as time
    `;
    console.log('✅ Connected successfully!');
    console.log(`   Database: ${dbInfo.db}`);
    console.log(`   User: ${dbInfo.user}`);
    console.log(`   Server time: ${dbInfo.time}`);

    // Check tables
    console.log('\n📊 Tables in database:');
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found!');
    } else {
      for (const table of tables) {
        const [count] = await sql`SELECT COUNT(*) as count FROM ${sql(table.table_name)}`;
        console.log(`   📋 ${table.table_name}: ${count.count} rows`);
      }
    }

    // Check if posts table exists and has data
    console.log('\n🎯 Posts Table Details:');
    const postColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'posts'
      ORDER BY ordinal_position
    `;

    if (postColumns.length === 0) {
      console.log('   ⚠️  Posts table does not exist!');
    } else {
      console.log('   Columns:');
      postColumns.forEach((col) => {
        console.log(`      - ${col.column_name}: ${col.data_type}`);
      });

      const [postCount] = await sql`SELECT COUNT(*) as count FROM posts`;
      console.log(`\n   Total posts: ${postCount.count}`);

      if (postCount.count > 0) {
        const sample = await sql`SELECT id, title, slug FROM posts LIMIT 3`;
        console.log('   Sample posts:');
        sample.forEach((post) => {
          console.log(`      - [${post.id}] ${post.title}`);
        });
      }
    }

    console.log('\n✅ Database investigation complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

checkDatabase();
