import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBBC1EwG6h2wlHYilzUvgjbqvxLyHB5y_o",
    authDomain: "todolist-app-7e3ee.firebaseapp.com",
    projectId: "todolist-app-7e3ee",
    storageBucket: "todolist-app-7e3ee.firebasestorage.app",
    messagingSenderId: "253391310014",
    appId: "1:253391310014:web:00c3b3ba78368169ce22ef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
