import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './src/lib/db/schema.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

console.log('🔌 Connecting to Neon database...');
console.log('📍 Host:', connectionString.split('@')[1]?.split('/')[0] || 'unknown');

const sql = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
});

const db = drizzle(sql, { schema: { users } });

async function testInsert() {
  try {
    console.log('\n📝 Testing user insertion...');
    
    // Generate test email
    const testEmail = `test-${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    console.log('   Email:', testEmail);
    
    // Try to insert
    const result = await db
      .insert(users)
      .values({
        name: 'Test User',
        email: testEmail,
        password: hashedPassword,
        role: 'author',
        isActive: true,
      })
      .returning();
    
    console.log('✅ User inserted successfully!');
    console.log('   ID:', result[0].id);
    console.log('   Email:', result[0].email);
    console.log('   Name:', result[0].name);
    
    // Verify by reading back
    console.log('\n🔍 Verifying insertion...');
    const readBack = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail));
    
    if (readBack.length > 0) {
      console.log('✅ Verification successful! User found in database');
      console.log('   Name:', readBack[0].name);
      console.log('   Email:', readBack[0].email);
    } else {
      console.log('❌ Verification failed! User not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
  } finally {
    await sql.end();
    console.log('\n✅ Connection closed');
    process.exit(0);
  }
}

testInsert();
