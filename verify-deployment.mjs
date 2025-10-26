#!/usr/bin/env node

/**
 * Pre-Deployment Verification Script
 * Runs through all pre-deployment checks
 * Usage: node verify-deployment.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🔍 Pre-Deployment Verification\n');
console.log('═'.repeat(60));

const checks = {
  files: [
    { path: 'package.json', name: 'package.json' },
    { path: 'next.config.ts', name: 'next.config.ts' },
    { path: 'tsconfig.json', name: 'tsconfig.json' },
    { path: 'src/app/page.tsx', name: 'Home Page' },
    { path: 'src/lib/db/index.ts', name: 'Database Config' },
    { path: 'src/server/trpc/routers/posts.ts', name: 'Posts Router' },
  ],
  envVars: [
    'DATABASE_URL',
    'JWT_SECRET',
    'TOKEN_EXPIRATION',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
  ],
};

// Check files
console.log('\n📁 File Checks:\n');
let filesOk = true;

checks.files.forEach((file) => {
  const filePath = path.join(__dirname, file.path);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file.name.padEnd(30)} ${file.path}`);
  if (!exists) filesOk = false;
});

// Check environment variables
console.log('\n🔐 Environment Variables Check:\n');
let envOk = true;

checks.envVars.forEach((envVar) => {
  const value = process.env[envVar];
  const exists = !!value;
  const status = exists ? '✅' : '❌';
  const display = exists ? `(${String(value).substring(0, 20)}...)` : '(NOT SET)';
  console.log(`${status} ${envVar.padEnd(40)} ${display}`);
  if (!exists) envOk = false;
});

// Summary
console.log('\n═'.repeat(60));
console.log('\n📋 Deployment Readiness:\n');

if (filesOk && envOk) {
  console.log('✅ All checks passed! Ready for deployment.\n');
  console.log('🚀 Next steps:');
  console.log('   1. Commit your changes: git add . && git commit -m "Ready for deployment"');
  console.log('   2. Push to GitHub: git push origin main');
  console.log('   3. Go to https://vercel.com and create a new project');
  console.log('   4. Import your GitHub repository');
  console.log('   5. Add the required environment variables');
  console.log('   6. Click Deploy!\n');
} else {
  console.log('❌ Some checks failed. Please fix the following:\n');
  if (!filesOk) {
    console.log('📁 Missing files:');
    checks.files.forEach((file) => {
      const filePath = path.join(__dirname, file.path);
      if (!fs.existsSync(filePath)) {
        console.log(`   - ${file.path}`);
      }
    });
    console.log();
  }
  if (!envOk) {
    console.log('🔐 Missing environment variables:');
    checks.envVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        console.log(`   - ${envVar}`);
      }
    });
    console.log();
  }
  console.log('📖 See VERCEL_STEP_BY_STEP.md for configuration help.\n');
}

console.log('═'.repeat(60));
console.log('\n');

// Exit with appropriate code
process.exit(filesOk && envOk ? 0 : 1);
