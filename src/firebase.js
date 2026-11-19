// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCY5EdT9SUR97waNsxOtQjxRI1zaSCbrPY",
  authDomain: "sin-alitas-app.firebaseapp.com",
  projectId: "sin-alitas-app",
  storageBucket: "sin-alitas-app.appspot.com",
  messagingSenderId: "138252749885",
  appId: "1:138252749885:web:cc2edf56a2e4f54234ee54",
  measurementId: "G-1FT532NS7L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);