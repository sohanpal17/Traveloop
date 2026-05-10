const BudgetModel = require('../models/budgetModel');
const TripModel = require('../models/tripModel');

const budgetController = {
  // Create budget item
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const budgetData = req.body;

      // Verify trip ownership
      const trip = await TripModel.findById(budgetData.trip_id, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const budgetItem = await BudgetModel.create(budgetData);

      return res.status(201).json({
        success: true,
        message: 'Budget item created successfully',
        budgetItem
      });
    } catch (error) {
      console.error('Create budget item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create budget item',
        error: error.message
      });
    }
  },

  // Get budget items by trip
  getBudgetByTrip: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Verify trip ownership
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const budgetItems = await BudgetModel.findByTripId(tripId);

      return res.status(200).json({
        success: true,
        count: budgetItems.length,
        budgetItems
      });
    } catch (error) {
      console.error('Get budget items error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get budget items',
        error: error.message
      });
    }
  },

  // Get budget category breakdown
  getCategoryBreakdown: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Verify trip ownership
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const breakdown = await BudgetModel.getCategoryBreakdown(tripId);

      return res.status(200).json({
        success: true,
        breakdown
      });
    } catch (error) {
      console.error('Get category breakdown error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get category breakdown',
        error: error.message
      });
    }
  },

  // Get budget summary
  getBudgetSummary: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Verify trip ownership
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const summary = await BudgetModel.getSummary(tripId);

      return res.status(200).json({
        success: true,
        summary
      });
    } catch (error) {
      console.error('Get budget summary error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get budget summary',
        error: error.message
      });
    }
  },

  // Get daily budget breakdown
  getDailyBreakdown: async (req, res) => {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Verify trip ownership
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const dailyBreakdown = await BudgetModel.getDailyBreakdown(tripId);

      return res.status(200).json({
        success: true,
        dailyBreakdown
      });
    } catch (error) {
      console.error('Get daily breakdown error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get daily breakdown',
        error: error.message
      });
    }
  },

  // Update budget item
  updateBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const budgetItem = await BudgetModel.update(id, updateData);

      if (!budgetItem) {
        return res.status(404).json({
          success: false,
          message: 'Budget item not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Budget item updated successfully',
        budgetItem
      });
    } catch (error) {
      console.error('Update budget item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update budget item',
        error: error.message
      });
    }
  },

  // Delete budget item
  deleteBudget: async (req, res) => {
    try {
      const { id } = req.params;

      const budgetItem = await BudgetModel.delete(id);

      if (!budgetItem) {
        return res.status(404).json({
          success: false,
          message: 'Budget item not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Budget item deleted successfully'
      });
    } catch (error) {
      console.error('Delete budget item error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete budget item',
        error: error.message
      });
    }
  }
};

module.exports = budgetController;