import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional: You can remove this if you don't have any global styles
import App from './App';  // Import App component
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />  {/* Render the App component */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
