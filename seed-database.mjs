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

const sql = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
});

async function seed() {
  try {
    console.log('🌱 Seeding database...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await sql`DELETE FROM posts_to_categories`;
    await sql`DELETE FROM posts`;
    await sql`DELETE FROM categories`;
    await sql`DELETE FROM users`;
    console.log('✅ Existing data cleared\n');

    // Insert users
    console.log('👥 Creating authors...');
    const users_data = [
      { name: 'Theodore Reginald', email: 'theodore@example.com' },
      { name: 'Elena Martinez', email: 'elena@example.com' },
      { name: 'James Chen', email: 'james@example.com' },
      { name: 'Sarah Johnson', email: 'sarah@example.com' },
      { name: 'Marco Rossi', email: 'marco@example.com' },
      { name: 'Priya Sharma', email: 'priya@example.com' },
    ];

    const users = [];
    for (const user of users_data) {
      const [inserted] = await sql`
        INSERT INTO users (name, email)
        VALUES (${user.name}, ${user.email})
        RETURNING id, name, email
      `;
      users.push(inserted);
      console.log(`   ✓ ${user.name}`);
    }
    console.log('✅ Authors created\n');

    // Insert categories
    console.log('📂 Creating categories...');
    const categories_data = [
      { name: 'Destination', slug: 'destination', description: 'Travel guides and destination recommendations' },
      { name: 'Culinary', slug: 'culinary', description: 'Food and cuisine experiences' },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle and wellness content' },
      { name: 'Tips & Hacks', slug: 'tips-hacks', description: 'Travel tips and practical hacks' },
    ];

    const categories = [];
    for (const cat of categories_data) {
      const [inserted] = await sql`
        INSERT INTO categories (name, slug, description)
        VALUES (${cat.name}, ${cat.slug}, ${cat.description})
        RETURNING id, name, slug
      `;
      categories.push(inserted);
      console.log(`   ✓ ${cat.name}`);
    }
    console.log('✅ Categories created\n');

    // Insert posts
    console.log('📝 Creating posts...');
    const posts_data = [
      {
        title: 'Exploring the Wonders of Hiking',
        slug: 'exploring-wonders-hiking',
        content: 'An iconic landmarks, this post unveils the secrets that make this destination a traveler\'s paradise. Discover breathtaking trails, stunning vistas, and the thrill of adventure that awaits every hiker.',
        excerpt: 'An iconic landmarks, this post unveils the secrets that make this destination a traveler\'s paradise.',
        author_idx: 0,
        categories: [0],
      },
      {
        title: 'Taste of the Alps: A Culinary Journey',
        slug: 'taste-alps-culinary',
        content: 'Discover the flavors and traditions of Alpine cuisine, from hearty mountain dishes to delicate pastries. Experience authentic recipes passed down through generations in the heart of Europe.',
        excerpt: 'Discover the flavors and traditions of Alpine cuisine, from hearty mountain dishes to delicate pastries.',
        author_idx: 1,
        categories: [1],
      },
      {
        title: 'Digital Nomad Guide to Southeast Asia',
        slug: 'digital-nomad-southeast-asia',
        content: 'Everything you need to know about working remotely while exploring the vibrant cultures of Southeast Asia. From co-working spaces to visa requirements, we cover it all.',
        excerpt: 'Everything you need to know about working remotely while exploring the vibrant cultures of SE Asia.',
        author_idx: 2,
        categories: [2],
      },
      {
        title: 'Budget Travel Hacks for 2024',
        slug: 'budget-travel-hacks',
        content: 'Save up to 60% on your next trip with these proven strategies and insider tips from seasoned travelers. Learn how to find deals, book smart, and travel like a pro.',
        excerpt: 'Save up to 60% on your next trip with these proven strategies and insider tips from seasoned travelers.',
        author_idx: 3,
        categories: [3],
      },
      {
        title: 'Hidden Beaches of the Mediterranean',
        slug: 'hidden-beaches-mediterranean',
        content: 'Escape the crowds and discover pristine beaches and hidden coves along the Mediterranean coast. Find your perfect secluded paradise away from tourist hotspots.',
        excerpt: 'Escape the crowds and discover pristine beaches and hidden coves along the Mediterranean coast.',
        author_idx: 4,
        categories: [0],
      },
      {
        title: 'Wellness Retreats: Finding Your Zen',
        slug: 'wellness-retreats-zen',
        content: 'A comprehensive guide to the world\'s best wellness retreats for yoga, meditation, and rejuvenation. Find the perfect retreat to restore your mind, body, and spirit.',
        excerpt: 'A comprehensive guide to the world\'s best wellness retreats for yoga, meditation, and rejuvenation.',
        author_idx: 5,
        categories: [2],
      },
    ];

    const posts = [];
    for (const post of posts_data) {
      const [inserted] = await sql`
        INSERT INTO posts (title, slug, content, excerpt, published, author_id)
        VALUES (${post.title}, ${post.slug}, ${post.content}, ${post.excerpt}, true, ${users[post.author_idx].id})
        RETURNING id, title, slug
      `;
      posts.push(inserted);
      console.log(`   ✓ ${post.title}`);
    }
    console.log('✅ Posts created\n');

    // Create post to category relationships
    console.log('🔗 Assigning categories to posts...');
    const relationships = [
      [0, 0], // post 0, category 0
      [1, 1], // post 1, category 1
      [2, 2], // post 2, category 2
      [3, 3], // post 3, category 3
      [4, 0], // post 4, category 0
      [5, 2], // post 5, category 2
    ];

    for (const [post_idx, cat_idx] of relationships) {
      await sql`
        INSERT INTO posts_to_categories (post_id, category_id)
        VALUES (${posts[post_idx].id}, ${categories[cat_idx].id})
      `;
    }
    console.log('✅ Post categories assigned\n');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();
