import { db } from '.';
import { users, posts, categories, postsToCategories } from './schema';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await db.delete(postsToCategories);
    await db.delete(posts);
    await db.delete(categories);
    await db.delete(users);

    console.log('✅ Existing data cleared');

    // Insert users
    const [theodore] = await db
      .insert(users)
      .values({
        name: 'Theodore Reginald',
        email: 'theodore@example.com',
      })
      .returning();

    const [elena] = await db
      .insert(users)
      .values({
        name: 'Elena Martinez',
        email: 'elena@example.com',
      })
      .returning();

    const [james] = await db
      .insert(users)
      .values({
        name: 'James Chen',
        email: 'james@example.com',
      })
      .returning();

    const [sarah] = await db
      .insert(users)
      .values({
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
      })
      .returning();

    const [marco] = await db
      .insert(users)
      .values({
        name: 'Marco Rossi',
        email: 'marco@example.com',
      })
      .returning();

    const [priya] = await db
      .insert(users)
      .values({
        name: 'Priya Sharma',
        email: 'priya@example.com',
      })
      .returning();

    console.log('✅ Authors created');

    // Insert categories
    const [destination] = await db
      .insert(categories)
      .values({
        name: 'Destination',
        slug: 'destination',
        description: 'Travel guides and destination recommendations',
      })
      .returning();

    const [culinary] = await db
      .insert(categories)
      .values({
        name: 'Culinary',
        slug: 'culinary',
        description: 'Food and cuisine experiences',
      })
      .returning();

    const [lifestyle] = await db
      .insert(categories)
      .values({
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Lifestyle and wellness content',
      })
      .returning();

    const [tips] = await db
      .insert(categories)
      .values({
        name: 'Tips & Hacks',
        slug: 'tips-hacks',
        description: 'Travel tips and practical hacks',
      })
      .returning();

    console.log('✅ Categories created');

    // Insert posts
    const [post1] = await db
      .insert(posts)
      .values({
        title: 'Exploring the Wonders of Hiking',
        slug: 'exploring-wonders-hiking',
        content: 'An iconic landmarks, this post unveils the secrets that make this destination a traveler\'s paradise. Discover breathtaking trails, stunning vistas, and the thrill of adventure that awaits every hiker.',
        excerpt:
          'An iconic landmarks, this post unveils the secrets that make this destination a traveler\'s paradise.',
        published: true,
        authorId: theodore.id,
      })
      .returning();

    const [post2] = await db
      .insert(posts)
      .values({
        title: 'Taste of the Alps: A Culinary Journey',
        slug: 'taste-alps-culinary',
        content: 'Discover the flavors and traditions of Alpine cuisine, from hearty mountain dishes to delicate pastries. Experience authentic recipes passed down through generations in the heart of Europe.',
        excerpt:
          'Discover the flavors and traditions of Alpine cuisine, from hearty mountain dishes to delicate pastries.',
        published: true,
        authorId: elena.id,
      })
      .returning();

    const [post3] = await db
      .insert(posts)
      .values({
        title: 'Digital Nomad Guide to Southeast Asia',
        slug: 'digital-nomad-southeast-asia',
        content: 'Everything you need to know about working remotely while exploring the vibrant cultures of Southeast Asia. From co-working spaces to visa requirements, we cover it all.',
        excerpt:
          'Everything you need to know about working remotely while exploring the vibrant cultures of SE Asia.',
        published: true,
        authorId: james.id,
      })
      .returning();

    const [post4] = await db
      .insert(posts)
      .values({
        title: 'Budget Travel Hacks for 2024',
        slug: 'budget-travel-hacks',
        content: 'Save up to 60% on your next trip with these proven strategies and insider tips from seasoned travelers. Learn how to find deals, book smart, and travel like a pro.',
        excerpt:
          'Save up to 60% on your next trip with these proven strategies and insider tips from seasoned travelers.',
        published: true,
        authorId: sarah.id,
      })
      .returning();

    const [post5] = await db
      .insert(posts)
      .values({
        title: 'Hidden Beaches of the Mediterranean',
        slug: 'hidden-beaches-mediterranean',
        content: 'Escape the crowds and discover pristine beaches and hidden coves along the Mediterranean coast. Find your perfect secluded paradise away from tourist hotspots.',
        excerpt:
          'Escape the crowds and discover pristine beaches and hidden coves along the Mediterranean coast.',
        published: true,
        authorId: marco.id,
      })
      .returning();

    const [post6] = await db
      .insert(posts)
      .values({
        title: 'Wellness Retreats: Finding Your Zen',
        slug: 'wellness-retreats-zen',
        content: 'A comprehensive guide to the world\'s best wellness retreats for yoga, meditation, and rejuvenation. Find the perfect retreat to restore your mind, body, and spirit.',
        excerpt:
          'A comprehensive guide to the world\'s best wellness retreats for yoga, meditation, and rejuvenation.',
        published: true,
        authorId: priya.id,
      })
      .returning();

    console.log('✅ Posts created');

    // Create post to category relationships
    await db.insert(postsToCategories).values([
      { postId: post1.id, categoryId: destination.id },
      { postId: post2.id, categoryId: culinary.id },
      { postId: post3.id, categoryId: lifestyle.id },
      { postId: post4.id, categoryId: tips.id },
      { postId: post5.id, categoryId: destination.id },
      { postId: post6.id, categoryId: lifestyle.id },
    ]);

    console.log('✅ Post categories assigned');
    
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();