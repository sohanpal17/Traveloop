const TripModel = require('../models/tripModel');
const StopModel = require('../models/stopModel');
const ActivityModel = require('../models/activityModel');
const { uploadToCloudinary } = require('../utils/imageUpload');

const tripController = {
  // Create new trip
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const tripData = req.body;

      // Handle cover photo upload if provided
      if (req.file) {
        const coverPhotoUrl = await uploadToCloudinary(req.file.buffer, 'traveloop/trips');
        tripData.cover_photo_url = coverPhotoUrl;
      }

      const trip = await TripModel.create(userId, tripData);

      return res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        trip
      });
    } catch (error) {
      console.error('Create trip error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create trip',
        error: error.message
      });
    }
  },

  // Get all trips for user
  getAllTrips: async (req, res) => {
    try {
      const userId = req.user.id;
      const filters = {
        is_public: req.query.is_public
      };

      const trips = await TripModel.findByUserId(userId, filters);

      return res.status(200).json({
        success: true,
        count: trips.length,
        trips
      });
    } catch (error) {
      console.error('Get trips error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get trips',
        error: error.message
      });
    }
  },

  // Get trip by ID with full details
  getTripById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const trip = await TripModel.findById(id, userId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      // Get stops with activities
      const stops = await StopModel.findByTripId(id);
      
      // Get activities for each stop
      const stopsWithActivities = await Promise.all(
        stops.map(async (stop) => {
          const activities = await ActivityModel.findByStopId(stop.id);
          return {
            ...stop,
            activities
          };
        })
      );

      // Get trip statistics
      const statistics = await TripModel.getStatistics(id);

      return res.status(200).json({
        success: true,
        trip: {
          ...trip,
          stops: stopsWithActivities,
          statistics
        }
      });
    } catch (error) {
      console.error('Get trip error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get trip',
        error: error.message
      });
    }
  },

  // Update trip
  updateTrip: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Handle cover photo upload if provided
      if (req.file) {
        const coverPhotoUrl = await uploadToCloudinary(req.file.buffer, 'traveloop/trips');
        updateData.cover_photo_url = coverPhotoUrl;
      }

      const trip = await TripModel.update(id, userId, updateData);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        trip
      });
    } catch (error) {
      console.error('Update trip error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update trip',
        error: error.message
      });
    }
  },

  // Delete trip
  deleteTrip: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const trip = await TripModel.delete(id, userId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      console.error('Delete trip error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete trip',
        error: error.message
      });
    }
  },

  // Make trip public and generate share link
  makePublic: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // First update trip to public
      const trip = await TripModel.update(id, userId, { is_public: true });

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      // Generate public slug if not exists
      let publicTrip = trip;
      if (!trip.public_url_slug) {
        publicTrip = await TripModel.generatePublicSlug(id);
      }

      const shareUrl = `${process.env.APP_URL}/shared/${publicTrip.public_url_slug}`;

      return res.status(200).json({
        success: true,
        message: 'Trip is now public',
        shareUrl,
        trip: publicTrip
      });
    } catch (error) {
      console.error('Make public error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to make trip public',
        error: error.message
      });
    }
  },

  // Make trip private
  makePrivate: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const trip = await TripModel.update(id, userId, { is_public: false });

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Trip is now private',
        trip
      });
    } catch (error) {
      console.error('Make private error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to make trip private',
        error: error.message
      });
    }
  },

  // Get public trip by slug
  getPublicTrip: async (req, res) => {
    try {
      const { slug } = req.params;

      const trip = await TripModel.findByPublicSlug(slug);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Public trip not found'
        });
      }

      // Get stops with activities
      const stops = await StopModel.findByTripId(trip.id);
      const stopsWithActivities = await Promise.all(
        stops.map(async (stop) => {
          const activities = await ActivityModel.findByStopId(stop.id);
          return {
            ...stop,
            activities
          };
        })
      );

      const statistics = await TripModel.getStatistics(trip.id);

      return res.status(200).json({
        success: true,
        trip: {
          ...trip,
          stops: stopsWithActivities,
          statistics
        }
      });
    } catch (error) {
      console.error('Get public trip error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get public trip',
        error: error.message
      });
    }
  },

  // Copy/duplicate a public trip
  copyTrip: async (req, res) => {
    try {
      const { slug } = req.params;
      const userId = req.user.id;

      // Get the public trip
      const originalTrip = await TripModel.findByPublicSlug(slug);

      if (!originalTrip) {
        return res.status(404).json({
          success: false,
          message: 'Public trip not found'
        });
      }

      // Create new trip for current user
      const newTripData = {
        title: `${originalTrip.title} (Copy)`,
        description: originalTrip.description,
        start_date: originalTrip.start_date,
        end_date: originalTrip.end_date,
        cover_photo_url: originalTrip.cover_photo_url,
        total_budget: originalTrip.total_budget,
        is_public: false
      };

      const newTrip = await TripModel.create(userId, newTripData);

      // Copy stops and activities
      const originalStops = await StopModel.findByTripId(originalTrip.id);

      for (const stop of originalStops) {
        const newStopData = {
          trip_id: newTrip.id,
          city: stop.city,
          country: stop.country,
          start_date: stop.start_date,
          end_date: stop.end_date,
          duration_days: stop.duration_days,
          notes: stop.notes,
          order_index: stop.order_index,
          latitude: stop.latitude,
          longitude: stop.longitude
        };

        const newStop = await StopModel.create(newStopData);

        // Copy activities
        const activities = await ActivityModel.findByStopId(stop.id);
        for (const activity of activities) {
          const newActivityData = {
            stop_id: newStop.id,
            title: activity.title,
            description: activity.description,
            category: activity.category,
            estimated_cost: activity.estimated_cost,
            date: activity.date,
            time: activity.time,
            duration_minutes: activity.duration_minutes,
            location: activity.location,
            booking_url: activity.booking_url
          };

          await ActivityModel.create(newActivityData);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Trip copied successfully',
        trip: newTrip
      });
    } catch (error) {
      console.error('Copy trip error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to copy trip',
        error: error.message
      });
    }
  },

  // Get recent trips
  getRecentTrips: async (req, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 5;

      const trips = await TripModel.getRecent(userId, limit);

      return res.status(200).json({
        success: true,
        count: trips.length,
        trips
      });
    } catch (error) {
      console.error('Get recent trips error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get recent trips',
        error: error.message
      });
    }
  },

  // Get trip statistics
  getTripStatistics: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verify ownership
      const trip = await TripModel.findById(id, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      const statistics = await TripModel.getStatistics(id);

      return res.status(200).json({
        success: true,
        statistics
      });
    } catch (error) {
      console.error('Get trip statistics error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get trip statistics',
        error: error.message
      });
    }
  }
};

module.exports = tripController;