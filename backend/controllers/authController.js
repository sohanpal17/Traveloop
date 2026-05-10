const admin = require('../config/firebase');
const UserModel = require('../models/userModel');

const authController = {
  // Register/Login user
  registerOrLogin: async (req, res) => {
    try {
      const {
        firebaseToken,
        email,
        displayName,
        firstName,
        lastName,
        phoneNumber,
        city,
        country,
        additionalInfo,
        photoUrl
      } = req.body;

      if (!firebaseToken) {
        return res.status(400).json({
          success: false,
          message: 'Firebase token is required'
        });
      }

      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      const firebaseUid = decodedToken.uid;

      // Create or update user in PostgreSQL
      const user = await UserModel.createOrUpdateUser(
        firebaseUid,
        email || decodedToken.email,
        {
          firstName,
          lastName,
          displayName: displayName || decodedToken.name || [firstName, lastName].filter(Boolean).join(' ').trim(),
          phoneNumber,
          city,
          country,
          additionalInfo,
          photoUrl: photoUrl || decodedToken.picture || null
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: {
          id: user.id,
          firebaseUid: user.firebase_uid,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          displayName: user.display_name,
          phoneNumber: user.phone_number,
          city: user.city,
          country: user.country,
          additionalInfo: user.additional_info,
          photoUrl: user.photo_url,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed',
        error: error.message
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const user = req.user;

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          firebaseUid: user.firebase_uid,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          displayName: user.display_name,
          phoneNumber: user.phone_number,
          city: user.city,
          country: user.country,
          additionalInfo: user.additional_info,
          photoUrl: user.photo_url,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get user',
        error: error.message
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const {
        displayName,
        firstName,
        lastName,
        phoneNumber,
        city,
        country,
        additionalInfo,
        photoUrl
      } = req.body;
      const firebaseUid = req.user.firebase_uid;

      const updatedUser = await UserModel.updateProfile(
        firebaseUid,
        {
          firstName,
          lastName,
          displayName,
          phoneNumber,
          city,
          country,
          additionalInfo,
          photoUrl
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          firebaseUid: updatedUser.firebase_uid,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          displayName: updatedUser.display_name,
          phoneNumber: updatedUser.phone_number,
          city: updatedUser.city,
          country: updatedUser.country,
          additionalInfo: updatedUser.additional_info,
          photoUrl: updatedUser.photo_url
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
  }
};

module.exports = authController;