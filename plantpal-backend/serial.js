// serial.js
const { SerialPort, ReadlineParser } = require('serialport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Device = require('./models/Device');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected for serial listener"))
.catch(err => console.error("MongoDB connection error:", err));

// --- Serial Port Setup ---
const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); // Change COM3 if needed
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', async (line) => {
  try {
    const data = JSON.parse(line.trim());

    console.log("📥 Received from Arduino:", data);

    const device = await Device.findOneAndUpdate(
      { deviceId: data.deviceId },
      {
        moistureLevel: data.moisture,
        pumpStatus: data.pump,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (device) {
      console.log(`✅ Updated ${device.deviceName} → ${data.moisture}% moisture`);
    } else {
      console.log("⚠️ No matching device found in MongoDB for deviceId:", data.deviceId);
    }

  } catch (err) {
    console.error("❌ Serial data error:", err.message);
  }
});
