import axios from 'axios';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  // Register with email and password
  register: async (email, password, displayName) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get Firebase ID token
      const firebaseToken = await user.getIdToken();

      // Register user in backend
      const response = await axios.post(`${API_URL}/auth/register`, {
        firebaseToken,
        email: user.email,
        displayName: displayName || 'Traveler',
        photoUrl: user.photoURL
      });

      return {
        firebaseUser: user,
        userData: response.data.user
      };
    } catch (error) {
      throw error;
    }
  },

  // Login with email and password
  login: async (email, password) => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get Firebase ID token
      const firebaseToken = await user.getIdToken();

      // Login user in backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        firebaseToken,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL
      });

      return {
        firebaseUser: user,
        userData: response.data.user
      };
    } catch (error) {
      throw error;
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Get Firebase ID token
      const firebaseToken = await user.getIdToken();

      // Login user in backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        firebaseToken,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL
      });

      return {
        firebaseUser: user,
        userData: response.data.user
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  },

  // Get current user from backend
  getCurrentUser: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const token = await user.getIdToken();
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;