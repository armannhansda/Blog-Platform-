import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

console.log('🔍 Testing Neon Database Connection...');
console.log('Database URL:', connectionString.replace(/:[^:]*@/, ':****@'));

try {
  const sql = postgres(connectionString, {
    ssl: 'require',
  });

  // Test basic connection
  console.log('✅ Connected to Neon database');

  // Check if posts table exists and has data
  const posts = await sql`SELECT * FROM posts LIMIT 5`;
  console.log('📝 Posts in database:', posts.length);
  if (posts.length > 0) {
    console.log('✅ Sample post:', posts[0]);
  } else {
    console.log('⚠️  No posts found in database');
  }

  // Check users
  const users = await sql`SELECT id, name, email FROM users LIMIT 5`;
  console.log('👥 Users in database:', users.length);
  if (users.length > 0) {
    console.log('✅ Sample user:', users[0]);
  }

  // Check categories
  const categories = await sql`SELECT * FROM categories LIMIT 5`;
  console.log('📂 Categories in database:', categories.length);
  if (categories.length > 0) {
    console.log('✅ Sample category:', categories[0]);
  }

  console.log('\n✅ All database checks passed!');
  
  await sql.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Database connection error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.error('Cannot connect to database. Check your connection string.');
  }
  process.exit(1);
}
