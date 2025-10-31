import React, { useState } from "react";
import styles from "../Styles/PestControl.module.css"; // Import the CSS Module

function PestControl() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); // Clear previous results
  };

  // Send image to backend for analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return alert("Please upload a plant/leaf photo first.");

    const formData = new FormData();
    formData.append("plantImage", selectedFile); // ✅ match backend field name

    try {
      setLoading(true);
      setResult(null);

      // ✅ Correct backend endpoint
      const token = localStorage.getItem("token"); // assuming you save JWT after login

const response = await fetch("http://localhost:5000/api/pest/scan", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});


      if (!response.ok) throw new Error("Failed to analyze image");

      const data = await response.json();
      setResult(data.analysis || data); // handles both structured responses
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Analysis failed. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Pest & Disease Detection</h2>
      <p className={styles.descText}>
        Upload a photo of your plant’s leaves to detect pests or early diseases.
      </p>

      {/* Upload Section */}
      <div className={styles.uploadSection}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div className={styles.imagePreview}>
            <img src={preview} alt="Plant Preview" />
          </div>
        )}
        <button
          className={styles.analyzeButton}
          onClick={handleAnalyze}
          disabled={loading || !selectedFile}
        >
          {loading ? "Analyzing..." : "Analyze Photo"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className={styles.resultsSection}>
          {result.error ? (
            <p className={styles.errorText}>{result.error}</p>
          ) : (
            <>
              <h3>Analysis Results</h3>
              <p><strong>Disease/Pest:</strong> {result.disease || "Unknown"}</p>
              <p><strong>Confidence:</strong> {result.confidence ? `${result.confidence}%` : "N/A"}</p>
              <p><strong>Suggestion:</strong> {result.suggestion || "No suggestion available."}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PestControl;
