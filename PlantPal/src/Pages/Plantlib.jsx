import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import axios from 'axios';
import API_URL from '../config/api'; 
import apiAuth from "../utils/apiAuth"; 
import DeviceSetupForm from "../Components/DeviceSetupForm"; // Must exist in src/Components
import "../Styles/Plantlib.css";
import AppHeader from "../Components/AppHeader.jsx";

// --- 1. ADD PLANT MODAL COMPONENT (Handles Setup Flow) ---
// Note: This assumes DeviceSetupForm is fully functional and uses onSuccess prop
const AddPlantModal = ({ plant, onClose, navigate }) => {
    
    // Function to handle the successful registration and redirect (passed to form)
    const handleSetupSuccess = () => {
        onClose(); // Close the modal
        navigate('/dashboard'); // Navigate to dashboard after successful registration
    };

    return (
        <div className="add-plant-modal-overlay" onClick={onClose}>
            <div className="add-plant-modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="add-plant-modal-close-btn">&times;</button>
                
                {/* Directly render the Device Setup Form */}
                <DeviceSetupForm 
                    plantId={plant._id} 
                    plantName={plant.name}
                    onSuccess={handleSetupSuccess} // Handler that closes and navigates
                    onClose={onClose}
                />
            </div>
        </div>
    );
};


// --- 2. MAIN PLANT LIBRARY COMPONENT ---
const Plantlib = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlant, setSelectedPlant] = useState(null); 
    
    const navigate = useNavigate(); // Initialize navigation hook

    // Filter and Pagination states
    const [searchTerm, setSearchTerm] = useState("");
    const [careFilter, setCareFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1);
    const plantsPerPage = 12;

    const [showAddModal, setShowAddModal] = useState(false);
    
    // Handles click on the '+' icon
    const handleAddClick = (plant) => { 
        // Security Check: Must be logged in to access device setup
        if (!localStorage.getItem('userToken')) {
            alert("Please log in first to add a device to your garden.");
            navigate('/home'); 
            return;
        }
        setSelectedPlant(plant); 
        setShowAddModal(true);
    };
    
    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedPlant(null); // Clear selected plant on close
    };


    // --- API FETCH LOGIC ---
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
            setLoading(false);
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError("Failed to load plants. Check the Node.js server and network connection.");
            setLoading(false);
        }
    }, [careFilter, typeFilter, searchTerm]); 

    useEffect(() => {
        fetchPlants();
        setCurrentPage(1); 
    }, [fetchPlants]); 


    // --- FILTER/PAGINATION HANDLERS ---
    const handleCareFilter = (care) => { setCareFilter(care === careFilter ? '' : care); };
    const handleTypeFilter = (type) => { setTypeFilter(type === typeFilter ? '' : type); };
    const handleResetFilters = () => { setCareFilter(""); setTypeFilter(""); setSearchTerm(""); };
    
    const indexOfLastPlant = currentPage * plantsPerPage;
    const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
    const currentPlants = plants.slice(indexOfFirstPlant, indexOfLastPlant); 
    const totalPages = Math.ceil(plants.length / plantsPerPage);

    return (
        <div className="plant-lib-container">
<AppHeader 
    // These alert/navigate functions are temporary placeholders 
    // since Plantlib doesn't control the modals directly.
    onLoginClick={() => navigate('/home')} 
    onSignupClick={() => navigate('/home')}
/>

            <div className="main-content-lib">
                <div className="header-lib"><h1>Find Your Next Green Friend</h1></div>
                <div className="filter-and-search-container">
                     {/* --- Search and Filter buttons UI --- */}
                     <input type="text" placeholder="Filter plants by name..." className="search-input-lib" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="filters-wrapper">
                        {/* Filter Group 1: Care Level */}
                        <div className="filter-group">
                            <button className="filter-btn" onClick={handleResetFilters}>All</button>
                            <button className={`filter-btn-easy ${careFilter === 'Easy' ? 'active-filter' : ''}`} onClick={() => handleCareFilter("Easy")}>Easy</button>
                            <button className={`filter-btn-medium ${careFilter === 'Medium' ? 'active-filter' : ''}`} onClick={() => handleCareFilter("Medium")}>Medium</button>
                            <button className={`filter-btn-hard ${careFilter === 'Hard' ? 'active-filter' : ''}`} onClick={() => handleCareFilter("Hard")}>Hard</button>
                        </div>
                        {/* Filter Group 2: Type */}
                        <div className="filter-group">
                            <button className={`filter-btn ${typeFilter === 'Foliage' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Foliage")}>Foliage</button>
                            <button className={`filter-btn ${typeFilter === 'Flowering' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Flowering")}>Flowering</button>
                            <button className={`filter-btn ${typeFilter === 'Medicinal' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Medicinal")}>Medicinal</button>
                            <button className={`filter-btn ${typeFilter === 'Vegetable' ? 'active-filter' : ''}`} onClick={() => handleTypeFilter("Vegetable")}>Vegetable</button>
                        </div>
                    </div>
                </div>

                {/* Loading and Error States */}
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
                                        {/* CRITICAL: Passes the plant data to start setup */}
                                        <button className="add-icon" onClick={() => handleAddClick(plant)}> + </button>
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
                
                {/* Pagination */}
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

            {/* CRITICAL: Modal rendering block */}
            {showAddModal && selectedPlant && (
                <AddPlantModal 
                    plant={selectedPlant} 
                    onClose={handleCloseModal} 
                    navigate={navigate} 
                />
            )}
        </div>
    );
};

export default Plantlib;