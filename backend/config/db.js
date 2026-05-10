const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err.stack);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

// Create all tables
const createTables = async () => {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firebase_uid VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      display_name VARCHAR(255),
      phone_number VARCHAR(50),
      city VARCHAR(255),
      country VARCHAR(255),
      additional_info TEXT,
      photo_url TEXT,
      language_preference VARCHAR(10) DEFAULT 'en',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const syncUsersColumns = `
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS city VARCHAR(255),
      ADD COLUMN IF NOT EXISTS country VARCHAR(255),
      ADD COLUMN IF NOT EXISTS additional_info TEXT;
  `;

  // Trips table
  const createTripsTable = `
    CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      start_date DATE,
      end_date DATE,
      cover_photo_url TEXT,
      total_budget DECIMAL(10, 2) DEFAULT 0,
      is_public BOOLEAN DEFAULT false,
      public_url_slug VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
    CREATE INDEX IF NOT EXISTS idx_trips_public_slug ON trips(public_url_slug);
  `;

  // Stops table
  const createStopsTable = `
    CREATE TABLE IF NOT EXISTS stops (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      city VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      start_date DATE,
      end_date DATE,
      duration_days INTEGER,
      notes TEXT,
      order_index INTEGER DEFAULT 0,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_stops_trip_id ON stops(trip_id);
  `;

  // Activities table
  const createActivitiesTable = `
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      stop_id INTEGER REFERENCES stops(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      estimated_cost DECIMAL(10, 2) DEFAULT 0,
      actual_cost DECIMAL(10, 2),
      date DATE,
      time TIME,
      duration_minutes INTEGER,
      location VARCHAR(255),
      booking_url TEXT,
      is_completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_activities_stop_id ON activities(stop_id);
  `;

  // Budget table
  const createBudgetTable = `
    CREATE TABLE IF NOT EXISTS budget_items (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      stop_id INTEGER REFERENCES stops(id) ON DELETE CASCADE,
      category VARCHAR(100) NOT NULL,
      item_name VARCHAR(255) NOT NULL,
      estimated_cost DECIMAL(10, 2) NOT NULL,
      actual_cost DECIMAL(10, 2),
      date DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_budget_trip_id ON budget_items(trip_id);
  `;

  // Packing lists table
  const createPackingTable = `
    CREATE TABLE IF NOT EXISTS packing_items (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      item_name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      quantity INTEGER DEFAULT 1,
      is_packed BOOLEAN DEFAULT false,
      priority VARCHAR(20) DEFAULT 'medium',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_packing_trip_id ON packing_items(trip_id);
  `;

  // Notes/Journal table
  const createNotesTable = `
    CREATE TABLE IF NOT EXISTS trip_notes (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      stop_id INTEGER REFERENCES stops(id) ON DELETE SET NULL,
      title VARCHAR(255),
      content TEXT NOT NULL,
      note_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_notes_trip_id ON trip_notes(trip_id);
  `;

  // Cities database (for search)
  const createCitiesTable = `
    CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      region VARCHAR(255),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      cost_index INTEGER DEFAULT 50,
      popularity_score INTEGER DEFAULT 0,
      description TEXT,
      image_url TEXT,
      best_time_to_visit VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
    CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country);
  `;

  // Saved destinations
  const createSavedDestinationsTable = `
    CREATE TABLE IF NOT EXISTS saved_destinations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, city_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_saved_dest_user_id ON saved_destinations(user_id);
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(syncUsersColumns);
    await pool.query(createTripsTable);
    await pool.query(createStopsTable);
    await pool.query(createActivitiesTable);
    await pool.query(createBudgetTable);
    await pool.query(createPackingTable);
    await pool.query(createNotesTable);
    await pool.query(createCitiesTable);
    await pool.query(createSavedDestinationsTable);
    
    console.log('✅ Database tables created successfully');
    
    // Seed some cities data
    await seedCities();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Seed initial cities data
const seedCities = async () => {
  const checkCities = await pool.query('SELECT COUNT(*) FROM cities');
  
  if (parseInt(checkCities.rows[0].count) === 0) {
    const cities = [
      ['Paris', 'France', 'Europe', 48.8566, 2.3522, 75, 95, 'The City of Light', null, 'April-June, September-October'],
      ['Tokyo', 'Japan', 'Asia', 35.6762, 139.6503, 80, 90, 'Modern metropolis with traditional culture', null, 'March-May, September-November'],
      ['New York', 'United States', 'North America', 40.7128, -74.0060, 85, 92, 'The Big Apple', null, 'April-June, September-November'],
      ['London', 'United Kingdom', 'Europe', 51.5074, -0.1278, 80, 88, 'Historic capital with modern culture', null, 'May-September'],
      ['Dubai', 'UAE', 'Middle East', 25.2048, 55.2708, 70, 85, 'Luxury and innovation', null, 'November-March'],
      ['Barcelona', 'Spain', 'Europe', 41.3851, 2.1734, 65, 87, 'Gaudí architecture and Mediterranean beaches', null, 'May-June, September-October'],
      ['Rome', 'Italy', 'Europe', 41.9028, 12.4964, 70, 90, 'Ancient history and culture', null, 'April-June, September-October'],
      ['Bangkok', 'Thailand', 'Asia', 13.7563, 100.5018, 45, 86, 'Street food paradise and temples', null, 'November-February'],
      ['Sydney', 'Australia', 'Oceania', -33.8688, 151.2093, 75, 84, 'Harbor city with beaches', null, 'September-November, March-May'],
      ['Istanbul', 'Turkey', 'Europe/Asia', 41.0082, 28.9784, 55, 83, 'Where East meets West', null, 'April-May, September-November'],
      ['Amsterdam', 'Netherlands', 'Europe', 52.3676, 4.9041, 75, 82, 'Canals and culture', null, 'April-May, September-October'],
      ['Singapore', 'Singapore', 'Asia', 1.3521, 103.8198, 80, 85, 'Garden city of the future', null, 'February-April'],
      ['Bali', 'Indonesia', 'Asia', -8.3405, 115.0920, 40, 88, 'Island paradise', null, 'April-October'],
      ['Los Angeles', 'United States', 'North America', 34.0522, -118.2437, 75, 81, 'Entertainment capital', null, 'March-May, September-November'],
      ['Prague', 'Czech Republic', 'Europe', 50.0755, 14.4378, 50, 79, 'Medieval architecture', null, 'April-June, September-October']
    ];

    const insertQuery = `
      INSERT INTO cities (name, country, region, latitude, longitude, cost_index, popularity_score, description, image_url, best_time_to_visit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    for (const city of cities) {
      try {
        await pool.query(insertQuery, city);
      } catch (error) {
        console.error('Error seeding city:', city[0], error);
      }
    }
    
    console.log('✅ Cities data seeded successfully');
  }
};

createTables();

module.exports = pool;