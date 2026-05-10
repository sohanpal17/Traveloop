const TripModel = require('../models/tripModel');
const StopModel = require('../models/stopModel');

const stopController = {
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const { tripId, city, country, start_date, end_date, duration_days, notes, order_index, latitude, longitude } = req.body;

      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const stop = await StopModel.create({
        trip_id: tripId,
        city,
        country,
        start_date,
        end_date,
        duration_days,
        notes,
        order_index,
        latitude,
        longitude
      });

      return res.status(201).json({
        success: true,
        message: 'Stop created successfully',
        stop
      });
    } catch (error) {
      console.error('Create stop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create stop',
        error: error.message
      });
    }
  },

  getStopsByTrip: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const stops = await StopModel.findByTripId(tripId);

      return res.status(200).json({
        success: true,
        count: stops.length,
        stops
      });
    } catch (error) {
      console.error('Get stops error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get stops',
        error: error.message
      });
    }
  },

  getStopById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const stop = await StopModel.findById(id);
      if (!stop) {
        return res.status(404).json({
          success: false,
          message: 'Stop not found'
        });
      }

      const ownership = await StopModel.verifyOwnership(id, userId);
      if (!ownership) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        stop
      });
    } catch (error) {
      console.error('Get stop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get stop',
        error: error.message
      });
    }
  },

  updateStop: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const ownership = await StopModel.verifyOwnership(id, userId);
      if (!ownership) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const stop = await StopModel.update(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Stop updated successfully',
        stop
      });
    } catch (error) {
      console.error('Update stop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update stop',
        error: error.message
      });
    }
  },

  deleteStop: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const ownership = await StopModel.verifyOwnership(id, userId);
      if (!ownership) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const stop = await StopModel.delete(id);

      if (!stop) {
        return res.status(404).json({
          success: false,
          message: 'Stop not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Stop deleted successfully'
      });
    } catch (error) {
      console.error('Delete stop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete stop',
        error: error.message
      });
    }
  },

  reorderStops: async (req, res) => {
    try {
      const { tripId } = req.params;
      const { stopIds } = req.body;
      const userId = req.user.id;

      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      await StopModel.reorder(stopIds);

      return res.status(200).json({
        success: true,
        message: 'Stops reordered successfully'
      });
    } catch (error) {
      console.error('Reorder stops error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reorder stops',
        error: error.message
      });
    }
  }
};

module.exports = stopController;
