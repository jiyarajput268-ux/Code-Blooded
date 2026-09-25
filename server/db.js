const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      phone TEXT,
      trust_score INTEGER DEFAULT 100
    );

    CREATE TABLE IF NOT EXISTS spots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      capacity_total INTEGER DEFAULT 80,
      capacity_used INTEGER DEFAULT 40,
      food_preferences TEXT DEFAULT 'Veg Only, Cooked Meals',
      verified_level TEXT DEFAULT 'Community Vouched (5 Vouches)',
      distance_km REAL DEFAULT 1.8
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      donor_name TEXT NOT NULL,
      donor_phone TEXT,
      food_type TEXT NOT NULL,
      is_veg INTEGER DEFAULT 1,
      portions INTEGER NOT NULL,
      weight_kg REAL NOT NULL,
      deal_price REAL DEFAULT 0,
      original_price REAL DEFAULT 0,
      photo_url TEXT,
      pickup_address TEXT NOT NULL,
      pickup_lat REAL DEFAULT 26.8530,
      pickup_lng REAL DEFAULT 75.8047,
      posted_at TEXT NOT NULL,
      ready_at TEXT NOT NULL,
      safe_until TEXT NOT NULL,
      donate_only INTEGER DEFAULT 0,
      start_stage INTEGER DEFAULT 1,
      status TEXT DEFAULT 'AVAILABLE',
      claimed_by TEXT,
      destination_spot_id INTEGER,
      runner_id INTEGER,
      pickup_otp TEXT DEFAULT '4821',
      delivery_otp TEXT DEFAULT '9374'
    );

    CREATE TABLE IF NOT EXISTS listing_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS safety_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_type TEXT UNIQUE NOT NULL,
      safe_hours INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS system_clock (
      id INTEGER PRIMARY KEY DEFAULT 1,
      simulated_offset_minutes INTEGER DEFAULT 0
    );

    -- Ensure initial clock row exists
    INSERT OR IGNORE INTO system_clock (id, simulated_offset_minutes) VALUES (1, 0);
  `);

  console.log("SQLite Database initialized successfully at:", dbPath);
}

initDb();

module.exports = db;
