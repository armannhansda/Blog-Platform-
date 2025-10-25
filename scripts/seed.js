/**
 * Database Seed Script (Node.js version)
 * Seeds the database with blog posts, authors, and categories
 */

const postgres = require('postgres');
require('dotenv').config();

async function seed() {
  try {
    console.log('🌱 Seeding database...\n');

    // Create Postgres client using individual env vars
    const sql = postgres({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'blogplatform',
      ssl: process.env.DB_SSL === 'true',
    });

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await sql`DELETE FROM posts_to_categories`;
    await sql`DELETE FROM posts`;
    await sql`DELETE FROM categories`;
    await sql`DELETE FROM users`;
    console.log('✅ Existing data cleared\n');

    // Insert users/authors
    console.log('👥 Creating authors...');
    const authors = await sql`
      INSERT INTO users (name, email) VALUES
      ('Theodore Reginald', 'theodore@example.com'),
      ('Elena Martinez', 'elena@example.com'),
      ('James Chen', 'james@example.com'),
      ('Sarah Johnson', 'sarah@example.com'),
      ('Marco Rossi', 'marco@example.com'),
      ('Priya Sharma', 'priya@example.com')
      RETURNING id, name
    `;
    console.log(`✅ Created ${authors.length} authors\n`);

    // Insert categories
    console.log('📂 Creating categories...');
    const categoryList = await sql`
      INSERT INTO categories (name, slug, description) VALUES
      ('Technology', 'technology', 'Latest tech news, gadgets, and software'),
      ('Business', 'business', 'Business insights, startups, and entrepreneurship'),
      ('Lifestyle', 'lifestyle', 'Lifestyle tips, wellness, and personal development'),
      ('Travel', 'travel', 'Travel guides and destination recommendations'),
      ('Food', 'food', 'Food and cuisine experiences'),
      ('Health', 'health', 'Health, fitness, and wellness content'),
      ('Education', 'education', 'Learning resources and educational content'),
      ('Entertainment', 'entertainment', 'Movies, music, and entertainment news'),
      ('Sports', 'sports', 'Sports news, analysis, and updates'),
      ('Finance', 'finance', 'Financial advice and investment tips'),
      ('Art', 'art', 'Art, design, and creative inspiration'),
      ('Science', 'science', 'Science discoveries and research findings'),
      ('Fashion', 'fashion', 'Fashion trends, style tips, and clothing reviews'),
      ('Photography', 'photography', 'Photography techniques, tips, and inspiration'),
      ('Gaming', 'gaming', 'Video games reviews, guides, and esports news'),
      ('Music', 'music', 'Music news, album reviews, and artist interviews'),
      ('Politics', 'politics', 'Political news, analysis, and commentary'),
      ('Environment', 'environment', 'Environmental news and sustainability tips'),
      ('Automotive', 'automotive', 'Car reviews, automotive news, and driving tips'),
      ('Real Estate', 'real-estate', 'Property market trends and real estate advice'),
      ('DIY & Crafts', 'diy-crafts', 'DIY projects, tutorials, and creative crafts'),
      ('Relationships', 'relationships', 'Relationship advice and dating tips'),
      ('Parenting', 'parenting', 'Parenting advice and family tips'),
      ('Career', 'career', 'Career advice, job search tips, and professional development'),
      ('Mental Health', 'mental-health', 'Mental health resources and wellness tips'),
      ('Cryptocurrency', 'cryptocurrency', 'Crypto news, blockchain, and digital assets'),
      ('Artificial Intelligence', 'artificial-intelligence', 'AI trends, machine learning, and automation'),
      ('Cybersecurity', 'cybersecurity', 'Cybersecurity tips and data protection'),
      ('Web Development', 'web-development', 'Web design, coding, and development tutorials'),
      ('Mobile Apps', 'mobile-apps', 'Mobile app development and reviews'),
      ('Cloud Computing', 'cloud-computing', 'Cloud services and infrastructure'),
      ('Data Science', 'data-science', 'Data analysis, statistics, and big data'),
      ('Internet of Things', 'internet-of-things', 'IoT devices and smart technology'),
      ('Virtual Reality', 'virtual-reality', 'VR technology, games, and experiences'),
      ('Augmented Reality', 'augmented-reality', 'AR applications and innovations'),
      ('Startups', 'startups', 'Startup news, funding, and entrepreneurship'),
      ('Venture Capital', 'venture-capital', 'VC funding, investments, and deals'),
      ('Marketing', 'marketing', 'Digital marketing and advertising strategies'),
      ('Social Media', 'social-media', 'Social media trends and strategies'),
      ('E-commerce', 'e-commerce', 'Online shopping and digital commerce'),
      ('Freelancing', 'freelancing', 'Freelance opportunities and gig economy'),
      ('Remote Work', 'remote-work', 'Remote work tips and opportunities'),
      ('Productivity', 'productivity', 'Productivity tips and time management'),
      ('Leadership', 'leadership', 'Leadership skills and management tips'),
      ('Yoga', 'yoga', 'Yoga practices and mindfulness'),
      ('Fitness', 'fitness', 'Fitness routines and workout plans'),
      ('Nutrition', 'nutrition', 'Nutrition advice and diet plans'),
      ('Cooking', 'cooking', 'Cooking recipes and culinary techniques'),
      ('Baking', 'baking', 'Baking recipes and pastry techniques'),
      ('Vegetarian', 'vegetarian', 'Vegetarian and vegan recipes'),
      ('International Cuisine', 'international-cuisine', 'Cuisines from around the world'),
      ('Desserts', 'desserts', 'Dessert recipes and sweet treats'),
      ('Beverages', 'beverages', 'Drinks, coffee, tea, and cocktails'),
      ('Coffee', 'coffee', 'Coffee brewing and culture'),
      ('Wine', 'wine', 'Wine tasting and reviews'),
      ('Beer', 'beer', 'Beer brewing and tasting'),
      ('Travel Tips', 'travel-tips', 'Travel hacks and planning tips'),
      ('Backpacking', 'backpacking', 'Budget travel and backpacking guides'),
      ('Luxury Travel', 'luxury-travel', 'High-end travel experiences'),
      ('Adventure Travel', 'adventure-travel', 'Adventure trips and extreme sports'),
      ('Cruise Travel', 'cruise-travel', 'Cruise ship reviews and travel'),
      ('Beach Destinations', 'beach-destinations', 'Beach travel and tropical getaways'),
      ('Mountain Travel', 'mountain-travel', 'Mountain hiking and alpine travel'),
      ('City Guides', 'city-guides', 'City travel guides and urban exploration'),
      ('Budget Travel', 'budget-travel', 'Budget-friendly travel tips'),
      ('Luxury Lifestyle', 'luxury-lifestyle', 'Luxury products and high-end living'),
      ('Minimalism', 'minimalism', 'Minimalist living and simplicity'),
      ('Home Decor', 'home-decor', 'Interior design and home decoration'),
      ('Gardening', 'gardening', 'Gardening tips and plant care'),
      ('Pets', 'pets', 'Pet care and animal companionship'),
      ('Dogs', 'dogs', 'Dog breeds and pet dog care'),
      ('Cats', 'cats', 'Cat breeds and feline care'),
      ('Movies', 'movies', 'Movie reviews and cinema news'),
      ('Television', 'television', 'TV shows and streaming content'),
      ('Books', 'books', 'Book reviews and literature'),
      ('Reading', 'reading', 'Reading recommendations and literary criticism'),
      ('Writing', 'writing', 'Writing tips and creative writing'),
      ('Poetry', 'poetry', 'Poetry and verse'),
      ('Theater', 'theater', 'Theater reviews and performing arts'),
      ('Dance', 'dance', 'Dance performances and techniques'),
      ('Art History', 'art-history', 'Art movements and historical analysis'),
      ('Design', 'design', 'Graphic design and UX/UI'),
      ('Architecture', 'architecture', 'Architecture and building design'),
      ('Science Fiction', 'science-fiction', 'Sci-fi books and movies'),
      ('Fantasy', 'fantasy', 'Fantasy literature and media'),
      ('Mystery', 'mystery', 'Mystery and thriller stories'),
      ('Romance', 'romance', 'Romance novels and relationships'),
      ('History', 'history', 'Historical events and analysis'),
      ('Geography', 'geography', 'Geography and world cultures'),
      ('Astronomy', 'astronomy', 'Astronomy and space exploration'),
      ('Physics', 'physics', 'Physics research and discoveries'),
      ('Biology', 'biology', 'Biology and life sciences'),
      ('Chemistry', 'chemistry', 'Chemistry research and experiments'),
      ('Mathematics', 'mathematics', 'Math concepts and learning'),
      ('Language Learning', 'language-learning', 'Learn new languages'),
      ('Self Improvement', 'self-improvement', 'Personal growth and development'),
      ('Motivation', 'motivation', 'Motivational content and inspiration'),
      ('Philosophy', 'philosophy', 'Philosophy and critical thinking'),
      ('Psychology', 'psychology', 'Psychology insights and studies'),
      ('Spirituality', 'spirituality', 'Spiritual growth and practices')
      RETURNING id, name
    `;
    console.log(`✅ Created ${categoryList.length} categories\n`);

    // Create lookup maps
    const authorMap = {};
    authors.forEach((a, i) => {
      authorMap[i] = a.id;
    });

    const categoryMap = {};
    categoryList.forEach((c, i) => {
      categoryMap[i] = c.id;
    });

    // Insert posts
    console.log('📝 Creating blog posts...');
    const postsData = [
      {
        title: 'The Future of AI: Trends and Innovations',
        slug: 'future-ai-trends',
        excerpt: 'Explore the latest trends and innovations in artificial intelligence and machine learning.',
        content: 'Artificial intelligence is rapidly transforming every industry. From natural language processing to computer vision, discover the cutting-edge innovations shaping our future.',
        authorId: authorMap[0],
        categoryId: categoryMap[0],
        coverImage: 'https://images.unsplash.com/photo-1677442d019e157be4daf3e3ec011eb527a9db76?w=800&q=80',
      },
      {
        title: 'Startup Success Stories: Lessons Learned',
        slug: 'startup-success-stories',
        excerpt: 'Learn from entrepreneurs who built successful startups from scratch.',
        content: 'In this article, we explore the journeys of successful founders and the key strategies they used to scale their businesses. Discover actionable insights for aspiring entrepreneurs.',
        authorId: authorMap[1],
        categoryId: categoryMap[1],
        coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      },
      {
        title: 'Digital Nomad Guide to Southeast Asia',
        slug: 'digital-nomad-southeast-asia',
        excerpt: 'Everything you need to know about working remotely while exploring Southeast Asia.',
        content: 'Everything you need to know about working remotely while exploring the vibrant cultures of Southeast Asia. From co-working spaces to visa requirements, we cover it all.',
        authorId: authorMap[2],
        categoryId: categoryMap[3],
        coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      },
      {
        title: 'Taste of the Alps: A Culinary Journey',
        slug: 'taste-alps-culinary',
        excerpt: 'Discover the flavors and traditions of Alpine cuisine.',
        content: 'Discover the flavors and traditions of Alpine cuisine, from hearty mountain dishes to delicate pastries. Experience authentic recipes passed down through generations.',
        authorId: authorMap[1],
        categoryId: categoryMap[4],
        coverImage: 'https://images.unsplash.com/photo-1504674900967-948ec28afeebc15efd3601d3ad37f00b?w=800&q=80',
      },
      {
        title: 'Wellness Retreats: Finding Your Zen',
        slug: 'wellness-retreats-zen',
        excerpt: 'A comprehensive guide to the world\'s best wellness retreats.',
        content: 'Find the perfect retreat to restore your mind, body, and spirit. We explore yoga centers, meditation monasteries, and spa destinations around the world.',
        authorId: authorMap[5],
        categoryId: categoryMap[5],
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      },
      {
        title: 'Mastering Python: A Beginner\'s Guide',
        slug: 'mastering-python-beginners',
        excerpt: 'Learn Python programming from scratch with practical examples.',
        content: 'Python is one of the most popular programming languages. This comprehensive guide takes you from basics to advanced concepts with hands-on projects.',
        authorId: authorMap[0],
        categoryId: categoryMap[6],
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      },
      {
        title: 'The Best Movies of 2024',
        slug: 'best-movies-2024',
        excerpt: 'Our curated list of the most anticipated films of the year.',
        content: 'From blockbuster action films to indie darlings, we review the best movies that defined cinema in 2024.',
        authorId: authorMap[2],
        categoryId: categoryMap[7],
        coverImage: 'https://images.unsplash.com/photo-1489599849228-bed96c3dd593?w=800&q=80',
      },
      {
        title: 'Olympic Games 2024: Highlights and Records',
        slug: 'olympics-2024-highlights',
        excerpt: 'Recap of the most thrilling moments and record-breaking performances.',
        content: 'The 2024 Olympics brought us unforgettable moments. From impressive athletic achievements to historic records, relive the excitement.',
        authorId: authorMap[3],
        categoryId: categoryMap[8],
        coverImage: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800&q=80',
      },
      {
        title: 'Investment Strategies for Beginners',
        slug: 'investment-strategies-beginners',
        excerpt: 'Learn how to start investing and build wealth over time.',
        content: 'Getting started with investments doesn\'t have to be complicated. Discover proven strategies and best practices for building your investment portfolio.',
        authorId: authorMap[4],
        categoryId: categoryMap[9],
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      },
      {
        title: 'Contemporary Art: Voices of Change',
        slug: 'contemporary-art-voices',
        excerpt: 'Exploring emerging artists and their impact on the art world.',
        content: 'Contemporary art is constantly evolving. Meet the visionary artists pushing boundaries and challenging conventional thinking.',
        authorId: authorMap[5],
        categoryId: categoryMap[10],
        coverImage: 'https://images.unsplash.com/photo-1578301978162-7aae4d755f90?w=800&q=80',
      },
      {
        title: 'Climate Change: Science and Solutions',
        slug: 'climate-change-science',
        excerpt: 'Understanding the science behind climate change and exploring sustainable solutions.',
        content: 'Climate change is one of the defining challenges of our time. Learn about the science, impacts, and innovative solutions being developed globally.',
        authorId: authorMap[0],
        categoryId: categoryMap[11],
        coverImage: 'https://images.unsplash.com/photo-1491466424936-e304919e5b2f?w=800&q=80',
      },
      {
        title: 'Budget Travel Hacks for 2024',
        slug: 'budget-travel-hacks',
        excerpt: 'Save up to 60% on your next trip with proven strategies.',
        content: 'Learn how to find deals, book smart, and travel like a pro. These insider tips will help you explore the world on a budget.',
        authorId: authorMap[3],
        categoryId: categoryMap[3],
        coverImage: 'https://images.unsplash.com/photo-1606576142191-3dfe4fd0a1d8?w=800&q=80',
      },
      {
        title: 'Spring Fashion Trends 2024',
        slug: 'spring-fashion-trends-2024',
        excerpt: 'Discover the hottest fashion trends for spring season.',
        content: 'From vibrant colors to sustainable fashion, explore the must-have trends that will define your spring wardrobe this year.',
        authorId: authorMap[1],
        categoryId: categoryMap[12],
        coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      },
      {
        title: 'Mastering Mobile Photography',
        slug: 'mastering-mobile-photography',
        excerpt: 'Take professional-quality photos with just your smartphone.',
        content: 'Learn composition techniques, lighting tips, and editing tricks to elevate your mobile photography game.',
        authorId: authorMap[2],
        categoryId: categoryMap[13],
        coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
      },
      {
        title: 'Top Gaming Releases of 2024',
        slug: 'top-gaming-releases-2024',
        excerpt: 'The most anticipated video game releases this year.',
        content: 'From indie darlings to AAA blockbusters, explore the gaming landscape and find your next favorite game.',
        authorId: authorMap[0],
        categoryId: categoryMap[14],
        coverImage: 'https://images.unsplash.com/photo-1538481143235-5d8b4cb8f79f?w=800&q=80',
      },
      {
        title: 'The Evolution of Music Streaming',
        slug: 'evolution-music-streaming',
        excerpt: 'How music consumption has changed over the decades.',
        content: 'From vinyl to streaming services, discover how technology has transformed the way we experience music.',
        authorId: authorMap[5],
        categoryId: categoryMap[15],
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
      },
      {
        title: 'Political Landscape 2024: Key Issues',
        slug: 'political-landscape-2024',
        excerpt: 'Understanding the major political issues shaping global politics.',
        content: 'Explore the critical political topics, elections, and policy debates defining 2024.',
        authorId: authorMap[4],
        categoryId: categoryMap[16],
        coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      },
      {
        title: 'Going Green: Sustainable Living Tips',
        slug: 'going-green-sustainable-living',
        excerpt: 'Practical steps to reduce your environmental footprint.',
        content: 'Learn simple yet effective ways to adopt a more sustainable lifestyle and contribute to environmental conservation.',
        authorId: authorMap[3],
        categoryId: categoryMap[17],
        coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      },
      {
        title: 'Electric Vehicles: The Future of Driving',
        slug: 'electric-vehicles-future',
        excerpt: 'A comprehensive guide to electric vehicles and their advantages.',
        content: 'Explore the benefits of EVs, charging infrastructure, and top models available in the market.',
        authorId: authorMap[1],
        categoryId: categoryMap[18],
        coverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
      },
      {
        title: 'Real Estate Investment Guide',
        slug: 'real-estate-investment-guide',
        excerpt: 'How to start investing in real estate and build wealth.',
        content: 'From residential properties to commercial investments, learn strategies for successful real estate investing.',
        authorId: authorMap[4],
        categoryId: categoryMap[19],
        coverImage: 'https://images.unsplash.com/photo-1560518883-8f84e46b0b2b?w=800&q=80',
      },
      {
        title: 'DIY Home Improvement Projects',
        slug: 'diy-home-improvement',
        excerpt: 'Transform your home with these easy DIY projects.',
        content: 'Discover budget-friendly home improvement ideas that you can tackle yourself with basic tools.',
        authorId: authorMap[0],
        categoryId: categoryMap[20],
        coverImage: 'https://images.unsplash.com/photo-1503387837519-44a64e1c2e6f?w=800&q=80',
      },
      {
        title: 'Building Healthy Relationships',
        slug: 'building-healthy-relationships',
        excerpt: 'Essential tips for maintaining strong and healthy relationships.',
        content: 'Learn communication techniques, conflict resolution, and ways to strengthen your relationships.',
        authorId: authorMap[5],
        categoryId: categoryMap[21],
        coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      },
      {
        title: 'Parenting in the Digital Age',
        slug: 'parenting-digital-age',
        excerpt: 'Navigating parenthood in a world of technology.',
        content: 'Expert advice on screen time management, digital safety, and raising tech-savvy kids responsibly.',
        authorId: authorMap[2],
        categoryId: categoryMap[22],
        coverImage: 'https://images.unsplash.com/photo-1533614533348-b3b3eaf00779?w=800&q=80',
      },
      {
        title: 'Career Transitions: A Step-by-Step Guide',
        slug: 'career-transitions-guide',
        excerpt: 'How to successfully transition to a new career path.',
        content: 'Plan your career change strategically with actionable steps and resources for a smooth transition.',
        authorId: authorMap[3],
        categoryId: categoryMap[23],
        coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      },
      {
        title: 'Mental Health Awareness: Breaking the Stigma',
        slug: 'mental-health-awareness',
        excerpt: 'Understanding mental health and seeking help when needed.',
        content: 'Learn about common mental health challenges, coping strategies, and resources for mental wellness.',
        authorId: authorMap[1],
        categoryId: categoryMap[24],
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      },
    ];

    const posts = [];
    for (const postData of postsData) {
      const [post] = await sql`
        INSERT INTO posts (title, slug, excerpt, content, published, author_id, cover_image)
        VALUES (${postData.title}, ${postData.slug}, ${postData.excerpt}, ${postData.content}, true, ${postData.authorId}, ${postData.coverImage})
        RETURNING id
      `;
      posts.push({ id: post.id, categoryId: postData.categoryId });
    }
    console.log(`✅ Created ${posts.length} posts\n`);

    // Create post to category relationships
    console.log('🔗 Linking posts to categories...');
    for (const post of posts) {
      await sql`
        INSERT INTO posts_to_categories (post_id, category_id)
        VALUES (${post.id}, ${post.categoryId})
      `;
    }
    console.log(`✅ Created ${posts.length} post-category relationships\n`);

    await sql.end();
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message || error);
    process.exit(1);
  }
}

seed();
