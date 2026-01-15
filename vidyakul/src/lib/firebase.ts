import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCWD2lLgKb-hzxbmLTQiZWd8WvF16CC3qQ",
  authDomain: "vidyakul-5a820.firebaseapp.com",
  databaseURL: "https://vidyakul-5a820-default-rtdb.firebaseio.com",
  projectId: "vidyakul-5a820",
  storageBucket: "vidyakul-5a820.firebasestorage.app",
  messagingSenderId: "658214544674",
  appId: "1:658214544674:web:06eb0c86f45e843138b17b",
  measurementId: "G-4RQH60KSGB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize analytics only in browser
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export const ADMIN_EMAIL = "techshivam0616@gmail.com";
