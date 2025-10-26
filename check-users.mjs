#!/usr/bin/env node

import postgres from 'postgres';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  ssl: 'require',
});

async function checkUsers() {
  try {
    console.log('📊 Users in database:');
    const users = await sql`SELECT id, name, email, role FROM users ORDER BY id DESC`;
    console.log(`Total: ${users.length} users\n`);
    
    users.forEach((u) => {
      console.log(`[${u.id}] ${u.name} (${u.email}) - Role: ${u.role}`);
    });

    console.log('\n✅ Check complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

checkUsers();
