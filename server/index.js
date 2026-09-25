const express = require('express');
const cors = require('cors');
const db = require('./db');
const { calcSafeUntil, currentStage, scoreRecipient, haversineKm } = require('./logic/engine');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper for Smart Food Photo Selection based on Title/Category
function getSmartFoodPhoto(title = '', foodType = '', photoUrl = '') {
  if (photoUrl && (photoUrl.startsWith('http') || photoUrl.startsWith('data:'))) return photoUrl;

  const t = (title || '').toLowerCase().trim();
  const c = (foodType || '').toLowerCase().trim();

  // 1. Gulab Jamun & Sweets
  if (t.includes('gulab jamun') || t.includes('jamun') || t.includes('rasgulla') || t.includes('jalebi') || t.includes('barfi') || t.includes('mithai') || t.includes('laddu') || t.includes('ladoo') || t.includes('halwa')) {
    return 'http://localhost:5173/gulab_jamun.png'; // Exact uploaded Gulab Jamun photo
  }
  // 2. Cake & Pastry
  if (t.includes('cake') || t.includes('pastry') || t.includes('muffin') || t.includes('brownie')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
  }
  // 3. Ice Cream & Shakes
  if (t.includes('ice cream') || t.includes('kheer') || t.includes('falooda') || t.includes('shake') || t.includes('kulfi')) {
    return 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=600&q=80';
  }
  // 4. Momos & Dimsum
  if (t.includes('momo') || t.includes('dimsum') || t.includes('dumpling')) {
    return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80';
  }
  // 5. Chinese / Chowmein / Noodles / Manchurian
  if (t.includes('noodle') || t.includes('chinese') || t.includes('chowmein') || t.includes('manchurian') || t.includes('spring roll')) {
    return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80';
  }
  // 6. Dal Makhani
  if (t.includes('dal') || t.includes('makhani') || t.includes('dal makhani') || t.includes('dal tadka')) {
    return 'http://localhost:5173/dal_makhani.png';
  }
  // 7. Paneer Dishes
  if (t.includes('paneer') || t.includes('shahi') || t.includes('kadhai paneer')) {
    return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80';
  }
  // 8. Indian Curries & Gravy
  if (t.includes('curry') || t.includes('gravy') || t.includes('korma') || t.includes('palak')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
  }
  // 9. Biryani & Rice
  if (t.includes('biryani') || t.includes('pulao') || t.includes('rice') || t.includes('chawal') || t.includes('fried rice')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  }
  // 10. Chole Bhature
  if (t.includes('chole') || t.includes('bhature') || t.includes('bhatura')) {
    return 'http://localhost:5173/chole_bhature.png';
  }
  if (t.includes('naan') || t.includes('roti') || t.includes('paratha') || t.includes('kulcha') || t.includes('pav')) {
    return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80';
  }
  // 11. Samosa & Indian Snacks
  if (t.includes('samosa') || t.includes('kachori') || t.includes('pakora') || t.includes('vada') || t.includes('tikki')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
  }
  // 12. Dosa & South Indian
  if (t.includes('dosa') || t.includes('idli') || t.includes('uttapam') || t.includes('sambar')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80';
  }
  // 13. Pizza
  if (t.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80';
  }
  // 14. Burger & Sandwich
  if (t.includes('burger') || t.includes('sandwich') || t.includes('fries')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  }
  // 15. Pav Bhaji
  if (t.includes('pav bhaji') || t.includes('bhaji')) {
    return 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80';
  }
  // 16. Pasta
  if (t.includes('pasta') || t.includes('macaroni')) {
    return 'https://images.unsplash.com/photo-1621996346565-e3d5d6281274?auto=format&fit=crop&w=600&q=80';
  }

  // Dynamic search lookup for any custom dish name
  const cleanTitle = t.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  if (cleanTitle) {
    return `https://loremflickr.com/600/400/${encodeURIComponent(cleanTitle)},food/all`;
  }

  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
}

// Fix existing database rows that have mismatched photos
function fixExistingPhotos() {
  const listings = db.prepare('SELECT id, title, food_type, photo_url FROM listings').all();
  const updateStmt = db.prepare('UPDATE listings SET photo_url = ? WHERE id = ?');
  listings.forEach(l => {
    const smartPhoto = getSmartFoodPhoto(l.title, l.food_type, '');
    updateStmt.run(smartPhoto, l.id);
  });
}
fixExistingPhotos();

