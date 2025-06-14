import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Register dengan email/password
  async register(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  },

  // Login dengan email/password
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // Login dengan Google
  async loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  },

  // Logout
  async logout() {
    return signOut(auth);
  },

  // Get user saat ini
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};