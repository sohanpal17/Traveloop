const ActivityModel = require('../models/activityModel');
const StopModel = require('../models/stopModel');

const activityController = {
  // Create new activity
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const activityData = req.body;

      // Verify stop ownership
      const stop = await StopModel.verifyOwnership(activityData.stop_id, userId);
      if (!stop) {
        return res.status(404).json({
          success: false,
          message: 'Stop not found or unauthorized'
        });
      }

      const activity = await ActivityModel.create(activityData);

      return res.status(201).json({
        success: true,
        message: 'Activity created successfully',
        activity
      });
    } catch (error) {
      console.error('Create activity error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create activity',
        error: error.message
      });
    }
  },

  // Get activities by stop
  getActivitiesByStop: async (req, res) => {
    try {
      const { stopId } = req.params;
      const userId = req.user.id;

      // Verify stop ownership
      const stop = await StopModel.verifyOwnership(stopId, userId);
      if (!stop) {
        return res.status(404).json({
          success: false,
          message: 'Stop not found or unauthorized'
        });
      }

      const activities = await ActivityModel.findByStopId(stopId);

      return res.status(200).json({
        success: true,
        count: activities.length,
        activities
      });
    } catch (error) {
      console.error('Get activities error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get activities',
        error: error.message
      });
    }
  },

  // Get all activities for a trip
  getActivitiesByTrip: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Verify trip ownership
      const TripModel = require('../models/tripModel');
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const activities = await ActivityModel.findByTripId(tripId);

      return res.status(200).json({
        success: true,
        count: activities.length,
        activities
      });
    } catch (error) {
      console.error('Get trip activities error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get activities',
        error: error.message
      });
    }
  },

  // Get activity by ID
  getActivityById: async (req, res) => {
    try {
      const { id } = req.params;
      const activity = await ActivityModel.findById(id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      return res.status(200).json({
        success: true,
        activity
      });
    } catch (error) {
      console.error('Get activity error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get activity',
        error: error.message
      });
    }
  },

  // Update activity
  updateActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const activity = await ActivityModel.update(id, updateData);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Activity updated successfully',
        activity
      });
    } catch (error) {
      console.error('Update activity error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update activity',
        error: error.message
      });
    }
  },

  // Delete activity
  deleteActivity: async (req, res) => {
    try {
      const { id } = req.params;

      const activity = await ActivityModel.delete(id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Activity deleted successfully'
      });
    } catch (error) {
      console.error('Delete activity error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete activity',
        error: error.message
      });
    }
  },

  // Mark activity as completed
  markCompleted: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_completed } = req.body;

      const activity = await ActivityModel.markCompleted(id, is_completed);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Activity status updated',
        activity
      });
    } catch (error) {
      console.error('Mark completed error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update activity status',
        error: error.message
      });
    }
  },

  // Search activities by category
  searchByCategory: async (req, res) => {
    try {
      const { stopId } = req.params;
      const { category } = req.query;
      const userId = req.user.id;

      // Verify stop ownership
      const stop = await StopModel.verifyOwnership(stopId, userId);
      if (!stop) {
        return res.status(404).json({
          success: false,
          message: 'Stop not found or unauthorized'
        });
      }

      const activities = await ActivityModel.searchByCategory(stopId, category);

      return res.status(200).json({
        success: true,
        count: activities.length,
        activities
      });
    } catch (error) {
      console.error('Search activities error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search activities',
        error: error.message
      });
    }
  },

  // Get activities summary
  getActivitySummary: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Verify trip ownership
      const TripModel = require('../models/tripModel');
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const summary = await ActivityModel.getSummary(tripId);

      return res.status(200).json({
        success: true,
        summary
      });
    } catch (error) {
      console.error('Get activity summary error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get activity summary',
        error: error.message
      });
    }
  }
};

module.exports = activityController;