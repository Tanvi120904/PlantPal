import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialGate from "./Pages/Initial"; // The new Auth Wall page
import Home from "./Pages/Home";
import Plantlib from "./Pages/Plantlib";
import Features from "./Pages/Features";
import StartWatering from "./Pages/StartWatering";
import Dashboard from "./Pages/Dashboard";
import UrbanGrow from "./Pages/UrbanGrow";
import SoilHealth from "./Pages/SoilHealth"; // Assuming these are valid page components
import PestControl from "./Pages/PestControl"; // Assuming these are valid page components
import AuthWrapper from "./Components/AuthWrapper"; // The security gate

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. PUBLIC/ENTRY PATH: This is the authentication wall (Login/Signup forms) */}
        <Route path="/" element={<InitialGate />} /> 

        {/* 2. PROTECTED PATHS: All nested routes below require a successful login (JWT) */}
        <Route element={<AuthWrapper />}>
            {/* The Home page is the first page the user sees after logging in */}
            <Route path="/home" element={<Home />} /> 
            
            <Route path="/plantlib" element={<Plantlib />} />
            <Route path="/features" element={<Features />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/urbangrow" element={<UrbanGrow />} />
            <Route path="/startwatering" element={<StartWatering />} />
            
            {/* Additional secure pages */}
            <Route path="/soilhealth" element={<SoilHealth />} />
            <Route path="/pestcontrol" element={<PestControl />} />
        </Route>

        {/* Optional: Add a fallback route for unmatched paths */}
        <Route path="*" element={<InitialGate />} /> 

      </Routes>
    </Router>
  );
}

export default App;
