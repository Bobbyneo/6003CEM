// firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';  // Firestore imports
import axios from 'axios';  // Axios for API requests

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiF1mBiDFdrBT8rBdKaUd16sVaQUdiJi8", // Replace with your Firebase API key
  authDomain: "currencyexchangeapp-b4473.firebaseapp.com",
  projectId: "currencyexchangeapp-b4473",
  storageBucket: "currencyexchangeapp-b4473.firebasestorage.app",
  messagingSenderId: "610840992133",
  appId: "1:610840992133:web:69ff2b551c8ae929c30cec",
  measurementId: "G-1RD694YXMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Get Firestore instance

// Function to fetch exchange rates from the API
const getExchangeRateFromAPI = async (fromCurrency, toCurrency) => {
  try {
    const apiUrl = `https://v6.exchangerate-api.com/v6/0292cffab5264d71b26effa9/latest/${fromCurrency}`;  // Replace with your actual API key
    const response = await axios.get(apiUrl);
    return response.data.conversion_rates[toCurrency];
  } catch (error) {
    console.error('Error fetching exchange rates from API:', error);
    return null;
  }
};

// Save conversion data to Firestore
export const saveConversionData = async (fromCurrency, toCurrency, amount, rate, result) => {
  try {
    const docRef = await addDoc(collection(db, "conversions"), {  // Save data to the "conversions" collection
      fromCurrency,
      toCurrency,
      amount,
      rate,
      result,
      timestamp: new Date().toISOString(),
    });
    console.log("Document written with ID: ", docRef.id);  // Log the document ID
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Retrieve conversion data from Firestore (optional function)
export const getConversionData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "conversions"));  // Get all documents from "conversions"
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());  // Log the document ID and data
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};
