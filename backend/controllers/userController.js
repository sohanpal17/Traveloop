const pool = require('../config/db');
const UserModel = require('../models/userModel');
const TripModel = require('../models/tripModel');
const { uploadToCloudinary } = require('../utils/imageUpload');

const userController = {
  getProfile: async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        user: {
          id: req.user.id,
          firebaseUid: req.user.firebase_uid,
          email: req.user.email,
          displayName: req.user.display_name,
          photoUrl: req.user.photo_url,
          languagePreference: req.user.language_preference,
          createdAt: req.user.created_at,
          updatedAt: req.user.updated_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const firebaseUid = req.user.firebase_uid;
      const { displayName } = req.body;
      let photoUrl = req.body.photoUrl || req.user.photo_url || null;

      if (req.file) {
        photoUrl = await uploadToCloudinary(req.file.buffer, 'traveloop/profiles');
      }

      const updatedUser = await UserModel.updateProfile(firebaseUid, displayName, photoUrl);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          firebaseUid: updatedUser.firebase_uid,
          email: updatedUser.email,
          displayName: updatedUser.display_name,
          photoUrl: updatedUser.photo_url,
          languagePreference: updatedUser.language_preference,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const firebaseUid = req.user.firebase_uid;
      const userId = req.user.id;

      await pool.query('DELETE FROM users WHERE id = $1', [userId]);

      return res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
        firebaseUid
      });
    } catch (error) {
      console.error('Delete account error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete account',
        error: error.message
      });
    }
  },

  getStatistics: async (req, res) => {
    try {
      const userId = req.user.id;

      const tripsResult = await pool.query(
        'SELECT COUNT(*)::int AS total_trips, COUNT(CASE WHEN is_public = true THEN 1 END)::int AS public_trips FROM trips WHERE user_id = $1',
        [userId]
      );

      const destinationsResult = await pool.query(
        'SELECT COUNT(*)::int AS saved_destinations FROM saved_destinations WHERE user_id = $1',
        [userId]
      );

      const noteResult = await pool.query(
        'SELECT COUNT(*)::int AS notes_count FROM trip_notes WHERE trip_id IN (SELECT id FROM trips WHERE user_id = $1)',
        [userId]
      );

      const stats = {
        ...tripsResult.rows[0],
        ...destinationsResult.rows[0],
        ...noteResult.rows[0]
      };

      return res.status(200).json({
        success: true,
        statistics: stats
      });
    } catch (error) {
      console.error('Get user statistics error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get user statistics',
        error: error.message
      });
    }
  }
};

module.exports = userController;
