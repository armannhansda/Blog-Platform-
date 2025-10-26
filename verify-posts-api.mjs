#!/usr/bin/env node

import http from 'http';

async function testApiResponse() {
  try {
    console.log('🔍 Testing tRPC API endpoint...\n');

    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/trpc/posts.list', (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      });
      req.on('error', reject);
    });

    console.log('📊 Response Status:', response.status);

    if (Array.isArray(response.data) && response.data.length > 0) {
      const result = response.data[0];
      console.log('Result structure:', Object.keys(result));
      
      if (result.result && result.result.data) {
        let posts = result.result.data;
        
        // Check if posts is wrapped in a json property
        if (posts.json) {
          posts = posts.json;
        }
        
        if (!Array.isArray(posts)) {
          console.log('⚠️  Posts is not an array:', typeof posts);
          console.log('Posts value:', posts);
          return;
        }
        
        console.log(`\n✅ SUCCESS! Posts loaded: ${posts.length} posts\n`);
        
        posts.forEach((post, idx) => {
          console.log(`${idx + 1}. "${post.title}"`);
          console.log(`   Author: ${post.author?.name || 'Unknown'}`);
          const categories = post.categories?.map((c) => c.name).join(', ') || 'None';
          console.log(`   Categories: ${categories}`);
          console.log();
        });
      } else {
        console.log('⚠️  Unexpected result structure:', JSON.stringify(result, null, 2).substring(0, 500));
      }
    } else {
      console.log('⚠️  No data received');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

testApiResponse();
