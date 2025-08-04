import { initializeApp } from 'firebase/app';

// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBKh2BsT7SJgtjuSHoeoD5JRtbZZzGEomM",
  authDomain: "ai-fitness-coach-aaf5f.firebaseapp.com",
  projectId: "ai-fitness-coach-aaf5f",
  storageBucket: "ai-fitness-coach-aaf5f.firebasestorage.app",
  messagingSenderId: "705058833224",
  appId: "1:705058833224:web:81aff69e31801a313fa97d",
  measurementId: "G-HCTJD5HKR0"
};

// Debug: Log the configuration (remove in production)
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'NOT SET',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
/**
 * @type {Auth}
 */
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app; 