// Helper to get current simulated time
function getSimulatedTimeMs() {
  const clockRow = db.prepare('SELECT simulated_offset_minutes FROM system_clock WHERE id = 1').get();
  const offsetMinutes = clockRow ? clockRow.simulated_offset_minutes : 0;
  return Date.now() + (offsetMinutes * 60 * 1000);
}

// 1. Clock APIs (Demo Clock Controller)
app.get('/api/clock', (req, res) => {
  const clockRow = db.prepare('SELECT simulated_offset_minutes FROM system_clock WHERE id = 1').get();
  const offsetMinutes = clockRow ? clockRow.simulated_offset_minutes : 0;
  const simulatedTimeMs = Date.now() + (offsetMinutes * 60 * 1000);
  res.json({
    simulated_offset_minutes: offsetMinutes,
    simulated_time: new Date(simulatedTimeMs).toISOString(),
    is_simulated: offsetMinutes > 0
  });
});

app.post('/api/clock/offset', (req, res) => {
  const { minutes, reset } = req.body;
  let currentOffset = db.prepare('SELECT simulated_offset_minutes FROM system_clock WHERE id = 1').get()?.simulated_offset_minutes || 0;
  
  let newOffset = reset ? 0 : currentOffset + Number(minutes || 0);
  db.prepare('UPDATE system_clock SET simulated_offset_minutes = ? WHERE id = 1').run(newOffset);
  
  const simulatedTimeMs = Date.now() + (newOffset * 60 * 1000);
  res.json({
    simulated_offset_minutes: newOffset,
    simulated_time: new Date(simulatedTimeMs).toISOString(),
    is_simulated: newOffset > 0
  });
});

// 2. Listings APIs (Browse Deals, Post Surplus)
app.get('/api/listings', (req, res) => {
  const { q, category, stage, veg, sort } = req.query;
  const nowMs = getSimulatedTimeMs();

  let listings = db.prepare('SELECT * FROM listings ORDER BY id DESC').all();

  listings = listings.map(l => {
    const stageInfo = currentStage(l, nowMs);
    const safeUntilMs = new Date(l.safe_until).getTime();
    const remainingMs = Math.max(0, safeUntilMs - nowMs);
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      ...l,
      computed_stage: stageInfo,
      safe_for_text: `${remainingHours}h ${remainingMins}m`,
      remaining_ms: remainingMs
    };
  });

  if (q) {
    const query = q.toLowerCase();
    listings = listings.filter(l => 
      l.title.toLowerCase().includes(query) || 
      l.donor_name.toLowerCase().includes(query) ||
      l.pickup_address.toLowerCase().includes(query)
    );
  }

  if (category) {
    listings = listings.filter(l => l.food_type === category);
  }

  if (stage) {
    const targetStage = parseInt(stage, 10);
    listings = listings.filter(l => l.computed_stage.stage === targetStage);
  }

  if (veg === '1') {
    listings = listings.filter(l => l.is_veg === 1);
  }

  res.json(listings);
});

app.get('/api/listings/:id', (req, res) => {
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const nowMs = getSimulatedTimeMs();
  const stageInfo = currentStage(listing, nowMs);
  res.json({ ...listing, computed_stage: stageInfo });
});

