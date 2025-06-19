// index.js

const express = require('express');
const axios = require('axios');
const firebaseAdmin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./currencyexchangeapp-b4473-firebase-adminsdk-fbsvc-ae40e78561.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://currencyexchangeapp-b4473-default-rtdb.firebaseio.com",
});

// Firebase Database reference
const db = firebaseAdmin.database();

// Set up the Express app
const app = express();
app.use(express.json());

// Root route to check server status (for testing)
app.get('/', (req, res) => {
  res.send('Server is running');  // Simple response when visiting localhost:5000
});

// Endpoint to convert currency and save to Firebase
app.post('/convert', async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;

  // Fetch exchange rate from ExchangeRate-API
  const apiKey = process.env.EXCHANGE_API_KEY;
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

  try {
    const response = await axios.get(apiUrl);
    const rate = response.data.conversion_rates[toCurrency];
    const result = (amount * rate).toFixed(2);  // Calculate the conversion result

    // Save the conversion data to Firebase
    const conversionRef = db.ref('conversions/' + Date.now());  // Unique ID using timestamp
    await conversionRef.set({
      fromCurrency,
      toCurrency,
      amount,
      rate,
      result,
      timestamp: new Date().toISOString(),
    });

    // Send the result back to the client
    res.status(200).json({
      fromCurrency,
      toCurrency,
      amount,
      rate,
      result,
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({ error: 'Error fetching exchange rate from API' });
  }
});

// Start the server
// index.js

const PORT = process.env.PORT || 5000;  // Ensure your backend is listening on port 5000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

