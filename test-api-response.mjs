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
    console.log('📝 Response Data:', JSON.stringify(response.data, null, 2).substring(0, 2000));

    // Check if it's a tRPC response format
    if (Array.isArray(response.data) && response.data.length > 0) {
      const result = response.data[0];
      console.log('\n✅ API Response Format (tRPC)');
      
      if (result.result && result.result.data) {
        const posts = result.result.data;
        console.log(`\n📚 Number of posts returned: ${posts.length}`);
        if (posts.length > 0) {
          console.log('\n🎯 First post:', JSON.stringify(posts[0], null, 2).substring(0, 500));
        }
      } else {
        console.log('\n⚠️  Unexpected response structure');
      }
    } else {
      console.log('\n⚠️  No data or unexpected format');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testApiResponse();
