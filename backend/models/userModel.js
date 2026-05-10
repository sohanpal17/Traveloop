const pool = require('../config/db');

const UserModel = {
  // Create or update user
  createOrUpdateUser: async (firebaseUid, email, displayName, photoUrl) => {
    const query = `
      INSERT INTO users (firebase_uid, email, display_name, photo_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (firebase_uid)
      DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        photo_url = EXCLUDED.photo_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    
    const values = [firebaseUid, email, displayName, photoUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Find user by Firebase UID
  findByFirebaseUid: async (firebaseUid) => {
    const query = 'SELECT * FROM users WHERE firebase_uid = $1';
    const result = await pool.query(query, [firebaseUid]);
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Get user by ID
  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Update user profile
  updateProfile: async (firebaseUid, displayName, photoUrl) => {
    const query = `
      UPDATE users
      SET display_name = $2, photo_url = $3, updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = $1
      RETURNING *;
    `;
    
    const values = [firebaseUid, displayName, photoUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = UserModel;