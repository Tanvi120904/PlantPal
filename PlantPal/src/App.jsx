import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Initial from "./Pages/Initial";
import Home from "./Pages/Home";
import Plantlib from "./Pages/Plantlib";
import Features from "./Pages/Features";
import StartWatering from "./Pages/StartWatering";
import Dashboard from "./Pages/Dashboard"; // ✅ FIXED PATH
import UrbanGrow from "./Pages/UrbanGrow"; // ✅ FIXED PATH
import AppHeader from "./Components/AppHeader.jsx"; // ✅ optional, if you have it
import SoilHealth from "./Pages/SoilHealth";
import PestControl from "./Pages/PestControl";

function App() {
  return (
    <Router>
      <AppHeader /> {/* Optional: keep if needed */}
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plantlib" element={<Plantlib />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/urbangrow" element={<UrbanGrow />} />
        <Route path="/startwatering" element={<StartWatering />} />
        {/* Optional fallback route */}
        <Route path="*" element={<Home />} /> 
        <Route path="/soilhealth" element={<SoilHealth/>} />
        <Route path="/pestcontrol" element={<PestControl/>} />
      </Routes>
    </Router>
  );
}

export default App;
