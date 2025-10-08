// plantpal-backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Device = require('../models/Device');
const Plant = require('../models/Plant'); // ADDED: Import the Plant model
const mongoose = require('mongoose'); // Needed for the logging schema

// ROUTE A: GET User's Devices (React Dashboard Fetch)
router.get('/devices', protect, async (req, res) => {
    try {
        // Fetch devices belonging to the logged-in user
        const devices = await Device.find({ owner: req.user._id });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ROUTE B: POST Sensor Data (Arduino/Hardware Gateway)
router.post('/data', async (req, res) => {
    const { deviceId, moisture, waterAction } = req.body; 
    if (!deviceId || moisture === undefined) {
        return res.status(400).json({ message: 'Missing deviceId or moisture data' });
    }

    try {
        let updateFields = { moistureLevel: moisture, updatedAt: Date.now() };
        if (waterAction === 'watered') {
            updateFields.lastWatered = Date.now();
        }

        const device = await Device.findOneAndUpdate({ deviceId }, updateFields, { new: true });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ROUTE C: Manual Watering Command (React Frontend Trigger)
router.post('/water/:deviceId', protect, async (req, res) => {
    try {
        const device = await Device.findOneAndUpdate(
            { _id: req.params.deviceId, owner: req.user._id },
            { manualWaterPending: true }, // Set flag for Arduino to pick up
            { new: true }
        );
        if (!device) {
            return res.status(404).json({ message: 'Device not found or not owned by user' });
        }
        res.json({ message: 'Manual water command queued', device });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ROUTE D: Arduino Polls for Commands
router.get('/commands/:deviceId', async (req, res) => {
    try {
        const device = await Device.findOne({ deviceId: req.params.deviceId });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        if (device.manualWaterPending) {
            await Device.updateOne({ _id: device._id }, { manualWaterPending: false });
            return res.json({ command: 'WATER_NOW' });
        }
        res.json({ command: 'NONE' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------
// ROUTE E: POST Device Setup (Link Plant to User) - NEW ROUTE
// --------------------------------------------------------
// @route POST /api/dashboard/setup-device
// @desc Links a unique device ID to a plant and the logged-in user.
// @access Private (Requires JWT)
router.post('/setup-device', protect, async (req, res) => {
    const { plantId, deviceName, deviceId } = req.body; 

    if (!plantId || !deviceId) {
        return res.status(400).json({ message: 'Missing plant selection or device ID.' });
    }

    try {
        // Fetch plant details for copying type/name
        const plant = await Plant.findById(plantId);
        
        // Create the new device document
        const newDevice = await Device.create({
            owner: req.user._id,        // The logged-in user's ID (from JWT)
            deviceId: deviceId,         // Unique ID for the Arduino/hardware
            deviceName: deviceName,     // User-friendly name
            plantType: plant ? plant.name : 'Custom Plant', // Copy name from Plant Library
        });

        res.status(201).json({ 
            message: 'Device registered successfully!', 
            device: newDevice 
        });

    } catch (error) {
        // Handles MongoDB Duplicate Key Error (11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This device ID is already registered.' });
        }
        res.status(500).json({ message: 'Internal server error during device setup.' });
    }
});

// --------------------------------------------------------
// ROUTE F: DELETE Device
// --------------------------------------------------------
// @route DELETE /api/dashboard/devices/:id
// @desc Delete a user's device (requires ID from URL params)
// @access Private (Requires JWT)
router.delete('/devices/:id', protect, async (req, res) => {
    try {
        // Attempt to delete the device, ensuring the user owns it
        const device = await Device.findOneAndDelete({ 
            _id: req.params.id, 
            owner: req.user._id // Security check: must own the device
        });

        if (!device) {
            return res.status(404).json({ message: "Device not found or not owned by user." });
        }
        
        res.json({ message: "Device deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------
// ROUTE G: POST Feedback Logging (NEW ROUTE)
// --------------------------------------------------------
// @route POST /api/dashboard/log-feedback
// @desc Log the reason for device deletion (called by frontend modal)
// @access Private (Requires JWT)
router.post('/log-feedback', protect, async (req, res) => {
    const { deviceId, reason, otherReason } = req.body; 

    // Define a simple Mongoose Schema on the fly for logging feedback
    const FeedbackLog = mongoose.models.FeedbackLog || mongoose.model('FeedbackLog', new mongoose.Schema({
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        deletedDeviceId: String,
        deletionReason: String,
        customDetail: String,
        timestamp: { type: Date, default: Date.now }
    }));
    
    try {
        await FeedbackLog.create({
            owner: req.user._id,
            deletedDeviceId: deviceId,
            deletionReason: reason,
            customDetail: otherReason,
        });

        res.status(200).json({ message: "Feedback logged successfully." });

    } catch (error) {
        // Log error but allow the deletion process to continue
        console.error("Failed to save feedback log:", error.message);
        res.status(202).json({ message: "Feedback log failed, but continuing." }); 
    }
});


module.exports = router;