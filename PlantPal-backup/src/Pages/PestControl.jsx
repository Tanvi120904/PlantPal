// src/Pages/PestControl.jsx
import React, { useState, useEffect } from "react";
import styles from "../Styles/PestControl.module.css";
import apiAuth from "../utils/apiAuth"; // Use your configured Axios instance

function PestControl() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clean up preview URLs when unmounted
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName("No file chosen");
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Clean old preview and set new
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
  };

  // Send image to backend for AI analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return alert("Please upload a plant/leaf photo first.");

    const formData = new FormData();
    formData.append("plantImage", selectedFile);

    try {
      setLoading(true);
      setAnalysisResult(null);
      setError(null);

      // 🔗 Connect to backend endpoint (using apiAuth)
      const response = await apiAuth.post("/pest/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Expecting `response.data.analysis` from backend
      setAnalysisResult(response.data.analysis);
    } catch (err) {
      console.error("Analysis Failed:", err);
      const msg =
        err.response?.data?.message ||
        "Analysis failed. Please try again later or check your backend.";
      setError(msg);
      setAnalysisResult({ error: msg });
    } finally {
      setLoading(false);
    }
  };

  // Nicely format backend multi-line text
  const formatResults = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => <p key={idx}>{line}</p>);
  };

  return (
    <div className={styles.card}>
      <h2>Pest & Disease Detection</h2>
      <p className={styles.descText}>
        Upload a photo of your plant’s leaves to detect pests or early diseases.
      </p>

      {/* Upload Section */}
      <div className={styles.uploadSection}>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="file-upload" className={styles.chooseButton}>
          Choose File
        </label>
        <span className={styles.fileName}>{fileName}</span>

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
      {analysisResult && (
        <div className={styles.resultsSection}>
          <h3>AI Diagnosis & Treatment Plan:</h3>
          {analysisResult.error ? (
            <p className={styles.errorText}>{analysisResult.error}</p>
          ) : (
            <div className={styles.analysisText}>
              {formatResults(analysisResult)}
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default PestControl;
