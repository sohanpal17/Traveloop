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

      // MOCK BACKEND RESPONSE
      return {
        firebaseUser: user,
        userData: { id: 1, email: user.email, displayName: displayName || 'Traveler', photoUrl: user.photoURL }
      };
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // MOCK BACKEND RESPONSE
      return {
        firebaseUser: user,
        userData: { id: 1, email: user.email, displayName: user.displayName || 'Traveler', photoUrl: user.photoURL }
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

      // MOCK BACKEND RESPONSE
      return {
        firebaseUser: user,
        userData: { id: 1, email: user.email, displayName: user.displayName || 'Traveler', photoUrl: user.photoURL }
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

      // MOCK BACKEND RESPONSE
      return { id: 1, email: user.email, displayName: user.displayName || 'Traveler', photoUrl: user.photoURL };
    } catch (error) {
      throw error;
    }
  }
};

export default authService;