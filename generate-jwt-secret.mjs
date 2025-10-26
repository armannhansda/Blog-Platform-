#!/usr/bin/env node

/**
 * Generate a secure random JWT secret for Vercel deployment
 * Usage: node generate-jwt-secret.mjs
 */

import crypto from 'crypto';

function generateJWTSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateSecureSecrets() {
  console.log('\n🔐 Secure Secrets Generator for Vercel Deployment\n');
  console.log('═'.repeat(60));
  
  const jwtSecret = generateJWTSecret(32);
  const migrationSecret = generateJWTSecret(16);
  
  console.log('\n📋 Environment Variables for Vercel:\n');
  
  console.log('JWT_SECRET:');
  console.log(jwtSecret);
  console.log('\nMIGRATION_SECRET (optional, for running migrations):');
  console.log(migrationSecret);
  
  console.log('\n═'.repeat(60));
  console.log('\n✅ Copy these values to Vercel Settings → Environment Variables\n');
  
  console.log('📝 Required Variables for Vercel:\n');
  console.log(`DATABASE_URL=postgresql://neondb_owner:npg_yXs4LQO0wSxv@ep-holy-scene-a1kveghi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log(`TOKEN_EXPIRATION=1d`);
  console.log(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dadafm6bs`);
  console.log(`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cover_image`);
  console.log('\n═'.repeat(60));
  
  console.log('\n🔗 Deployment Checklist:\n');
  console.log('1. [ ] Push code to GitHub');
  console.log('2. [ ] Go to https://vercel.com');
  console.log('3. [ ] Click "Add New Project"');
  console.log('4. [ ] Import your GitHub repository');
  console.log('5. [ ] Add the environment variables above');
  console.log('6. [ ] Click "Deploy"');
  console.log('7. [ ] Wait for build to complete');
  console.log('8. [ ] Test your app at the provided URL');
  console.log('\n');
}

generateSecureSecrets();
