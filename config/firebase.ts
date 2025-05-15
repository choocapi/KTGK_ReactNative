// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS9uR6SZ0L380GQ5LpmpQ1mMPYJdK_iic",
  authDomain: "ktgk-rn.firebaseapp.com",
  projectId: "ktgk-rn",
  storageBucket: "ktgk-rn.firebasestorage.app",
  messagingSenderId: "341557361271",
  appId: "1:341557361271:web:6712ae148f8d3b51fba472",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// DB
const firestore = getFirestore(app);

// Storage
const storage = getStorage(app);

export { auth, firestore, storage };
