import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'wouter';
import './styles/global.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router base={process.env.PUBLIC_URL || ''}>
      <App />
    </Router>
  </React.StrictMode>
);