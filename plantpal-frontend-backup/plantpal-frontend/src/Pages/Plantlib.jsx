import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../Styles/Plantlib.css";


// Plant Data
const plantData = [
  { name: "Monstera Deliciosa", care: "Easy", type: "Foliage", description: "A popular houseplant with unique fenestrated leaves.", imageUrl: "/Monstera.jpeg" },
  { name: "Snake Plant", care: "Easy", type: "Foliage", description: "An exceptionally hardy and low-maintenance plant.", imageUrl: "/snake.jpeg" },
  { name: "Fiddle Leaf Fig", care: "Hard", type: "Foliage", description: "Known for its large, violin-shaped leaves.", imageUrl: "/Fiddle.jpeg" },
  { name: "ZZ Plant", care: "Easy", type: "Foliage", description: "Drought-tolerant and thrives on neglect.", imageUrl: "/zz.jpeg" },
  { name: "Pothos", care: "Easy", type: "Foliage", description: "A versatile vining plant, easy to care for and propagate.", imageUrl: "/pothos.jpeg" },
  { name: "Aloe Vera", care: "Medium", type: "Medicinal", description: "A succulent known for its medicinal properties.", imageUrl: "/aloevera.jpeg" },
  { name: "Peace Lily", care: "Medium", type: "Flowering", description: "Elegant plant with white spathes, known for air-purifying qualities.", imageUrl: "/peacelily.jpeg" },
  { name: "Spider Plant", care: "Easy", type: "Foliage", description: "Easy to grow and produces 'spiderettes' for propagation.", imageUrl: "/spider.jpeg" },
  { name: "Boston Fern", care: "Medium", type: "Foliage", description: "Lush foliage that loves humidity.", imageUrl: "/bostonfern.jpeg" },
  { name: "Calathea", care: "Medium", type: "Foliage", description: "Known for colorful patterned leaves.", imageUrl: "/calathea.jpeg" },
  { name: "Rubber Plant", care: "Easy", type: "Foliage", description: "Attractive indoor plant with glossy leaves.", imageUrl: "/rubberplant.jpeg" },
  { name: "Jade Plant", care: "Easy", type: "Foliage", description: "A popular succulent symbolizing prosperity.", imageUrl: "/jadeplant.jpeg" },
  { name: "Dracaena", care: "Easy", type: "Foliage", description: "Resilient plant with long, sword-like leaves.", imageUrl: "/dracaena.jpeg" },
  { name: "Orchid", care: "Hard", type: "Flowering", description: "Elegant flowering plant with delicate blooms.", imageUrl: "/orchid.jpeg" },
  { name: "Gardenia", care: "Hard", type: "Flowering", description: "Fragrant white flowers with glossy leaves.", imageUrl: "/gardenia.jpeg" },
  { name: "Croton", care: "Medium", type: "Foliage", description: "Brightly colored foliage plant.", imageUrl: "/croton.jpeg" },
  { name: "Hoya", care: "Medium", type: "Flowering", description: "Wax plant, often flowering with star-shaped blooms.", imageUrl: "/hoya.jpeg" },
  { name: "Begonia", care: "Medium", type: "Flowering", description: "Known for vibrant flowers and leaves.", imageUrl: "/Begonia.jpeg" },
  { name: "Lucky Bamboo", care: "Easy", type: "Foliage", description: "Symbolic plant often grown in water.", imageUrl: "/luckbamboo.jpeg" },
  { name: "Anthurium", care: "Hard", type: "Flowering", description: "Glossy leaves with striking red spathes.", imageUrl: "/anthurium.jpeg" },
  { name: "Philodendron", care: "Easy", type: "Foliage", description: "Climbing plant with heart-shaped leaves.", imageUrl: "/philodendron.jpeg" },
  { name: "Monstera Adansonii", care: "Medium", type: "Foliage", description: "Mini Monstera with holey leaves.", imageUrl: "/monsteraadansonii.jpeg" },
  { name: "African Violet", care: "Medium", type: "Flowering", description: "Compact plant with soft, colorful flowers.", imageUrl: "/africanviolet.jpeg" },
  { name: "Kalanchoe", care: "Easy", type: "Flowering", description: "Succulent with clusters of small flowers.", imageUrl: "/kalanchoe.jpeg" },
  { name: "Basil", care: "Easy", type: "Vegetable", description: "Aromatic herb, great for cooking.", imageUrl: "/basil.jpeg" },
  { name: "Bird of Paradise", care: "Hard", type: "Flowering", description: "Tropical plant with exotic flowers.", imageUrl: "/bop.jpeg" },
  { name: "Lavender", care: "Medium", type: "Flowering", description: "Fragrant herb with purple flowers.", imageUrl: "/lavender.jpeg" },
  { name: "Mint", care: "Easy", type: "Medicinal", description: "Refreshing herb, easy to grow indoors.", imageUrl: "/mint.jpeg" },
  { name: "Rosemary", care: "Medium", type: "Medicinal", description: "Fragrant herb, great for kitchen gardening.", imageUrl: "/rosemary.jpeg" },
  { name: "Sage", care: "Easy", type: "Medicinal", description: "Aromatic herb with soft leaves.", imageUrl: "/sage.jpeg" },
  { name: "Spinach", care: "Easy", type: "Vegetable", description: "Leafy green vegetable, nutritious and fast-growing.", imageUrl: "/spinach.jpeg" },
  { name: "Tomato", care: "Medium", type: "Vegetable", description: "Popular fruit-vegetable, requires sunny spot.", imageUrl: "/tomato.jpeg" },
  { name: "Chili Pepper", care: "Medium", type: "Vegetable", description: "Spicy plant, great for home gardens.", imageUrl: "/chili.jpeg" },
  { name: "Okra", care: "Medium", type: "Vegetable", description: "Easy-to-grow vegetable, produces nutritious pods.", imageUrl: "/okra.jpeg" },
  { name: "Cilantro", care: "Easy", type: "Vegetable", description: "Herb with fresh flavor, great for cooking.", imageUrl: "/cilantro.jpeg" },
  { name: "Lemon", care: "Medium", type: "Vegetable", description: "Citrus tree producing fresh lemons, good for pots or garden.", imageUrl: "/lemon.jpeg" },
];