app.post('/api/listings', (req, res) => {
  const {
    title, donor_name, donor_phone, food_type, is_veg, portions,
    weight_kg, deal_price, original_price, photo_url, pickup_address,
    pickup_lat, pickup_lng, donate_only
  } = req.body;

  const now = new Date(getSimulatedTimeMs());
  const posted_at = now.toISOString();
  const ready_at = posted_at;
  const safe_until = calcSafeUntil(food_type || 'Cooked Meals', ready_at);
  const start_stage = (portions >= 15 || donate_only) ? 3 : 1;
  const weight = weight_kg || (portions * 0.4);

  const smartPhoto = getSmartFoodPhoto(title, food_type, photo_url);
  const donorDisplayName = donor_name && donor_name.trim() ? donor_name.trim() : 'Local Food Outlet';

  const stmt = db.prepare(`
    INSERT INTO listings (
      title, donor_name, donor_phone, food_type, is_veg, portions, weight_kg,
      deal_price, original_price, photo_url, pickup_address, pickup_lat, pickup_lng,
      posted_at, ready_at, safe_until, donate_only, start_stage, status,
      pickup_otp, delivery_otp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    title, donorDisplayName, donor_phone || '+91 98765 43210',
    food_type || 'Cooked Meals', is_veg ? 1 : 0, portions || 10, weight,
    deal_price || 0, original_price || 200,
    smartPhoto,
    pickup_address || 'Jaipur, Rajasthan', pickup_lat || 26.8530, pickup_lng || 75.8047,
    posted_at, ready_at, safe_until, donate_only ? 1 : 0, start_stage, 'AVAILABLE',
    '4821', '9374'
  );

  const newListing = db.prepare('SELECT * FROM listings WHERE id = ?').get(info.lastInsertRowid);
  db.prepare('INSERT INTO listing_events (listing_id, status, timestamp, note) VALUES (?, ?, ?, ?)').run(
    info.lastInsertRowid, 'POSTED', posted_at, `New surplus posted by ${donorDisplayName}`
  );

  res.status(201).json(newListing);
});

app.post('/api/listings/:id/claim', (req, res) => {
  const { claimed_by, type } = req.body;
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const status = type === 'reserve' ? 'RESERVED' : 'MATCHED';
  db.prepare('UPDATE listings SET status = ?, claimed_by = ? WHERE id = ?').run(status, claimed_by || 'User', req.params.id);
  
  db.prepare('INSERT INTO listing_events (listing_id, status, timestamp, note) VALUES (?, ?, ?, ?)').run(
    req.params.id, status, new Date().toISOString(), `Listing ${status} by ${claimed_by || 'User'}`
  );

  res.json({ message: 'Success', listing_id: req.params.id, status });
});

app.delete('/api/listings/:id', (req, res) => {
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  db.prepare('DELETE FROM listings WHERE id = ?').run(req.params.id);
  db.prepare('DELETE FROM listing_events WHERE listing_id = ?').run(req.params.id);
  res.json({ success: true, message: `Listing ${req.params.id} deleted` });
});

// 3. Spots APIs (Donate to a Spot)
app.get('/api/spots', (req, res) => {
  const spots = db.prepare('SELECT * FROM spots').all();
  res.json(spots);
});

app.post('/api/spots', (req, res) => {
  const { name, kind, description, image_url, lat, lng, capacity_total, food_preferences } = req.body;
  const stmt = db.prepare(`
    INSERT INTO spots (name, kind, description, image_url, lat, lng, capacity_total, capacity_used, food_preferences, verified_level, distance_km)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'Community Vouched (1 Vouch)', 1.5)
  `);
  const info = stmt.run(
    name, kind || 'community', description || 'Community food pickup spot',
    image_url || 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=600&q=80',
    lat, lng, capacity_total || 50, food_preferences || 'Veg Only, Cooked Meals'
  );
  res.status(201).json(db.prepare('SELECT * FROM spots WHERE id = ?').get(info.lastInsertRowid));
});

// 4. NGO Inbox & Matching APIs
app.get('/api/ngo/offers', (req, res) => {
  const nowMs = getSimulatedTimeMs();
  const ngoSpot = db.prepare("SELECT * FROM spots WHERE kind = 'ngo' LIMIT 1").get();
  
  let listings = db.prepare("SELECT * FROM listings WHERE portions >= 15 OR start_stage = 3 OR status = 'MATCHED'").all();
  
  const offers = listings.map(l => {
    const scoreData = ngoSpot ? scoreRecipient(l, ngoSpot, nowMs) : { score: 78, breakdown: { distanceScore: 32, capacityScore: 18, needScore: 14, prefScore: 14 } };
    return {
      listing: { ...l, computed_stage: currentStage(l, nowMs) },
      match_score: scoreData.score || 78,
      breakdown: scoreData.breakdown || { distanceScore: 32, capacityScore: 18, needScore: 14, prefScore: 14 },
      accept_within_mins: 10
    };
  });

  res.json(offers);
});

// 5. Volunteer Runner Task APIs
app.get('/api/runner/task', (req, res) => {
  const activeListing = db.prepare("SELECT * FROM listings WHERE status IN ('MATCHED', 'PICKED_UP', 'IN_PROGRESS') ORDER BY id DESC LIMIT 1").get();
  
  if (!activeListing) {
    return res.json({
      task_id: '#PR-4821',
      status: 'MATCHED',
      status_text: 'In Progress',
      pickup: {
        name: 'Biryani House, Sector 18',
        address: 'Shop No. 12, Sector 18, Noida, UP 201301',
        lat: 28.5700, lng: 77.3200
      },
      dropoff: {
        name: 'Shri Ram Community Shelter',
        address: '12, Seva Marg, Sector 22, Noida, UP 201301',
        lat: 28.5900, lng: 77.3400
      },
      distance_km: 5.8,
      eta_mins: 18,
      pickup_otp: '4821',
      delivery_otp: '9374',
      pickup_verified: false,
      delivery_verified: false
    });
  }

  res.json({
    task_id: `#PR-${activeListing.id + 4000}`,
    status: activeListing.status,
    status_text: activeListing.status === 'DELIVERED' ? 'Completed' : 'In Progress',
    pickup: {
      name: activeListing.donor_name,
      address: activeListing.pickup_address,
      lat: activeListing.pickup_lat,
      lng: activeListing.pickup_lng
    },
    dropoff: {
      name: activeListing.destination_spot_id ? 'Green Field NGO' : 'Shri Ram Community Shelter',
      address: '12, Seva Marg, Sector 22, Jaipur / Noida',
      lat: 26.9124, lng: 75.7873
    },
    distance_km: 5.8,
    eta_mins: 18,
    pickup_otp: activeListing.pickup_otp || '4821',
    delivery_otp: activeListing.delivery_otp || '9374',
    pickup_verified: activeListing.status === 'PICKED_UP' || activeListing.status === 'DELIVERED',
    delivery_verified: activeListing.status === 'DELIVERED'
  });
});

