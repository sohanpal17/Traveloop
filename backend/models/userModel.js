const pool = require('../config/db');

const UserModel = {
  createUser: async (name, email, passwordHash) => {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, passwordHash]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  updateProfile: async (id, name) => {
    const result = await pool.query(
      `UPDATE users SET name=$1, updated_at=NOW()
       WHERE id=$2 RETURNING id, name, email`,
      [name, id]
    );
    return result.rows[0];
  }
};

module.exports = UserModel;