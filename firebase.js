
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Replace these values with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyChX8x1m9RzOi2fo6Px6EmBI4G0MKMIlCU",
    authDomain: "aquacare-professional.firebaseapp.com",
    projectId: "aquacare-professional",
    storageBucket: "aquacare-professional.firebasestorage.app",
    messagingSenderId: "69136784150",
    appId: "1:69136784150:web:ebc52b5cb992f3d2cc0e37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Export Firebase services
export { app, db, auth };
