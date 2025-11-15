import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from 'react-router-dom'; // <-- NEW IMPORT

ReactDOM.render(
  <React.StrictMode>
    {/* CRITICAL FIX: Wrap the entire application in the Router */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);