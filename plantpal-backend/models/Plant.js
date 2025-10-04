// plantpal-backend/models/Plant.js
const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    careLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    tags: [{ type: String }],
});

module.exports = mongoose.model('Plant', PlantSchema);