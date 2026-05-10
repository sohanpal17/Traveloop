const NoteModel = require('../models/noteModel');
const TripModel = require('../models/tripModel');
const StopModel = require('../models/stopModel');

const noteController = {
  // Create note
  create: async (req, res) => {
    try {
      const userId = req.user.id;
      const noteData = req.body;

      // Verify trip ownership
      const trip = await TripModel.findById(noteData.trip_id, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      // If stop_id is provided, verify it belongs to the trip
      if (noteData.stop_id) {
        const stop = await StopModel.findById(noteData.stop_id);
        if (!stop || stop.trip_id !== noteData.trip_id) {
          return res.status(400).json({
            success: false,
            message: 'Invalid stop for this trip'
          });
        }
      }

      const note = await NoteModel.create(noteData);

      return res.status(201).json({
        success: true,
        message: 'Note created successfully',
        note
      });
    } catch (error) {
      console.error('Create note error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create note',
        error: error.message
      });
    }
  },

  // Get notes by trip
  getNotesByTrip: async (req, res) => {
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

      const notes = await NoteModel.findByTripId(tripId);

      return res.status(200).json({
        success: true,
        count: notes.length,
        notes
      });
    } catch (error) {
      console.error('Get notes error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get notes',
        error: error.message
      });
    }
  },

  // Get notes by stop
  getNotesByStop: async (req, res) => {
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

      const notes = await NoteModel.findByStopId(stopId);

      return res.status(200).json({
        success: true,
        count: notes.length,
        notes
      });
    } catch (error) {
      console.error('Get notes by stop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get notes',
        error: error.message
      });
    }
  },

  // Get note by ID
  getNoteById: async (req, res) => {
    try {
      const { id } = req.params;

      const note = await NoteModel.findById(id);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      return res.status(200).json({
        success: true,
        note
      });
    } catch (error) {
      console.error('Get note error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get note',
        error: error.message
      });
    }
  },

  // Update note
  updateNote: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const note = await NoteModel.update(id, updateData);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        note
      });
    } catch (error) {
      console.error('Update note error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update note',
        error: error.message
      });
    }
  },

  // Delete note
  deleteNote: async (req, res) => {
    try {
      const { id } = req.params;

      const note = await NoteModel.delete(id);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error) {
      console.error('Delete note error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete note',
        error: error.message
      });
    }
  },

  // Search notes
  searchNotes: async (req, res) => {
    try {
      const { tripId } = req.params;
      const { q } = req.query;
      const userId = req.user.id;

      // Verify trip ownership
      const trip = await TripModel.findById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found or unauthorized'
        });
      }

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const notes = await NoteModel.search(tripId, q);

      return res.status(200).json({
        success: true,
        count: notes.length,
        notes
      });
    } catch (error) {
      console.error('Search notes error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search notes',
        error: error.message
      });
    }
  }
};

module.exports = noteController;