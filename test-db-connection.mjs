#!/usr/bin/env node

import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

console.log('🔍 Testing Neon Database Connection...');
console.log('Connecting to:', connectionString.substring(0, 50) + '...');

const sql = postgres(connectionString, {
  ssl: 'require',
});

try {
  // Test basic connection
  const result = await sql`SELECT NOW()`;
  console.log('✅ Connected to Neon database');
  console.log('Current time from DB:', result[0]);

  // Check if posts table exists and has data
  const posts = await sql`SELECT COUNT(*) as count FROM posts`;
  console.log('📝 Total posts in database:', posts[0].count);

  // Check users
  const users = await sql`SELECT COUNT(*) as count FROM users`;
  console.log('👥 Total users in database:', users[0].count);

  // Check categories
  const categories = await sql`SELECT COUNT(*) as count FROM categories`;
  console.log('📂 Total categories in database:', categories[0].count);

  // Get some sample data
  const samplePosts = await sql`
    SELECT 
      p.id, 
      p.title, 
      p.slug, 
      u.name as author_name,
      p.created_at 
    FROM posts p 
    LEFT JOIN users u ON p.author_id = u.id 
    LIMIT 3
  `;
  
  if (samplePosts.length > 0) {
    console.log('\n✅ Sample posts:');
    samplePosts.forEach((post, i) => {
      console.log(`  ${i + 1}. ${post.title} (by ${post.author_name || 'Unknown'})`);
    });
  } else {
    console.log('\n⚠️  No posts found - you may need to seed the database');
  }

  console.log('\n✅ Database connection successful!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.code) console.error('   Code:', error.code);
} finally {
  await sql.end();
}
