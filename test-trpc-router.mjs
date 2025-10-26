#!/usr/bin/env node

import { appRouter } from './src/server/trpc/router.ts';
import { db } from './src/lib/db/index.ts';

console.log('🔍 Testing tRPC Posts Router...\n');

try {
  // Create a context object
  const ctx = { db };

  // Call the list procedure directly
  const caller = appRouter.createCaller(ctx);
  const posts = await caller.posts.list();

  console.log(`✅ Successfully fetched ${posts.length} posts from tRPC router`);
  
  if (posts.length > 0) {
    console.log('\n📝 Sample post:');
    const post = posts[0];
    console.log(`   Title: ${post.title}`);
    console.log(`   Author: ${post.author?.name || 'Unknown'}`);
    console.log(`   Categories: ${post.categories?.length || 0}`);
    console.log(`   Slug: ${post.slug}`);
  }

  console.log('\n✅ tRPC router is working correctly!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  if (error instanceof Error) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
}
