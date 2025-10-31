// src/pages/SoilHealth.jsx
import React, { useState, useEffect } from "react";
import styles from '../Styles/SoilHealth.module.css';
import DescriptionPopup from '../Components/DescriptionPopup'; 

const MOCK_SOIL_DATA = {
  Rose: { moisture: 65, ph: 6.8, nitrogen: 'Optimal', phosphorus: 'Slightly Low', potassium: 'Optimal' },
  Tulip: { moisture: 78, ph: 6.2, nitrogen: 'Optimal', phosphorus: 'Optimal', potassium: 'Optimal' },
  Pothos: { moisture: 45, ph: 5.9, nitrogen: 'Low', phosphorus: 'Optimal', potassium: 'Slightly Low' },
  Orchid: { moisture: 55, ph: 5.7, nitrogen: 'Optimal', phosphorus: 'Optimal', potassium: 'Optimal' },
  "Spider Plant": { moisture: 90, ph: 6.5, nitrogen: 'Optimal', phosphorus: 'Optimal', potassium: 'Optimal' },
};

function SoilHealth() {
  const [selectedPlant, setSelectedPlant] = useState('');
  const [soilData, setSoilData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [stableMessage, setStableMessage] = useState('');

  const plantOptions = ["Rose", "Tulip", "Pothos", "Orchid", "Spider Plant"];

  const handlePlantSelect = (e) => {
    const plant = e.target.value;
    setSelectedPlant(plant);
    setSoilData(plant ? { ...MOCK_SOIL_DATA[plant] } : null);
    setStableMessage('');
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('optimal')) return 'statusOptimal';
    if (lowerStatus.includes('low')) return 'statusLow';
    return 'statusMedium';
  };

  useEffect(() => {
    if (!selectedPlant || !soilData) return;

    const interval = setInterval(() => {
      setSoilData((prevData) => {
        if (!prevData) return prevData;

        let newMoisture = prevData.moisture;

        // 🌿 Pothos stops at 50%
        if (selectedPlant === "Pothos" && prevData.moisture >= 50) {
          setStableMessage("✅ Stable Moisture Reached (50%)");
          return prevData;
        }

        // 🌿 Spider Plant stops at 95%
        if (selectedPlant === "Spider Plant" && prevData.moisture >= 95) {
          setStableMessage("✅ Stable Moisture Reached (95%)");
          return prevData;
        }

        setStableMessage(""); // clear message if still increasing

        newMoisture = prevData.moisture >= 100 ? 30 : prevData.moisture + 1;
        return { ...prevData, moisture: newMoisture };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedPlant, soilData]);

  const getSuggestions = (data) => {
    if (!data) return [];
    const suggestions = [];

    if (data.moisture < 40) {
      suggestions.push("🌞 Reduce direct sunlight exposure to prevent evaporation.");
    } else if (data.moisture > 70) {
      suggestions.push("🌞 Ensure good sunlight exposure to help dry excess moisture.");
    } else {
      suggestions.push("🌞 Maintain bright indirect sunlight for best growth.");
    }

    if (data.nitrogen.toLowerCase().includes("low")) {
      suggestions.push("🪴 Add a nitrogen-rich fertilizer (e.g., compost or blood meal).");
    }
    if (data.phosphorus.toLowerCase().includes("low")) {
      suggestions.push("🪴 Add bone meal or rock phosphate for phosphorus.");
    }
    if (data.potassium.toLowerCase().includes("low")) {
      suggestions.push("🪴 Add kelp meal or wood ash for potassium.");
    }
    if (data.ph < 6.0) {
      suggestions.push("🪴 Soil is acidic — add garden lime to neutralize pH.");
    } else if (data.ph > 7.5) {
      suggestions.push("🪴 Soil is alkaline — add sulfur or organic matter.");
    }

    if (data.moisture < 40) {
      suggestions.push("💧 Soil moisture is low — water deeply now and mulch to retain moisture.");
    } else if (data.moisture > 70) {
      suggestions.push("💧 Soil is too wet — check drainage and reduce watering.");
    } else {
      suggestions.push("💧 Moisture is optimal — maintain current watering schedule.");
    }

    return suggestions;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Soil Health Dashboard</h2>
        <button className={styles.descriptionButton} onClick={() => setPopupVisible(true)}>
          See description to setup sensor
        </button>
      </div>

      <div className={styles.soilControls}>
        <label htmlFor="plant-select">Select a Plant:</label>
        <select id="plant-select" value={selectedPlant} onChange={handlePlantSelect}>
          <option value="">-- Choose your plant --</option>
          {plantOptions.map((plant) => (
            <option key={plant} value={plant}>{plant}</option>
          ))}
        </select>
      </div>

      {soilData ? (
        <>
          <div className={styles.soilDataGrid}>
            <div className={styles.metricCard}>
              <h3>Moisture</h3>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${soilData.moisture}%`, transition: "width 1s ease" }}>
                  {soilData.moisture}%
                </div>
              </div>
              <p className={styles.statusText}>
                {soilData.moisture > 70 ? 'Sufficient' : soilData.moisture > 40 ? 'Optimal' : 'Needs Water'}
              </p>
              {stableMessage && <p style={{ color: "green", fontWeight: "bold" }}>{stableMessage}</p>}
            </div>

            <div className={styles.metricCard}>
              <h3>pH Level</h3>
              <p className={styles.metricValue}>{soilData.ph.toFixed(1)}</p>
              <p className={styles.statusText}>
                {soilData.ph > 6.5 ? 'Alkaline' : soilData.ph < 6.0 ? 'Acidic' : 'Neutral'}
              </p>
            </div>

            <div className={styles.metricCard}>
              <h3>Nitrogen (N)</h3>
              <p className={`${styles.statusPill} ${styles[getStatusClass(soilData.nitrogen)]}`}>
                {soilData.nitrogen}
              </p>
            </div>

            <div className={styles.metricCard}>
              <h3>Phosphorus (P)</h3>
              <p className={`${styles.statusPill} ${styles[getStatusClass(soilData.phosphorus)]}`}>
                {soilData.phosphorus}
              </p>
            </div>

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
        <p className={styles.promptText}>Please select a plant to view its soil health data.</p>
      )}

      <DescriptionPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </div>
  );
}

export default SoilHealth;
