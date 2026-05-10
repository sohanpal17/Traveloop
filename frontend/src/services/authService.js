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
  register: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const firebaseToken = await user.getIdToken();

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

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const firebaseToken = await user.getIdToken();

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

  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const firebaseToken = await user.getIdToken();

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

  logout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  },

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