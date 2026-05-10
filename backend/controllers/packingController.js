const PackingModel = require('../models/packingModel');
const TripModel = require('../models/tripModel');

const packingController = {
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const packingData = req.body;

      const trip = await TripModel.findById(packingData.trip_id, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const packingItem = await PackingModel.create(packingData);

      return res.status(201).json({
        success: true,
        message: 'Packing item created successfully',
        packingItem
      });
    } catch (error) {
      console.error('Create packing item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create packing item',
        error: error.message
      });
    }
  },

  getPackingByTrip: async (req, res) => {
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

      const packingItems = await PackingModel.findByTripId(tripId);

      return res.status(200).json({
        success: true,
        count: packingItems.length,
        packingItems
      });
    } catch (error) {
      console.error('Get packing items error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get packing items',
        error: error.message
      });
    }
  },

  getPackingByCategory: async (req, res) => {
    try {
      const { tripId, category } = req.params;
      const userId = req.user.id;

      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const packingItems = await PackingModel.findByCategory(tripId, category);

      return res.status(200).json({
        success: true,
        count: packingItems.length,
        packingItems
      });
    } catch (error) {
      console.error('Get packing items by category error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get packing items by category',
        error: error.message
      });
    }
  },

  getPackingSummary: async (req, res) => {
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

      const summary = await PackingModel.getSummary(tripId);

      return res.status(200).json({
        success: true,
        summary
      });
    } catch (error) {
      console.error('Get packing summary error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get packing summary',
        error: error.message
      });
    }
  },

  updatePacking: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const trip = await TripModel.findById(req.body.trip_id, userId);
      if (req.body.trip_id && !trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const packingItem = await PackingModel.update(id, req.body);

      if (!packingItem) {
        return res.status(404).json({
          success: false,
          message: 'Packing item not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Packing item updated successfully',
        packingItem
      });
    } catch (error) {
      console.error('Update packing item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update packing item',
        error: error.message
      });
    }
  },

  togglePacked: async (req, res) => {
    try {
      const { id } = req.params;

      const packingItem = await PackingModel.togglePacked(id);

      if (!packingItem) {
        return res.status(404).json({
          success: false,
          message: 'Packing item not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Packing item toggled successfully',
        packingItem
      });
    } catch (error) {
      console.error('Toggle packing item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle packing item',
        error: error.message
      });
    }
  },

  deletePacking: async (req, res) => {
    try {
      const { id } = req.params;

      const packingItem = await PackingModel.delete(id);

      if (!packingItem) {
        return res.status(404).json({
          success: false,
          message: 'Packing item not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Packing item deleted successfully'
      });
    } catch (error) {
      console.error('Delete packing item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete packing item',
        error: error.message
      });
    }
  },

  resetAll: async (req, res) => {
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

      const items = await PackingModel.resetAll(tripId);

      return res.status(200).json({
        success: true,
        message: 'Packing list reset successfully',
        count: items.length
      });
    } catch (error) {
      console.error('Reset packing items error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reset packing list',
        error: error.message
      });
    }
  }
};

module.exports = packingController;
