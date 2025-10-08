import React, { useState, useEffect, useCallback } from "react";
import styles from '../Styles/SoilHealth.module.css'; // Import the CSS Module
import DescriptionPopup from '../Components/DescriptionPopup';
import apiAuth from '../utils/apiAuth'; // Secure API client

// --- Data Model for Simulation (Based on Moisture) ---
const getSimulatedData = (moisture) => {
  // This is a temporary rule to fill the UI cards based on the only data we have (moisture)
  let n = 'Optimal', p = 'Optimal', k = 'Optimal', ph = 6.5;

  if (moisture < 35) {
    n = 'Slightly Low'; // Low moisture often correlates with low nutrient absorption
    ph = 6.8;
  } else if (moisture > 75) {
    p = 'Optimal';
    ph = 6.0;
  }

  return { moisture, ph, nitrogen: n, phosphorus: p, potassium: k };
};

function SoilHealth() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Stores the MongoDB Device ID
  const [userDevices, setUserDevices] = useState([]); // Stores the list of the user's devices
  const [soilData, setSoilData] = useState(null); // The full health report (live/simulated)
  const [loading, setLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  // --- DATA FETCHING ---

  // 1. Fetch user devices on mount
  const fetchUserDevices = useCallback(async () => {
    try {
      const response = await apiAuth.get('/dashboard/devices');
      const devices = response.data;
      setUserDevices(devices);

      // Automatically select the first device if available
      if (devices.length > 0) {
        setSelectedDeviceId(devices[0]._id);
        // Trigger report fetch for the first device immediately
        fetchHealthReport(devices[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user devices:", error);
      setLoading(false);
    }
  }, []);

  // 2. Fetch the detailed soil health report (or simulate it)
  const fetchHealthReport = useCallback(async (deviceId) => {
    if (!deviceId) return;
    setSoilData(null); // Clear previous data

    try {
      // CRITICAL: We fetch the device's current moisture level from the DB
      const response = await apiAuth.get(`/dashboard/devices`);
      const device = response.data.find(d => d._id === deviceId);

      if (device) {
        // SIMULATE: Use the device's actual moisture level for the report
        const simulatedReport = getSimulatedData(device.moistureLevel);
        setSoilData(simulatedReport);
      }

    } catch (error) {
      console.error("Failed to fetch simulated soil health report:", error);
    }
    setLoading(false);
  }, []);

  // Effect to run when component mounts and on device selection change
  useEffect(() => {
    fetchUserDevices();
  }, [fetchUserDevices]);

  useEffect(() => {
    // Fetch report whenever a new device is selected
    fetchHealthReport(selectedDeviceId);
  }, [selectedDeviceId, fetchHealthReport]);


  // --- HANDLERS ---

  const handlePlantSelect = (e) => {
    // Set the state to the selected device ID
    setSelectedDeviceId(e.target.value);
    // fetchHealthReport will run due to useEffect dependency
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('optimal')) return 'statusOptimal';
    if (lowerStatus.includes('low')) return 'statusLow';
    return 'statusMedium'; // Default for Sufficient/Neutral
  };

  const getSuggestions = (data) => {
    if (!data) return [];
    const suggestions = [];

    // 🌞 Sunlight suggestions (Based on Moisture)
    if (data.moisture < 40) {
      suggestions.push("💧 Soil moisture is low — water deeply now.");
      suggestions.push("🌞 Reduce direct sunlight exposure to prevent evaporation.");
    } else if (data.moisture > 70) {
      suggestions.push("💧 Soil is too wet — check drainage and reduce watering.");
      suggestions.push("🌞 Ensure good sunlight exposure to help dry excess moisture.");
    } else {
      suggestions.push("💧 Moisture is optimal — maintain current watering schedule.");
    }

    // 🪴 Nutrient/pH suggestions (Simulated data)
    if (data.nitrogen.toLowerCase().includes("low")) {
      suggestions.push("🪴 Nitrogen is low: Consider adding compost or blood meal.");
    }
    if (data.ph < 6.0) {
      suggestions.push("🪴 Soil is acidic: Add garden lime to neutralize pH.");
    } else if (data.ph > 7.0) {
      suggestions.push("🪴 Soil is alkaline: Add sulfur or organic matter.");
    }

    return suggestions;
  };

  if (loading) return <p>Loading Soil Health Dashboard...</p>;

  return (
    <div className={styles.card} style={{ maxWidth: '2000px', margin: '20px auto' }}>
      <div className={styles.header}>
        <h2>Soil Health Dashboard</h2>
        <button className={styles.descriptionButton} onClick={() => setPopupVisible(true)}>
          See description to setup sensor
        </button>
      </div>

      <div className={styles.soilControls}>
        <label htmlFor="plant-select">Select a Plant:</label>
        <select id="plant-select" value={selectedDeviceId} onChange={handlePlantSelect}>
          <option value="" disabled>-- Choose your plant --</option>
          {/* Populate dropdown with user's registered devices */}
          {userDevices.map((device) => (
            <option key={device._id} value={device._id}>
              {device.deviceName}
            </option>
          ))}
        </select>
      </div>

      {/* Render data only if a report is available */}
      {soilData ? (
        <>
          <div className={styles.soilDataGrid}>
            {/* 1. Moisture Card */}
            <div className={styles.metricCard}>
              <h3>Moisture</h3>

              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${soilData.moisture}%` }}>
                  {/* Text is inside the bar, guaranteed visibility */}
                  {soilData.moisture}%
                </div>
              </div>
              <p className={styles.statusText}>
                {soilData.moisture > 70 ? 'Sufficient' : soilData.moisture > 40 ? 'Optimal' : 'Needs Water'}
              </p>
            </div>

            {/* 2. pH Level Card (Simulated) */}
            <div className={styles.metricCard}>
              <h3>pH Level</h3>
              <p className={styles.metricValue}>{soilData.ph.toFixed(1)}</p>
              <p className={styles.statusText}>
                {soilData.ph > 6.5 ? 'Alkaline' : soilData.ph < 6.0 ? 'Acidic' : 'Neutral'}
              </p>
            </div>

            {/* 3. Nitrogen Card (Simulated) */}
            <div className={styles.metricCard}>
              <h3>Nitrogen (N)</h3>
              <p className={`${styles.statusPill} ${styles[getStatusClass(soilData.nitrogen)]}`}>
                {soilData.nitrogen}
              </p>
            </div>

            {/* 4. Phosphorus Card (Simulated) */}
            <div className={styles.metricCard}>
              <h3>Phosphorus (P)</h3>
              <p className={`${styles.statusPill} ${styles[getStatusClass(soilData.phosphorus)]}`}>
                {soilData.phosphorus}
              </p>
            </div>

            {/* 5. Potassium Card (Simulated) */}
            <div className={styles.metricCard}>
              <h3>Potassium (K)</h3>
              <p className={`${styles.statusPill} ${styles[getStatusClass(soilData.potassium)]}`}>
                {soilData.potassium}
              </p>
            </div>
          </div>

          <div className={styles.soilSuggestions}>
            <h3>Suggestions for Your Plant</h3>
            <ul>
              {getSuggestions(soilData).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className={styles.promptText}>Select a plant or register a device to view its soil health data.</p>
      )}

      <DescriptionPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </div>
  );
}

export default SoilHealth;