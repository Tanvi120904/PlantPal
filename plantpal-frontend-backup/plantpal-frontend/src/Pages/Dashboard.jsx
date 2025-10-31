// src/pages/Dashboard.jsx
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../Styles/Dashboard.css";

function Dashboard() {
  // --- Mock sensor data ---
  const plants = [
    { name: "Rose", status: "✅", moisture: 80, sunlight: "Full Sun" },
    { name: "Tulip", status: "✅", moisture: 65, sunlight: "Full Sun" },
    { name: "Orchid", status: "⚠️", moisture: 35, sunlight: "Partial Shade" },
    { name: "Pothos", status: "✅", moisture: 50, sunlight: "Partial Shade" },
    { name: "Spider Plant", status: "✅", moisture: 90, sunlight: "Low Light" },
  ];

  const attentionPlants = plants.filter((p) => p.moisture < 45);

  // --- Prepare light exposure data with plant names ---
  const sunlightCategories = ["Full Sun", "Partial Shade", "Low Light"];
  const lightExposure = sunlightCategories.map((category) => {
    const plantNames = plants
      .filter((p) => p.sunlight === category)
      .map((p) => p.name)
      .join(", ") || "None";
    return { name: category, plants: plantNames, value: 1 }; // value=1 for equal slice sizes
  });

  const COLORS = ["#FFD54F", "#81C784", "#64B5F6"];

  return (
    <div>
      {/* --- Navbar --- */}
      <nav className="navbar-home">
        <div className="navbar-left">
          <img src="/Main.png" alt="PlantPal Logo" className="logo"  />
        </div>
        <ul className="nav-links-home">
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/plantlib">Plant Library</NavLink></li>
          <li><NavLink to="/features">Features</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink></li>
          <li><NavLink to="/urbangrow">UrbanGrow</NavLink></li>
        </ul>
      </nav>

      {/* --- Dashboard Body --- */}
      <div className="dashboard-container">
        {/* --- Garden Overview --- */}
        <motion.div
          className="garden-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="overview-header">
            <h1>🌿 Garden Overview</h1>
            <p className="overview-subtext">
              {attentionPlants.length === 0
                ? "Everything looks lush and healthy today!"
                : `Some plants need your attention (${attentionPlants.length})`}
            </p>
          </div>

          <div className="overview-summary">
            <div className="summary-item">💧 Moisture: <span>Optimal</span></div>
            <div className="summary-item">🌱 Nutrients: <span>Good</span></div>
            <div className="summary-item">🐞 Pests: <span>None Detected</span></div>
          </div>

          {attentionPlants.length > 0 && (
            <div className="attention-list">
              <h3>🪴 Needs Attention</h3>
              <ul>
                {attentionPlants.map((plant) => (
                  <li key={plant.name}>{plant.name} — Low moisture ({plant.moisture}%)</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* --- My Garden Section --- */}
        <h2 className="section-title">My Garden</h2>

        <div className="charts-row">
          {/* --- Bar Chart --- */}
          <div className="chart-container">
            <h3 className="chart-title">Plant Moisture Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={plants}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="moisture" name="Moisture (%)">
                  {plants.map((plant, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={plant.moisture < 45 ? "#ef5350" : "#66bb6a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* --- Pie Chart --- */}
          <div className="chart-container">
            <h3 className="chart-title">Light Exposure Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lightExposure}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ plants }) => plants} // show plant names only
                >
                  {lightExposure.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    return [props.payload.plants, name]; // show plant names in tooltip
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Automated Schedules --- */}
        <h2 className="section-title">Automated Schedules</h2>
        <motion.div
          className="schedules-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="schedule-item">
            <strong>Rose:</strong> Watering is <strong>ON</strong>. Waters automatically when moisture drops below 45%.
          </div>
          <div className="schedule-item">
            <strong>Pothos:</strong> Maintains between 45–50% moisture. Watering cycle: every 6 hours if needed.
          </div>
          <div className="schedule-item">
            <strong>Spider Plant:</strong> Stops watering at 95% moisture threshold.
          </div>
          <div className="schedule-item">
            <strong>System:</strong> Next pest detection scan scheduled for tomorrow at 9:00 AM.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
