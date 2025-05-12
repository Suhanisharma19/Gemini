// main.jsx
import ContextProvider from './context/context.jsx';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
 // Ensure the correct path

// Use ReactDOM.createRoot instead of createRoot directly
ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
