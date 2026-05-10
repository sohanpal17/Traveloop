const CityModel = require('../models/cityModel');

const cityController = {
  // Search cities
  searchCities: async (req, res) => {
    try {
      const { q, country, region, min_cost, max_cost } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filters = {
        country,
        region,
        min_cost_index: min_cost,
        max_cost_index: max_cost
      };

      const cities = await CityModel.search(q, filters);

      return res.status(200).json({
        success: true,
        count: cities.length,
        cities
      });
    } catch (error) {
      console.error('Search cities error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search cities',
        error: error.message
      });
    }
  },

  // Get all cities
  getAllCities: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const cities = await CityModel.getAll(limit);

      return res.status(200).json({
        success: true,
        count: cities.length,
        cities
      });
    } catch (error) {
      console.error('Get all cities error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get cities',
        error: error.message
      });
    }
  },

  // Get city by ID
  getCityById: async (req, res) => {
    try {
      const { id } = req.params;

      const city = await CityModel.findById(id);

      if (!city) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      return res.status(200).json({
        success: true,
        city
      });
    } catch (error) {
      console.error('Get city error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get city',
        error: error.message
      });
    }
  },

  // Get popular cities
  getPopularCities: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const cities = await CityModel.getPopular(limit);

      return res.status(200).json({
        success: true,
        count: cities.length,
        cities
      });
    } catch (error) {
      console.error('Get popular cities error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get popular cities',
        error: error.message
      });
    }
  },

  // Get cities by country
  getCitiesByCountry: async (req, res) => {
    try {
      const { country } = req.params;

      const cities = await CityModel.getByCountry(country);

      return res.status(200).json({
        success: true,
        count: cities.length,
        cities
      });
    } catch (error) {
      console.error('Get cities by country error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get cities',
        error: error.message
      });
    }
  },

  // Get cities by region
  getCitiesByRegion: async (req, res) => {
    try {
      const { region } = req.params;

      const cities = await CityModel.getByRegion(region);

      return res.status(200).json({
        success: true,
        count: cities.length,
        cities
      });
    } catch (error) {
      console.error('Get cities by region error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get cities',
        error: error.message
      });
    }
  },

  // Save destination
  saveDestination: async (req, res) => {
    try {
      const userId = req.user.id;
      const { cityId, notes } = req.body;

      if (!cityId) {
        return res.status(400).json({
          success: false,
          message: 'City ID is required'
        });
      }

      const savedDestination = await CityModel.saveDestination(userId, cityId, notes);

      return res.status(201).json({
        success: true,
        message: 'Destination saved successfully',
        savedDestination
      });
    } catch (error) {
      console.error('Save destination error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save destination',
        error: error.message
      });
    }
  },

  // Get saved destinations
  getSavedDestinations: async (req, res) => {
    try {
      const userId = req.user.id;

      const destinations = await CityModel.getSavedDestinations(userId);

      return res.status(200).json({
        success: true,
        count: destinations.length,
        destinations
      });
    } catch (error) {
      console.error('Get saved destinations error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get saved destinations',
        error: error.message
      });
    }
  },

  // Remove saved destination
  removeSavedDestination: async (req, res) => {
    try {
      const userId = req.user.id;
      const { cityId } = req.params;

      const removed = await CityModel.removeSavedDestination(userId, cityId);

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Saved destination not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Saved destination removed successfully'
      });
    } catch (error) {
      console.error('Remove saved destination error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove saved destination',
        error: error.message
      });
    }
  }
};

module.exports = cityController;