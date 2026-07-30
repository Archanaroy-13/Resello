const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resello';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Database connected for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    console.log('[Seed] Existing Users & Products cleared.');

    // Create Demo Users
    const users = await User.create([
      {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'password123',
        avatar: { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
        phone: '+1 555-0192',
        location: 'New York, NY',
        bio: 'Passionate about vintage denim, cameras, and sustainable fashion.'
      },
      {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: 'password123',
        avatar: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        phone: '+1 555-0823',
        location: 'San Francisco, CA',
        bio: 'Tech minimalist selling well-cared pre-owned electronics and gadgets.'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        password: 'password123',
        avatar: { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
        phone: '+1 555-0471',
        location: 'Austin, TX',
        bio: 'Home decor lover & coffee enthusiast decluttering handcrafted items.'
      }
    ]);

    const sarahId = users[0]._id;
    const alexId = users[1]._id;
    const marcusId = users[2]._id;

    // Seed Products
    const productsData = [
      {
        title: 'Vintage Canon AE-1 35mm SLR Camera',
        description: 'Classic 35mm film camera in excellent working condition. Comes with 50mm f/1.8 lens, original neck strap, and fresh battery.',
        price: 185,
        category: 'Electronics',
        brand: 'Canon',
        condition: 'Like New',
        material: 'Metal & Glass',
        size: 'Standard',
        color: 'Silver / Black',
        status: 'Available',
        seller: alexId,
        images: [
          { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Oversized 90s Levi’s Trucker Denim Jacket',
        description: 'Authentic vintage Levi’s 70507 denim trucker jacket in medium wash. Perfectly faded with subtle distress on cuffs.',
        price: 78,
        category: 'Fashion',
        brand: "Levi's",
        condition: 'Good',
        material: '100% Cotton Denim',
        size: 'Medium',
        color: 'Medium Wash Blue',
        status: 'Available',
        seller: sarahId,
        images: [
          { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Apple AirPods Max Headphones - Space Gray',
        description: 'Lightly used Space Gray AirPods Max with Smart Case. Outstanding active noise cancellation and spatial audio.',
        price: 390,
        category: 'Electronics',
        brand: 'Apple',
        condition: 'Like New',
        material: 'Anodized Aluminum & Mesh',
        size: 'Over-Ear',
        color: 'Space Gray',
        status: 'Available',
        seller: alexId,
        images: [
          { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Minimalist Ceramic Table Lamp with Soft Shade',
        description: 'Hand-crafted beige stoneware ceramic base lamp with textured linen drum shade. Creates warm ambient lighting.',
        price: 64,
        category: 'Home & Living',
        brand: 'Artisan Workshop',
        condition: 'Brand New',
        material: 'Stoneware Ceramic',
        size: '18 inches high',
        color: 'Beige / Warm Sand',
        status: 'Available',
        seller: marcusId,
        images: [
          { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Rare Hardcover First Edition Art Architecture Book',
        description: 'Collectible coffee table book on Scandinavian Mid-Century Modern architecture. Mint condition with dust jacket.',
        price: 45,
        category: 'Books & Hobbies',
        brand: 'Taschen',
        condition: 'Like New',
        material: 'Paper & Hardcover',
        size: 'Large Folio',
        color: 'Multicolor Cover',
        status: 'Available',
        seller: sarahId,
        images: [
          { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Authentic Leather Crossbody Travel Bag',
        description: 'Genuine full-grain tan leather crossbody messenger bag with antique brass hardware and multiple pockets.',
        price: 95,
        category: 'Fashion',
        brand: 'Fossil',
        condition: 'Good',
        material: 'Full-Grain Leather',
        size: 'Medium (11x9")',
        color: 'Cognac Brown',
        status: 'Available',
        seller: marcusId,
        images: [
          { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Sony WH-1000XM4 Wireless Headphones',
        description: 'Industry-leading noise cancelling wireless headphones. Complete with original travel case and charging cables.',
        price: 195,
        category: 'Electronics',
        brand: 'Sony',
        condition: 'Like New',
        material: 'Matte Polymer',
        size: 'Over-Ear',
        color: 'Black',
        status: 'Sold',
        seller: alexId,
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Mechanical Keychron K2 Wireless Keyboard',
        description: '75% layout RGB mechanical keyboard with Gateron Brown tactile switches. Dual Mac and Windows keycaps.',
        price: 68,
        category: 'Electronics',
        brand: 'Keychron',
        condition: 'Good',
        material: 'Aluminum Frame',
        size: '75% Compact',
        color: 'Grey / Black',
        status: 'Available',
        seller: alexId,
        images: [
          { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Handmade Wool Knit Cream Sweater',
        description: 'Cozy chunky cable-knit sweater made from 100% virgin wool. Super soft, high neck, perfect winter staple.',
        price: 52,
        category: 'Fashion',
        brand: 'Handmade',
        condition: 'Brand New',
        material: '100% Virgin Wool',
        size: 'Large',
        color: 'Off-White / Cream',
        status: 'Available',
        seller: sarahId,
        images: [
          { url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Retro Pour-Over Coffee Dripper Set',
        description: 'Complete barista set including ceramic cone dripper, heat-resistant glass carafe, and stainless mesh filter.',
        price: 34,
        category: 'Home & Living',
        brand: 'Hario',
        condition: 'Brand New',
        material: 'Borosilicate Glass & Ceramic',
        size: '600ml / 2-4 Cups',
        color: 'Clear & White',
        status: 'Available',
        seller: marcusId,
        images: [
          { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Vintage Polarized Ray-Ban Wayfarer Sunglasses',
        description: 'Classic tortoiseshell Wayfarer sunglasses with polarized G-15 green lenses. Made in Italy.',
        price: 85,
        category: 'Fashion',
        brand: 'Ray-Ban',
        condition: 'Like New',
        material: 'Acetate Frame',
        size: '50mm Lens',
        color: 'Tortoiseshell / Green',
        status: 'Sold',
        seller: sarahId,
        images: [
          { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Fujifilm Instax Mini 11 Instant Camera - Blush Pink',
        description: 'Fun instant film camera with automatic exposure and built-in selfie lens. Includes carrying strap and 10 film sheets.',
        price: 55,
        category: 'Electronics',
        brand: 'Fujifilm',
        condition: 'Like New',
        material: 'Polycarbonate',
        size: 'Compact',
        color: 'Blush Pink',
        status: 'Available',
        seller: sarahId,
        images: [
          { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Modern Oak Wood Minimalist Desk Organizer',
        description: 'Solid natural oak desktop tray for pens, phone, keys, and daily EDC items. Smooth matte varnish finish.',
        price: 28,
        category: 'Home & Living',
        brand: 'Grovemade Style',
        condition: 'Brand New',
        material: 'Solid Oak Wood',
        size: '12x7 inches',
        color: 'Natural Oak',
        status: 'Available',
        seller: marcusId,
        images: [
          { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Vintage Leather Bound Journal & Fountain Pen Set',
        description: 'Handcrafted leather travel notebook with 200 unlined cream cotton pages and a classic brass nib fountain pen.',
        price: 42,
        category: 'Books & Hobbies',
        brand: 'Rustic Ridge',
        condition: 'Brand New',
        material: 'Crazy Horse Leather',
        size: 'A5 Notebook',
        color: 'Rustic Brown',
        status: 'Sold',
        seller: marcusId,
        images: [
          { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        title: 'Adidas Ultraboost 21 Running Shoes - White/Silver',
        description: 'High-performance running sneakers featuring Boost midsole responsiveness. Clean condition, sanitized.',
        price: 88,
        category: 'Fashion',
        brand: 'Adidas',
        condition: 'Good',
        material: 'Primeknit Upper',
        size: 'US Men 10',
        color: 'Cloud White',
        status: 'Available',
        seller: alexId,
        images: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80' }
        ]
      }
    ];

    await Product.create(productsData);
    console.log(`[Seed] Successfully created ${users.length} Users and ${productsData.length} Products!`);
    console.log('[Seed] Demo Credentials:');
    console.log(' - User 1: sarah@example.com / password123');
    console.log(' - User 2: alex@example.com / password123');
    console.log(' - User 3: marcus@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
