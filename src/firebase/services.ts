import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config"; 
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

export const firestoreService = {
  async getGame(gameId: string) {
    const docSnap = await getDoc(doc(db, "games", gameId));
    if (!docSnap.exists()) throw new Error("Game not found");
    return { id: docSnap.id, ...docSnap.data() };
  },

  async getPlayers(gameId: string) {
    const snap = await getDocs(collection(db, "games", gameId, "players"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async recordVote(gameId: string, voterId: string, votedPlayerId: string) {
    await addDoc(collection(db, "games", gameId, "votes"), {
      voterId,
      votedPlayerId,
      timestamp: serverTimestamp()
    });
  }
};