const db = require('./db');
const { calcSafeUntil } = require('./logic/engine');

function seedDatabase() {
  console.log("Seeding database with realistic sample data matching reference screens...");

  // Clear existing tables
  db.exec(`
    DELETE FROM users;
    DELETE FROM spots;
    DELETE FROM listings;
    DELETE FROM listing_events;
    DELETE FROM safety_rules;
    DELETE FROM system_clock;
    INSERT INTO system_clock (id, simulated_offset_minutes) VALUES (1, 0);
  `);

  // 1. Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, role, phone, trust_score)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('Biryani House (Donor)', 'donor@platerelay.com', 'donor', '+91 98765 43210', 98);
  insertUser.run('Rahul Sharma (Buyer)', 'buyer@platerelay.com', 'buyer', '+91 98123 45678', 100);
  insertUser.run('Green Field NGO (Recipient)', 'ngo@platerelay.com', 'recipient', '+91 98999 11122', 95);
  insertUser.run('Vikram Singh (Runner)', 'runner@platerelay.com', 'runner', '+91 97111 22233', 99);
  insertUser.run('Admin Demo', 'admin@platerelay.com', 'admin', '+91 99999 00000', 100);

  // 2. Seed Safety Rules
  const insertRule = db.prepare(`INSERT INTO safety_rules (food_type, safe_hours) VALUES (?, ?)`);
  insertRule.run('Cooked Meals', 4);
  insertRule.run('Bakery', 24);
  insertRule.run('Dairy', 2);
  insertRule.run('Snacks', 6);

  // 3. Seed Spots
  const insertSpot = db.prepare(`
    INSERT INTO spots (name, kind, description, image_url, lat, lng, capacity_total, capacity_used, food_preferences, verified_level, distance_km)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSpot.run(
    'Shri Krishna Langar & Shelter',
    'community',
    'Provides free meals and shelter to daily wage workers, homeless people and needy families in the area.',
    'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=600&q=80',
    26.9124, 75.7873,
    80, 40,
    'Veg Only, Cooked Meals',
    'Community Vouched (5 Vouches)',
    1.8
  );

  insertSpot.run(
    'Green Field NGO',
    'ngo',
    'Community shelter supporting underprivileged children and families with daily nutritious meals.',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    26.8900, 75.8100,
    100, 50,
    'Veg Only, Cooked Meals',
    'NGO Verified',
    1.2
  );

  insertSpot.run(
    'Hope Foundation',
    'ngo',
    'Direct relief center providing hot meals and essential food packets to night shelters.',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    26.8700, 75.7900,
    60, 20,
    'Veg Only, Cooked Meals',
    'NGO Verified',
    3.6
  );

  insertSpot.run(
    'Seva Shelter',
    'community',
    'Roadside community kitchen offering warm food and fresh roti to workers.',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80',
    26.9300, 75.8200,
    70, 30,
    'Veg Only, Cooked Meals',
    'Community Vouched (3 Vouches)',
    4.8
  );

  // 4. Seed Listings
  const now = new Date();
  const isoNow = now.toISOString();

  const insertListing = db.prepare(`
    INSERT INTO listings (
      title, donor_name, donor_phone, food_type, is_veg, portions, weight_kg,
      deal_price, original_price, photo_url, pickup_address, pickup_lat, pickup_lng,
      posted_at, ready_at, safe_until, donate_only, start_stage, status,
      claimed_by, destination_spot_id, runner_id, pickup_otp, delivery_otp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Listing 1: Paneer Butter Masala (Stage 1 Deal)
  const ready1 = new Date(now.getTime() - 1.25 * 60 * 60 * 1000).toISOString(); // 1.25 hrs ago
  const safe1 = new Date(now.getTime() + 2.75 * 60 * 60 * 1000).toISOString();  // Safe for 2h 45m
  insertListing.run(
    'Surplus Paneer Butter Masala', 'The Spice Route', '+91 98765 11111',
    'Cooked Meals', 1, 6, 2.4, 140, 350,
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    'Shop No. 12, Sector 18, Jaipur', 26.8530, 75.8047,
    ready1, ready1, safe1, 0, 1, 'AVAILABLE', null, null, null, '4821', '9374'
  );

  // Listing 2: Veg Biryani (Stage 1 Deal)
  const ready2 = new Date(now.getTime() - 1.75 * 60 * 60 * 1000).toISOString();
  const safe2 = new Date(now.getTime() + 2.25 * 60 * 60 * 1000).toISOString();
  insertListing.run(
    'Surplus Veg Biryani', 'Biryani House', '+91 98765 22222',
    'Cooked Meals', 1, 4, 1.8, 120, 300,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    'Block C, Malviya Nagar, Jaipur', 26.8500, 75.8100,
    ready2, ready2, safe2, 0, 1, 'AVAILABLE', null, null, null, '4821', '9374'
  );

  // Listing 3: Chole Bhature (Stage 2 Free Share)
  const ready3 = new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString();
  const safe3 = new Date(now.getTime() + 1.5 * 60 * 60 * 1000).toISOString();
  insertListing.run(
    'Chole Bhature', 'Punjabi Junction', '+91 98765 33333',
    'Cooked Meals', 1, 8, 3.2, 0, 200,
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    'Main Market, Raja Park, Jaipur', 26.8900, 75.8200,
    ready3, ready3, safe3, 1, 2, 'AVAILABLE', null, null, null, '4821', '9374'
  );

  // Listing 4: Dal Makhani (Stage 1 Deal)
  const ready4 = new Date(now.getTime() - 0.7 * 60 * 60 * 1000).toISOString();
  const safe4 = new Date(now.getTime() + 3.3 * 60 * 60 * 1000).toISOString();
  insertListing.run(
    'Surplus Dal Makhani', 'Urban Tadka', '+91 98765 44444',
    'Cooked Meals', 1, 5, 2.0, 130, 260,
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    'MI Road, Pink City, Jaipur', 26.9200, 75.8100,
    ready4, ready4, safe4, 0, 1, 'AVAILABLE', null, null, null, '4821', '9374'
  );

  // Listing 5: Fresh Veg Biryani (Bulk NGO Match - Stage 3 NGO Bulk Rescue)
  const ready5 = new Date(now.getTime() - 0.5 * 60 * 60 * 1000).toISOString();
  const safe5 = new Date(now.getTime() + 3.5 * 60 * 60 * 1000).toISOString();
  const listing5Id = insertListing.run(
    'Surplus Veg Biryani', 'Grand Hotel Canteen', '+91 98765 43210',
    'Cooked Meals', 1, 25, 10.0, 0, 1250,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    'Hostel Mess, Block C, SKIT Jaipur', 26.8220, 75.8650,
    ready5, ready5, safe5, 1, 3, 'MATCHED', 'Green Field NGO', 2, 4, '4821', '9374'
  ).lastInsertRowid;

  // Insert Listing Events for audit trail
  const insertEvent = db.prepare(`INSERT INTO listing_events (listing_id, status, timestamp, note) VALUES (?, ?, ?, ?)`);
  insertEvent.run(listing5Id, 'MATCHED', isoNow, 'Matched to Green Field NGO via weighted scoring (Score: 78/100)');
  insertEvent.run(listing5Id, 'ASSIGNED', isoNow, 'Runner Vikram Singh assigned for pickup and delivery handoff');

  console.log("Database successfully seeded!");
}

seedDatabase();
