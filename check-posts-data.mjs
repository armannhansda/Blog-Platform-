#!/usr/bin/env node

import postgres from 'postgres';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

async function checkPostsData() {
  const sql = postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require',
  });

  try {
    console.log('🔍 Checking posts table...\n');

    // Check table structure
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'posts'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Posts table columns:');
    columns.forEach((col) => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    // Count posts
    const [count] = await sql`SELECT COUNT(*) as count FROM posts`;
    console.log(`\n📊 Total posts in database: ${count.count}`);

    // Get sample posts
    if (count.count > 0) {
      console.log('\n🎯 Sample posts:');
      const samples = await sql`
        SELECT id, title, slug, author_id, published, created_at 
        FROM posts 
        LIMIT 5
      `;
      samples.forEach((post, idx) => {
        console.log(`   ${idx + 1}. [${post.id}] ${post.title} (${post.slug}) - Author: ${post.author_id}`);
      });

      // Get one full post with relationship
      console.log('\n🔗 Full post with relationships:');
      const fullPost = await sql`
        SELECT 
          p.id,
          p.title,
          p.slug,
          p.content,
          p.excerpt,
          p.published,
          p.author_id,
          p.created_at,
          u.name as author_name,
          u.email as author_email
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        LIMIT 1
      `;
      console.log(JSON.stringify(fullPost[0], null, 2));

      // Check posts_to_categories relationships
      const [categoryCount] = await sql`SELECT COUNT(*) as count FROM posts_to_categories`;
      console.log(`\n📂 Total category relationships: ${categoryCount.count}`);
    } else {
      console.log('\n⚠️  No posts found in database!');
    }

    console.log('\n✅ Data verification complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

checkPostsData();
