import React from 'react';
import ReactDOM from 'react-dom';
import App from "./app/App";
import './app/config/i18n';
import "/node_modules/flag-icons/css/flag-icons.min.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);