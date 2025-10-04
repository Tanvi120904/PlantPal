// plantpal-backend/models/Device.js
const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    deviceName: { 
        type: String, 
        default: 'New Plant' 
    },
    moistureLevel: {
        type: Number,
        default: 0, 
    },
    manualWaterPending: {
        type: Boolean,
        default: false,
    },
    lastWatered: {
        type: Date,
        default: Date.now,
    },
    plantType: {
        type: String,
        default: null, 
    }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);