// plantpal-backend/models/Schedule.js
const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    // Link to the user who owns this schedule
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The device/plant this schedule applies to (uses the _id of the Device model)
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    // Schedule details
    plantName: { type: String, required: true }, // Name for easy display
    startTime: { type: String, required: true }, // Time (e.g., "06:30")
    frequency: { type: String, enum: ['daily', 'weekly', 'Once in 2-3 days'], required: true },
    duration: { type: Number, required: true, min: 1 }, // Duration in minutes
    enabled: { type: Boolean, default: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', ScheduleSchema);