// Modal Component
const AddPlantModal = ({ onClose }) => (
  <div className="add-plant-modal-overlay">
    <div className="add-plant-modal-content">
      <button onClick={onClose} className="add-plant-modal-close-btn">&times;</button>
      <div className="add-plant-modal-header">
        <h3>Add to your Garden</h3>
        <p>Where would you like to add this plant?</p>
      </div>
      <div className="add-plant-modal-options">
        <button className="add-plant-modal-option-btn">Existing Plant</button>
        <button className="add-plant-modal-option-btn wishlist-btn">Wishlist</button>
      </div>
    </div>
  </div>
);

const Plantlib = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [careFilter, setCareFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 12;

  const handleAddClick = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  const handleCareFilter = (care) => {
    setCareFilter(care);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setCareFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  // Filtered plants based on search, care, and type
  const filteredPlants = plantData.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (careFilter ? plant.care === careFilter : true) &&
      (typeFilter ? plant.type === typeFilter : true)
  );

  // Pagination
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  return (
    <div className="plant-lib-container">
      <nav className="navbar-lib">
        <div className="navbar-left">
          <img src="/Main.png" alt="PlantPal Logo" className="logo" />
        </div>
        <ul className="nav-links-lib">
          <li><NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink></li>
          <li><NavLink to="/plantlib" className={({ isActive }) => (isActive ? "active" : "")}>Plant Library</NavLink></li>
          <li><NavLink to="/features" className={({ isActive }) => (isActive ? "active" : "")}>Features</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink></li>
          <li><NavLink to="/urbangrow" className={({ isActive }) => (isActive ? "active" : "")}>UrbanGrow</NavLink></li>
        </ul>
      </nav>

      <div className="main-content-lib">
        <div className="header-lib">
          <h1>Find Your Next Green Friend</h1>
        </div>

        {/* Search + Filters */}
        <div className="filter-and-search-container">
          <input
            type="text"
            placeholder="Filter plants by name..."
            className="search-input-lib"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="filters-wrapper">
            <div className="filter-group">
              <button className="filter-btn" onClick={handleResetFilters}>All</button>
              <button className="filter-btn-easy" onClick={() => handleCareFilter("Easy")}>Easy</button>
              <button className="filter-btn-medium" onClick={() => handleCareFilter("Medium")}>Medium</button>
              <button className="filter-btn-hard" onClick={() => handleCareFilter("Hard")}>Hard</button>
            </div>

            <div className="filter-group">
              <button className="filter-btn" onClick={() => handleTypeFilter("Foliage")}>Foliage</button>
              <button className="filter-btn" onClick={() => handleTypeFilter("Flowering")}>Flowering</button>
              <button className="filter-btn" onClick={() => handleTypeFilter("Medicinal")}>Medicinal</button>
              <button className="filter-btn" onClick={() => handleTypeFilter("Vegetable")}>Vegetable</button>
            </div>
          </div>
        </div>

        {/* Plant Cards */}
        <div className="plant-card-grid">
          {currentPlants.length === 0 ? (
            <p className="no-plants-msg">Currently not in library</p>
          ) : (
            currentPlants.map((plant, index) => (
              <div key={index} className="plant-card">
                <div className="plant-image-container">
                  <img src={plant.imageUrl} alt={plant.name} className="plant-image" />
                  <button className="add-icon" onClick={handleAddClick}> + </button>
                </div>
                <div className="plant-details">
                  <h3 className="plant-name">{plant.name}</h3>
                  <span className={`plant-care plant-care-${plant.care.toLowerCase()}`}>
                    {plant.care} Care
                  </span>
                  <p className="plant-description">{plant.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span
              className="page-link"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              &lt;
            </span>

            {[...Array(totalPages)].map((_, idx) => (
              <span
                key={idx}
                className={`page-link ${currentPage === idx + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </span>
            ))}

            <span
              className="page-link"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              &gt;
            </span>
          </div>
        )}
      </div>

      {showAddModal && <AddPlantModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Plantlib;
