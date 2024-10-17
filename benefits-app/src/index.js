import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import './index.css';

// Get the root container element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the application
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);