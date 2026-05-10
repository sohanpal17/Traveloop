import axios from 'axios';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

const API_URL = process.env.REACT_APP_API_URL;

// Helper: try to sync with backend, but don't fail if backend is down
const syncWithBackend = async (endpoint, payload) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, payload);
    return response.data.user;
  } catch (error) {
    console.warn('Backend sync skipped (server may be offline):', error.message);
    return null;
  }
};

const authService = {
  register: async (email, password, profileData = {}) => {
    // Step 1: Create user in Firebase (this is the source of truth)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const {
      firstName,
      lastName,
      displayName,
      phoneNumber,
      city,
      country,
      additionalInfo,
      photoUrl
    } = profileData;

    const resolvedDisplayName = displayName || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Traveler';

    // Update display name in Firebase profile
    await updateProfile(user, { displayName: resolvedDisplayName });

    // Step 2: Try to sync with backend (non-blocking)
    const firebaseToken = await user.getIdToken();
    const backendUser = await syncWithBackend('/auth/register', {
      firebaseToken,
      email: user.email,
      firstName: firstName || '',
      lastName: lastName || '',
      displayName: resolvedDisplayName,
      phoneNumber: phoneNumber || '',
      city: city || '',
      country: country || '',
      additionalInfo: additionalInfo || '',
      photoUrl: photoUrl || user.photoURL || null
    });

    return {
      firebaseUser: user,
      userData: backendUser || {
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        displayName: resolvedDisplayName,
        phoneNumber: phoneNumber || '',
        city: city || '',
        country: country || '',
        additionalInfo: additionalInfo || '',
        photoUrl: user.photoURL
      }
    };
  },

  login: async (email, password) => {
    // Step 1: Sign in with Firebase (this is the source of truth)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Try to sync with backend (non-blocking)
    const firebaseToken = await user.getIdToken();
    const backendUser = await syncWithBackend('/auth/login', {
      firebaseToken,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL
    });

    return {
      firebaseUser: user,
      userData: backendUser || {
        email: user.email,
        displayName: user.displayName || 'Traveler',
        photoUrl: user.photoURL
      }
    };
  },

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Try to sync with backend (non-blocking)
    const firebaseToken = await user.getIdToken();
    const backendUser = await syncWithBackend('/auth/login', {
      firebaseToken,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL
    });

    return {
      firebaseUser: user,
      userData: backendUser || {
        email: user.email,
        displayName: user.displayName || 'Traveler',
        photoUrl: user.photoURL
      }
    };
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('user');
  },

  updateProfile: async (profileData = {}) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user found');
    }

    const token = await user.getIdToken();
    const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.user;
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser: async () => {
    const user = auth.currentUser;
    if (!user) return null;

    // Try backend first
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.user;
    } catch (error) {
      // Backend unavailable — fall back to Firebase user data
      console.warn('Backend unavailable, using Firebase user data');
      return {
        email: user.email,
        displayName: user.displayName || 'Traveler',
        photoUrl: user.photoURL
      };
    }
  }
};

export default authService;