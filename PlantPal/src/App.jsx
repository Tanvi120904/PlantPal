import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SensorProvider } from "./context/SensorContext"; // ✅ new import
import InitialGate from "./Pages/Initial";
import Home from "./Pages/Home";
import Plantlib from "./Pages/Plantlib";
import Features from "./Pages/Features";
import StartWatering from "./Pages/StartWatering";
import Dashboard from "./Pages/Dashboard";
import UrbanGrow from "./Pages/UrbanGrow";
import SoilHealth from "./Pages/SoilHealth";
import PestControl from "./Pages/PestControl";
import AuthWrapper from "./Components/AuthWrapper";

function App() {
  return (
    <SensorProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/" element={<InitialGate />} />

          {/* PROTECTED ROUTES */}
          <Route element={<AuthWrapper />}>
            <Route path="/home" element={<Home />} />
            <Route path="/plantlib" element={<Plantlib />} />
            <Route path="/features" element={<Features />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/urbangrow" element={<UrbanGrow />} />
            <Route path="/startwatering" element={<StartWatering />} />
            <Route path="/soilhealth" element={<SoilHealth />} />
            <Route path="/pestcontrol" element={<PestControl />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<InitialGate />} />
        </Routes>
      </Router>
    </SensorProvider>
  );
}

export default App;