app.post('/api/runner/verify-otp', (req, res) => {
  const { pickup_otp, delivery_otp } = req.body;
  
  let listing = db.prepare("SELECT * FROM listings WHERE status IN ('MATCHED', 'PICKED_UP', 'AVAILABLE') ORDER BY id DESC LIMIT 1").get();
  
  if (!listing) {
    return res.json({ success: true, message: 'OTP Verified successfully', new_status: 'DELIVERED' });
  }

  let newStatus = listing.status;
  if (pickup_otp === (listing.pickup_otp || '4821')) {
    newStatus = 'PICKED_UP';
  }
  if (delivery_otp === (listing.delivery_otp || '9374')) {
    newStatus = 'DELIVERED';
  }

  db.prepare('UPDATE listings SET status = ? WHERE id = ?').run(newStatus, listing.id);
  db.prepare('INSERT INTO listing_events (listing_id, status, timestamp, note) VALUES (?, ?, ?, ?)').run(
    listing.id, newStatus, new Date().toISOString(), `OTP verified by Runner. Status: ${newStatus}`
  );

  res.json({ success: true, new_status: newStatus, message: `Status updated to ${newStatus}` });
});

// 6. Impact Dashboard APIs
app.get('/api/dashboard/stats', (req, res) => {
  const result = db.prepare(`
    SELECT 
      COUNT(*) as total_listings,
      COALESCE(SUM(portions), 0) as total_portions,
      COALESCE(SUM(weight_kg), 0) as total_weight,
      COUNT(DISTINCT donor_name) as total_donors
    FROM listings
  `).get();

  const mealsRescued = 12480 + (result.total_portions || 0);
  const foodSavedKg = 28736 + Math.round(result.total_weight || 0);
  const co2eSavedKg = Math.round(foodSavedKg * 2.5);
  const activeDonors = 120 + (result.total_donors || 0);

  res.json({
    meals_rescued: mealsRescued,
    food_saved_kg: foodSavedKg,
    co2e_saved_kg: co2eSavedKg,
    active_donors: activeDonors,
    receipt: {
      id: '#PR-2025-0422-007',
      date_range: 'Apr 8, 2025 - Apr 22, 2025',
      meals: mealsRescued,
      kg: foodSavedKg,
      co2e: co2eSavedKg,
      donors: activeDonors
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PlateRelay Backend Express API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
