const mongoose = require('mongoose');
const connectMongoDB = require('./config/dbMongo');
const User = require('./models/User');
const Spot = require('./models/Spot');
const Listing = require('./models/Listing');

async function seedMongoDatabase() {
  console.log("Connecting to MongoDB database to seed sample data...");
  const connected = await connectMongoDB();
  
  if (!connected) {
    console.log("Could not connect to MongoDB. Please ensure MongoDB service or Atlas URI is active.");
    process.exit(1);
  }

  // Clear existing collections
  await User.deleteMany({});
  await Spot.deleteMany({});
  await Listing.deleteMany({});

  console.log("Cleared existing MongoDB collections. Inserting seed data...");

  // 1. Seed Users
  await User.create([
    { name: 'Biryani House (Donor)', email: 'donor@platerelay.com', role: 'donor', phone: '+91 98765 43210' },
    { name: 'Rahul Sharma (Buyer)', email: 'buyer@platerelay.com', role: 'buyer', phone: '+91 98123 45678' },
    { name: 'Green Field NGO (Recipient)', email: 'ngo@platerelay.com', role: 'recipient', phone: '+91 98999 11122' },
    { name: 'Vikram Singh (Runner)', email: 'runner@platerelay.com', role: 'runner', phone: '+91 97111 22233' },
    { name: 'Admin Demo', email: 'admin@platerelay.com', role: 'admin', phone: '+91 99999 00000' }
  ]);

  // 2. Seed Spots
  await Spot.create([
    {
      name: 'Shri Krishna Langar & Shelter',
      kind: 'community',
      description: 'Provides free meals and shelter to daily wage workers, homeless people and needy families in the area.',
      imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=600&q=80',
      lat: 26.9124, lng: 75.7873,
      capacityTotal: 80, capacityUsed: 40,
      foodPreferences: 'Veg Only, Cooked Meals',
      verifiedLevel: 'Community Vouched (5 Vouches)',
      distanceKm: 1.8
    },
    {
      name: 'Green Field NGO',
      kind: 'ngo',
      description: 'Community shelter supporting underprivileged children and families with daily nutritious meals.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      lat: 26.8900, lng: 75.8100,
      capacityTotal: 100, capacityUsed: 50,
      foodPreferences: 'Veg Only, Cooked Meals',
      verifiedLevel: 'NGO Verified',
      distanceKm: 1.2
    },
    {
      name: 'Hope Foundation',
      kind: 'ngo',
      description: 'Direct relief center providing hot meals and essential food packets to night shelters.',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
      lat: 26.8700, lng: 75.7900,
      capacityTotal: 60, capacityUsed: 20,
      foodPreferences: 'Veg Only, Cooked Meals',
      verifiedLevel: 'NGO Verified',
      distanceKm: 3.6
    }
  ]);

  // 3. Seed Listings
  const now = new Date();
  const safeUntil1 = new Date(now.getTime() + 2.75 * 60 * 60 * 1000);

  await Listing.create([
    {
      title: 'Surplus Paneer Butter Masala',
      donorName: 'The Spice Route',
      donorPhone: '+91 98765 11111',
      foodType: 'Cooked Meals',
      isVeg: true,
      portions: 6,
      weightKg: 2.4,
      dealPrice: 140,
      originalPrice: 350,
      photoUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
      pickupAddress: 'Shop No. 12, Sector 18, Jaipur',
      pickupLat: 26.8530, pickupLng: 75.8047,
      postedAt: now, readyAt: now, safeUntil: safeUntil1,
      startStage: 1, status: 'AVAILABLE',
      pickupOtp: '4821', deliveryOtp: '9374'
    },
    {
      title: 'Surplus Veg Biryani',
      donorName: 'Grand Hotel Canteen',
      donorPhone: '+91 98765 43210',
      foodType: 'Cooked Meals',
      isVeg: true,
      portions: 25,
      weightKg: 10.0,
      dealPrice: 0,
      originalPrice: 1250,
      photoUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      pickupAddress: 'Hostel Mess, Block C, SKIT Jaipur',
      pickupLat: 26.8220, pickupLng: 75.8650,
      postedAt: now, readyAt: now, safeUntil: safeUntil1,
      startStage: 3, status: 'MATCHED',
      pickupOtp: '4821', deliveryOtp: '9374'
    }
  ]);

  console.log("MongoDB Database successfully seeded with sample data!");
  await mongoose.disconnect();
  process.exit(0);
}

seedMongoDatabase();
