import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Axios for making API requests
import { saveConversionData } from './firebase';  // Import the save function from firebase.js

function CurrencyExchange() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('MYR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [conversionResult, setConversionResult] = useState(null);

  // API Key for ExchangeRate-API (replace with your own API key)
  const API_KEY = '0292cffab5264d71b26effa9';
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(API_URL);
        setExchangeRate(response.data.conversion_rates[toCurrency]);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConversion = () => {
    const result = (amount * exchangeRate).toFixed(2); // Calculate result
    setConversionResult(result);

    // Save conversion data to Firestore
    saveConversionData(fromCurrency, toCurrency, amount, exchangeRate, result);
  };

  return (
    <div className="currency-exchange-container">
      <h1>Currency Exchange</h1>

      <div className="currency-inputs">
        <div className="currency-selector">
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option value="USD">USD - US Dollar</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            {/* Add more currencies as needed */}
          </select>

          <span> to </span>

          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            <option value="USD">USD - US Dollar</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            {/* Add more currencies as needed */}
          </select>
        </div>

        <div className="currency-amount">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            className="currency-amount-input"
          />
          <span className="currency-symbol">{fromCurrency}</span>
        </div>

        <div className="conversion-result">
          {conversionResult ? (
            <p>
              <strong>{amount}</strong> {fromCurrency} is equal to{' '}
              <strong>{conversionResult}</strong> {toCurrency}.
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <button onClick={handleConversion}>Convert</button>
      </div>
    </div>
  );
}

export default CurrencyExchange;
