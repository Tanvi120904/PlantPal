// plantpal-backend/routes/schedule.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const Device = require('../models/Device'); // Needed to fetch user's plant names

// Middleware to protect all routes in this file
router.use(protect); 

// @route GET /api/schedule
// @desc Get all schedules for the logged-in user
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find({ owner: req.user._id }).populate('deviceId', 'deviceName');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/schedule
// @desc Add or Update a schedule
router.post('/', async (req, res) => {
    const { id, deviceId, plantName, startTime, frequency, duration, enabled } = req.body;

    // Data validation must be added here
    if (!deviceId || !startTime || !duration) {
         return res.status(400).json({ message: "Missing required fields." });
    }
    
    // Check if the device belongs to the current user (security measure)
    const device = await Device.findOne({ _id: deviceId, owner: req.user._id });
    if (!device) {
        return res.status(404).json({ message: "Device not found or not owned by user." });
    }

    try {
        if (id) {
            // Update existing schedule
            const updatedSchedule = await Schedule.findOneAndUpdate(
                { _id: id, owner: req.user._id },
                { deviceId, plantName, startTime, frequency, duration, enabled },
                { new: true }
            );
            return res.json(updatedSchedule);
        } else {
            // Create new schedule
            const newSchedule = new Schedule({
                owner: req.user._id,
                deviceId,
                plantName: device.deviceName, // Use the name from the Device model
                startTime,
                frequency,
                duration,
                enabled: true
            });
            await newSchedule.save();
            // Populate the deviceName for the response
            await newSchedule.populate('deviceId', 'deviceName'); 
            return res.status(201).json(newSchedule);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/schedule/:id
// @desc Delete a schedule
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found or not owned by user." });
        }
        res.json({ message: "Schedule deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;