import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPFinFVaFcZXHclINsYhQ_NhSrlg_i240",
  authDomain: "resumebuildergsy.firebaseapp.com",
  projectId: "resumebuildergsy",
  storageBucket: "resumebuildergsy.firebasestorage.app",
  messagingSenderId: "864406028109",
  appId: "1:864406028109:web:ecca6fc573480587b04104",
  measurementId: "G-FHX0Y2KH6C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    user: result.user,
    idToken
  };
};
