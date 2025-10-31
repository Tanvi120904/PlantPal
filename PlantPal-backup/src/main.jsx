import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // optional if using Tailwind
import { BrowserRouter as Router } from "react-router-dom"; // Ensure Router is imported if App.jsx uses it
import { UserProvider } from './context/UserContext.jsx'; // <-- IMPORT the User Provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider> {/* CRITICAL: The app must be INSIDE this wrapper */}
      <App /> 
    </UserProvider>
  </React.StrictMode>
);