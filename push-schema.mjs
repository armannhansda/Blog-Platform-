#!/usr/bin/env node

import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function pushSchema() {
  const sql = postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require',
  });

  try {
    console.log('🚀 Starting to push schema to database...\n');

    const migrationsDir = path.join(__dirname, 'src/lib/db/migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('⚠️  No migration files found');
      process.exit(0);
    }

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

      console.log(`📝 Executing: ${file}`);

      // Split by statement-breakpoint and execute each statement
      const statements = migrationSql
        .split('--> statement-breakpoint')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        try {
          await sql.unsafe(statement);
          console.log(`   ✓ Statement executed`);
        } catch (error) {
          // Ignore "already exists" errors
          if (error.message?.includes('already exists')) {
            console.log(`   ⚠️  Already exists, skipping`);
          } else {
            console.error(`   ❌ Error:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('\n✅ Schema pushed successfully!');

    // Verify tables exist
    console.log('\n🔍 Verifying tables...');
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables created:', tables.map((t) => t.table_name).join(', '));

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to push schema:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

pushSchema();
