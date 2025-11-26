// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';
import ContextProvider from './context/context.jsx'; // Ensure the correct path

// Use ReactDOM.createRoot instead of createRoot directly
ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
