const express = require('express');
const router = express.Router();
// ✅ This is the corrected import statement
const protect = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const Device = require('../models/Device');

// This middleware protects all routes in this file
router.use(protect);

// @route   GET /api/schedule
// @desc    Get all schedules for the logged-in user
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find({ owner: req.user._id }).populate('deviceId', 'deviceName');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/schedule
// @desc    Add or Update a watering schedule
router.post('/', async (req, res) => {
    const { id, deviceId, startTime, frequency, duration, enabled } = req.body;

    if (!deviceId || !startTime || !frequency || !duration) {
         return res.status(400).json({ message: "Missing required fields." });
    }
    
    try {
        const device = await Device.findOne({ _id: deviceId, user: req.user._id });
        if (!device) {
            return res.status(404).json({ message: "Device not found or you do not have permission to access it." });
        }

        if (id) {
            // Update existing schedule
            const updatedSchedule = await Schedule.findOneAndUpdate(
                { _id: id, owner: req.user._id },
                { 
                    deviceId, 
                    plantName: device.deviceName,
                    startTime, 
                    frequency, 
                    duration, 
                    enabled 
                },
                { new: true }
            ).populate('deviceId', 'deviceName');
            
            if (!updatedSchedule) {
                return res.status(404).json({ message: "Schedule not found." });
            }
            return res.json(updatedSchedule);

        } else {
            // Create new schedule
            const newSchedule = new Schedule({
                owner: req.user._id,
                deviceId,
                plantName: device.deviceName,
                startTime,
                frequency,
                duration,
                enabled
            });
            await newSchedule.save();
            await newSchedule.populate('deviceId', 'deviceName'); 
            return res.status(201).json(newSchedule);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while processing schedule." });
    }
});

// @route   DELETE /api/schedule/:id
// @desc    Delete a schedule
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found or you do not have permission to delete it." });
        }
        
        res.json({ message: "Schedule deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;