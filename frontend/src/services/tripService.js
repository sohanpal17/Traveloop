import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = process.env.REACT_APP_API_URL;

const tripService = {
  createTrip: async (tripData) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();

    // Backend expects form-data when uploading files; here we send JSON since
    // we currently only support cover photo URL as string. If uploading files
    // is needed later, switch to FormData.
    const payload = {
      title: tripData.title,
      description: tripData.description,
      start_date: tripData.startDate || null,
      end_date: tripData.endDate || null,
      total_budget: tripData.budget || 0,
      is_public: tripData.isPublic === 'true',
      cover_photo_url: tripData.coverPhoto || null
    };

    const response = await axios.post(`${API_URL}/trips`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.trip;
  }
};

export default tripService;
