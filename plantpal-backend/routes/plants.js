// plantpal-backend/routes/plants.js
const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// @route GET /api/plants
router.get('/', async (req, res) => {
    try {
        const { careLevel, tag, search } = req.query;
        let filter = {};

        if (careLevel) filter.careLevel = careLevel;
        if (tag) filter.tags = { $in: [tag] }; 
        if (search) filter.name = { $regex: search, $options: 'i' };

        const plants = await Plant.find(filter);
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/plants (Used to populate initial data in Compass/Postman)
router.post('/', async (req, res) => {
    try {
        const plant = await Plant.create(req.body);
        res.status(201).json(plant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;