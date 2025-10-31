import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
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

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch from MongoDB (real-time device data) ---
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/devices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDevices(res.data);
      } catch (err) {
        console.error("Error fetching devices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;

  const COLORS = ["#FFD54F", "#81C784", "#64B5F6"];

  // --- Dynamic calculations ---
  const attentionPlants = devices.filter((d) => d.moistureLevel < 45);
  const avgMoisture =
    devices.length > 0
      ? Math.round(devices.reduce((acc, d) => acc + d.moistureLevel, 0) / devices.length)
      : 0;

  // Light data (mock for now)
  const lightData = [
    { name: "Full Sun", value: 40 },
    { name: "Partial Shade", value: 35 },
    { name: "Low Light", value: 25 },
  ];

  return (
    <div>
    
      <div className="dashboard-container">
        {/* 🌿 Garden Overview */}
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
            <div className="summary-item">
              💧 Moisture: <span>{avgMoisture > 70 ? "Optimal" : avgMoisture < 40 ? "Low" : "Moderate"}</span>
            </div>
            <div className="summary-item">🌱 Nutrients: <span>Good</span></div>
            <div className="summary-item">🐞 Pests: <span>None Detected</span></div>
          </div>

          {attentionPlants.length > 0 && (
            <div className="attention-list">
              <h3>🪴 Needs Attention</h3>
              <ul>
                {attentionPlants.map((plant) => (
                  <li key={plant._id}>
                    {plant.plantType || plant.deviceName} — Low moisture ({plant.moistureLevel}%)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* --- My Garden --- */}
        <h2 className="section-title">My Garden</h2>

        <div className="charts-row">
          {/* --- Bar Chart --- */}
          <div className="chart-container">
            <h3 className="chart-title">Plant Moisture Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={devices}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plantType" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="moistureLevel" name="Moisture (%)">
                  {devices.map((plant, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={plant.moistureLevel < 45 ? "#ef5350" : "#66bb6a"}
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
                  data={lightData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name }) => name}
                >
                  {lightData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
          {devices.length === 0 ? (
            <p>No devices linked yet.</p>
          ) : (
            devices.map((device) => (
              <div className="schedule-item" key={device._id}>
                <strong>{device.plantType || device.deviceName}:</strong>{" "}
                {device.moistureLevel < 45
                  ? "Watering is ON — Low moisture detected 💧"
                  : "Maintaining healthy moisture levels ✅"}
                <br />
                <small>
                  Last watered:{" "}
                  {device.lastWatered
                    ? new Date(device.lastWatered).toLocaleString()
                    : "Never"}
                </small>
              </div>
            ))
          )}
          <div className="schedule-item">
            <strong>System:</strong> Next pest scan scheduled for tomorrow at 9:00 AM.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
