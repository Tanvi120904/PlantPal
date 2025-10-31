// src/pages/StartWatering.jsx
import React, { useState } from "react";
import DescriptionPopup from "../Components/DescriptionPopup";
import styles from "../Styles/StartWatering.module.css";

function StartWatering() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    plant: "",
    startTime: "",
    frequency: "daily",
    duration: 1,
  });
  const [editId, setEditId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const plantOptions = ["Rose", "Tulip", "Lily", "Orchid"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addSchedule = () => {
    if (!formData.plant || !formData.startTime || !formData.duration) {
      alert("Please fill all fields.");
      return;
    }
    if (editId) {
      setSchedules(
        schedules.map((sched) =>
          sched.id === editId ? { ...formData, id: editId, enabled: sched.enabled } : sched
        )
      );
      setEditId(null);
    } else {
      setSchedules([...schedules, { ...formData, id: Date.now(), enabled: true }]);
    }
    setFormData({ plant: "", startTime: "", frequency: "daily", duration: 1 });
    setShowPlantDropdown(false);
  };

  const toggleSchedule = (id) => {
    setSchedules(
      schedules.map((sched) =>
        sched.id === id ? { ...sched, enabled: !sched.enabled } : sched
      )
    );
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((sched) => sched.id !== id));
  };

  const editSchedule = (sched) => {
    setFormData({
      plant: sched.plant,
      startTime: sched.startTime,
      frequency: sched.frequency,
      duration: sched.duration,
    });
    setEditId(sched.id);
    setShowPlantDropdown(false);
  };

  const handlePlantClick = (plant) => {
    setFormData({ ...formData, plant });
    setShowPlantDropdown(false);
  };

  const saveChanges = () => {
    alert("Changes saved! Your schedules will appear on the dashboard.");
  };

  const filteredPlants = plantOptions.filter((p) =>
    p.toLowerCase().includes(formData.plant.toLowerCase())
  );

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Watering Schedule Management</h2>
          <button className={styles.descriptionButton} onClick={() => setPopupVisible(true)}>
            See description to setup sensor
          </button>
        </div>

        <div className={styles.formContainer}>
          {/* Your plant dropdown input can go here if you want to add it back */}
          <input
            type="text"
            name="plant"
            placeholder="Plant Name"
            value={formData.plant}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
          />
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="Once in 2-3 days">Once in 2-3 days</option>
          </select>
          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            min="1"
            value={formData.duration}
            onChange={handleInputChange}
          />
          <button onClick={addSchedule} className={styles.addScheduleButton}>
            {editId ? "Update Schedule" : "Add Schedule"}
          </button>
        </div>
      </div>

      <div className={styles.scheduleList}>
        {schedules.length === 0 && <p>No schedules yet.</p>}
        {schedules.map((sched) => (
          <div className={styles.scheduleCard} key={sched.id}>
            <div className={styles.scheduleInfo}>
              <h3>{sched.plant}</h3>
              <p>
                Time: {sched.startTime} | Frequency: {sched.frequency} | Duration: {sched.duration} mins
              </p>
            </div>
            <div className={styles.scheduleActions}>
              <button
                className={sched.enabled ? styles.enabled : styles.disabled}
                onClick={() => toggleSchedule(sched.id)}
              >
                {sched.enabled ? "Disable" : "Enable"}
              </button>
              <button
                className={styles.editButton}
                onClick={() => editSchedule(sched)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => deleteSchedule(sched.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {schedules.length > 0 && (
        <div className={styles.saveWrapper}>
          <button className={styles.saveButton} onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.calendarView}>
          <h2>Plan using calender</h2>
          <div className={styles.calendarPlaceholder}>
            <p>🗓️ Calendar will be implemented here.</p>
          </div>
        </div>
      </div>

      <DescriptionPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </div>
  );
}

export default StartWatering;