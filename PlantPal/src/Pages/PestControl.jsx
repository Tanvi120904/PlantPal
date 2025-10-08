import React, { useState, useEffect } from "react"; 
import styles from "../Styles/PestControl.module.css";
import apiAuth from '../utils/apiAuth';

function PestControl() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const [preview, setPreview] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFileName('No file chosen');
            return;
        }
        if (preview) URL.revokeObjectURL(preview);

        setSelectedFile(file);
        setFileName(file.name);
        setPreview(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return alert("Please upload a plant/leaf photo first.");

        const formData = new FormData();
        formData.append('plantImage', selectedFile);

        try {
            setLoading(true);
            setAnalysisResult(null);
            setError(null);

            const response = await apiAuth.post("/pest/scan", formData, {
                 headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAnalysisResult(response.data.analysis);
        } catch (err) {
            console.error("Analysis Failed:", err);
            const msg = err.response?.data?.message || "Analysis failed. Check your API key and file size.";
            setError(msg);
            setAnalysisResult({ error: msg });
        } finally {
            setLoading(false);
        }
    };

    const formatResults = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, idx) => <p key={idx}>{line}</p>);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Pest & Disease Detection</h2>
                <p className={styles.descText}>
                    Upload a photo of your plant’s leaves to detect pests or early diseases.
                </p>

                <div className={styles.uploadSection}>
                    <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }}
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

                {analysisResult && (
                    <div className={styles.resultsSection}>
                        <h3>AI Diagnosis & Treatment Plan:</h3>
                        {analysisResult.error ? (
                            <p className={styles.errorText}>{analysisResult.error}</p>
                        ) : (
                            <div className={styles.analysisText}>{formatResults(analysisResult)}</div>
                        )}
                    </div>
                )}

                {error && <p className={styles.errorText}>{error}</p>}
            </div>
        </div>
    );
}

export default PestControl;
