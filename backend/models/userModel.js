const pool = require('../config/db');

const UserModel = {
  // Create or update user
  createOrUpdateUser: async (firebaseUid, email, profile = {}) => {
    const {
      firstName = '',
      lastName = '',
      displayName = '',
      phoneNumber = '',
      city = '',
      country = '',
      additionalInfo = '',
      photoUrl = null
    } = profile;

    const resolvedDisplayName = displayName || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Traveler';

    const query = `
      INSERT INTO users (
        firebase_uid,
        email,
        first_name,
        last_name,
        display_name,
        phone_number,
        city,
        country,
        additional_info,
        photo_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (firebase_uid)
      DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        display_name = EXCLUDED.display_name,
        phone_number = EXCLUDED.phone_number,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        additional_info = EXCLUDED.additional_info,
        photo_url = EXCLUDED.photo_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    
    const values = [
      firebaseUid,
      email,
      firstName,
      lastName,
      resolvedDisplayName,
      phoneNumber,
      city,
      country,
      additionalInfo,
      photoUrl
    ];
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
  updateProfile: async (firebaseUid, profile = {}) => {
    const {
      firstName = '',
      lastName = '',
      displayName = '',
      phoneNumber = '',
      city = '',
      country = '',
      additionalInfo = '',
      photoUrl = null
    } = profile;

    const resolvedDisplayName = displayName || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Traveler';

    const query = `
      UPDATE users
      SET
        first_name = $2,
        last_name = $3,
        display_name = $4,
        phone_number = $5,
        city = $6,
        country = $7,
        additional_info = $8,
        photo_url = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = $1
      RETURNING *;
    `;
    
    const values = [
      firebaseUid,
      firstName,
      lastName,
      resolvedDisplayName,
      phoneNumber,
      city,
      country,
      additionalInfo,
      photoUrl
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = UserModel;