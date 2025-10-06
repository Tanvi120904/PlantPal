import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom"; // 1. IMPORT ReactDOM for Portals
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import API_URL from '../config/api'; 
import DeviceSetupForm from "../Components/DeviceSetupForm";
import "../Styles/Plantlib.css";

// --- This helper component ensures the modal always appears on top ---
const ModalPortal = ({ children }) => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal-root');
      document.body.appendChild(modalRoot);
    }
    return ReactDOM.createPortal(children, modalRoot);
};


// --- Add Plant Modal Component (Handles Device Setup Flow) ---
const AddPlantModal = ({ plant, onClose, navigate }) => {
    // This function is passed to the form to handle successful device registration
    const handleSetupSuccess = () => {
        onClose(); // Close this modal
        navigate('/dashboard'); // Navigate to the dashboard
    };

    return (
        <div className="add-plant-modal-overlay" onClick={onClose}>
            <div className="add-plant-modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="add-plant-modal-close-btn">&times;</button>
                
                {/* Render the Device Setup Form directly */}
                <DeviceSetupForm 
                    plantId={plant._id} 
                    plantName={plant.name}
                    onSuccess={handleSetupSuccess}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};


// --- MAIN PLANT LIBRARY COMPONENT ---
const Plantlib = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlant, setSelectedPlant] = useState(null); 
    const [showAddModal, setShowAddModal] = useState(false);
    
    const navigate = useNavigate();

    // Filter and Pagination states
    const [searchTerm, setSearchTerm] = useState("");
    const [careFilter, setCareFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1);
    const plantsPerPage = 12;

    // This function now safely assumes the user is logged in.
    const handleAddClick = (plant) => { 
        setSelectedPlant(plant); 
        setShowAddModal(true);
    };
    
    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedPlant(null);
    };

    // --- API Fetch Logic ---
    const fetchPlants = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (careFilter) params.append('careLevel', careFilter);
        if (typeFilter) params.append('tag', typeFilter);
        if (searchTerm) params.append('search', searchTerm);

        const url = `${API_URL}/plants?${params.toString()}`;

        try {
            const response = await axios.get(url);
            setPlants(response.data);
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError("Failed to load plants. Please ensure the server is running.");
        } finally {
            setLoading(false);
        }
    }, [careFilter, typeFilter, searchTerm]); 

    useEffect(() => {
        fetchPlants();
        setCurrentPage(1); 
    }, [fetchPlants]); 

    // --- Filter/Pagination Handlers ---
    const handleCareFilter = (care) => setCareFilter(care === careFilter ? '' : care);
    const handleTypeFilter = (type) => setTypeFilter(type === typeFilter ? '' : type);
    const handleResetFilters = () => { setCareFilter(""); setTypeFilter(""); setSearchTerm(""); };
    
    const indexOfLastPlant = currentPage * plantsPerPage;
    const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
    const currentPlants = plants.slice(indexOfFirstPlant, indexOfLastPlant); 
    const totalPages = Math.ceil(plants.length / plantsPerPage);

    return (
        <div className="plant-lib-container">
            {/* 2. REMOVED AppHeader. It's handled by AuthWrapper now. */}
            
            <div className="main-content-lib">
                <div className="header-lib"><h1>Find Your Next Green Friend</h1></div>
                
                <div className="filter-and-search-container">
                    <input type="text" placeholder="Filter plants by name..." className="search-input-lib" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="filters-wrapper">
                        <div className="filter-group">
                            <button className="filter-btn" onClick={handleResetFilters}>All</button>
                            <button className={`filter-btn-easy ${careFilter === 'Easy' ? 'active-filter' : ''}`} onClick={() => handleCareFilter("Easy")}>Easy</button>
                            <button className={`filter-btn-medium ${careFilter === 'Medium' ? 'active-filter' : ''}`} onClick={() => handleCareFilter("Medium")}>Medium</button>
                            <button className={`filter-btn-hard ${careFilter === 'Hard' ? 'active-filter' : ''}`} onClick={() => handleCareFilter("Hard")}>Hard</button>
                        </div>
                        <div className="filter-group">
                            <button className={`filter-btn ${typeFilter === 'Foliage' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Foliage")}>Foliage</button>
                            <button className={`filter-btn ${typeFilter === 'Flowering' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Flowering")}>Flowering</button>
                            <button className={`filter-btn ${typeFilter === 'Medicinal' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Medicinal")}>Medicinal</button>
                            <button className={`filter-btn ${typeFilter === 'Vegetable' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Vegetable")}>Vegetable</button>
                        </div>
                    </div>
                </div>

                {error && <p className="error-msg">{error}</p>}

                {loading ? (
                    <p className="loading-msg">Fetching data from the server...</p>
                ) : (
                    <div className="plant-card-grid">
                        {currentPlants.length === 0 ? (
                            <p className="no-plants-msg">No plants found matching your criteria.</p>
                        ) : (
                            currentPlants.map((plant) => (
                                <div key={plant._id} className="plant-card"> 
                                    <div className="plant-image-container">
                                        <img src={plant.imageUrl} alt={plant.name} className="plant-image" />
                                        <button className="add-icon" onClick={() => handleAddClick(plant)}>+</button>
                                    </div>
                                    <div className="plant-details">
                                        <h3 className="plant-name">{plant.name}</h3>
                                        <span className={`plant-care plant-care-${plant.careLevel.toLowerCase()}`}>
                                            {plant.careLevel} Care 
                                        </span>
                                        <p className="plant-description">{plant.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {totalPages > 1 && (
                    <div className="pagination">
                        <span className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt;</span>
                        {[...Array(totalPages)].map((_, idx) => (
                            <span key={idx} className={`page-link ${currentPage === idx + 1 ? "active" : ""}`} onClick={() => setCurrentPage(idx + 1)}>
                                {idx + 1}
                            </span>
                        ))}
                        <span className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>&gt;</span>
                    </div>
                )}
            </div>

            {/* 3. Render the modal inside the portal for best results */}
            {showAddModal && selectedPlant && (
                <ModalPortal>
                    <AddPlantModal 
                        plant={selectedPlant} 
                        onClose={handleCloseModal} 
                        navigate={navigate} 
                    />
                </ModalPortal>
            )}
        </div>
    );
};

export default Plantlib;