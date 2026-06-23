import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB1K2PWWWkHnFh7uhlNnjxIhYsD44eiETA",
  authDomain: "quizlet-55b7b.firebaseapp.com",
  projectId: "quizlet-55b7b",
  storageBucket: "quizlet-55b7b.firebasestorage.app",
  messagingSenderId: "410716271757",
  appId: "1:410716271757:web:2eda5ee4cd2aede0791ec4",
  measurementId: "G-7YNY7B1JT7"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

import { getAuth } from 'firebase/auth';

let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  authInstance = getAuth(app);
}
export const auth = authInstance;

export const db = getFirestore(app);
export const storage = getStorage(app);
