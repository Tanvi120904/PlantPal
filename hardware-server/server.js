// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();


// serialport v11+ API
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
const SERIAL_PORT = process.env.SERIAL_PORT || ""; // empty => mock mode
const SERIAL_BAUD = parseInt(process.env.SERIAL_BAUD || "9600", 10);

// In-memory last reading
let lastData = null;
let serialConnected = false;
let port = null;
let parser = null;
let mockInterval = null;

async function startSerial() {
  if (!SERIAL_PORT) {
    console.log("⚠️ No SERIAL_PORT set — starting in MOCK mode (no Arduino).");
    startMockEmitter();
    return;
  }

  try {
    port = new SerialPort({ path: SERIAL_PORT, baudRate: SERIAL_BAUD, autoOpen: false });
    parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    port.open((err) => {
      if (err) {
        console.error("Error opening serial port:", err.message);
        console.log("Falling back to MOCK mode.");
        startMockEmitter();
        return;
      }
      serialConnected = true;
      console.log(`✅ Serial connected on ${SERIAL_PORT} at ${SERIAL_BAUD} baud`);
    });

    parser.on("data", (line) => {
      const trimmed = line.trim();
      try {
        const data = JSON.parse(trimmed);
        lastData = data;
        io.emit("sensor:update", data);
        console.log("📡 Serial -> sensor:update", data);
      } catch (err) {
        console.warn("⚠️ Could not parse serial line:", trimmed);
      }
    });

    port.on("close", () => {
      serialConnected = false;
      console.warn("⚠️ Serial port closed. Switching to mock emitter.");
      startMockEmitter();
    });

    port.on("error", (err) => {
      serialConnected = false;
      console.error("Serial port error:", err.message);
      console.log("Switching to mock emitter.");
      startMockEmitter();
    });
  } catch (err) {
    console.error("Serial initialization error:", err.message);
    startMockEmitter();
  }
}

function startMockEmitter() {
  if (mockInterval) return;
  mockInterval = setInterval(() => {
    // generate synthetic values that vary over time
    const now = Date.now();
    const moisture = Math.round(50 + 30 * Math.sin(now / 15000)); // fluctuates ~20-80
    const pump = moisture < 45 ? 1 : 0;
    const data = { moisture, pump };
    lastData = data;
    io.emit("sensor:update", data);
    console.log("🧪 Mock -> sensor:update", data);
  }, 2000);
}

function stopMockEmitter() {
  if (!mockInterval) return;
  clearInterval(mockInterval);
  mockInterval = null;
}

// Socket.IO
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Immediately send lastData if available
  if (lastData) socket.emit("sensor:update", lastData);

  socket.on("sensor:getLatest", () => {
    if (lastData) socket.emit("sensor:update", lastData);
  });

  // pump:set via socket
  socket.on("pump:set", (payload) => {
    if (!payload || typeof payload.pump === "undefined") return;
    const p = payload.pump ? 1 : 0;
    const cmd = `PUMP:${p}\n`;

    if (serialConnected && port && port.isOpen) {
      port.write(cmd, (err) => {
        if (err) {
          console.error("Error writing to serial:", err.message);
          socket.emit("pump:ack", { success: false, error: err.message });
        } else {
          console.log("💧 Serial write:", cmd.trim());
          socket.emit("pump:ack", { success: true, pump: p });
        }
      });
    } else {
      // If serial not connected, acknowledge but do not write
      console.warn("⚠️ Serial not connected — pump command not sent to Arduino");
      socket.emit("pump:ack", { success: false, error: "Serial not connected" });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// REST endpoints
app.get("/sensor/latest", (req, res) => {
  if (!lastData) return res.status(404).json({ error: "No data yet" });
  return res.json(lastData);
});

app.post("/pump", (req, res) => {
  const p = req.body && typeof req.body.pump !== "undefined" ? (req.body.pump ? 1 : 0) : null;
  if (p === null) return res.status(400).json({ error: "Missing pump value" });
  const cmd = `PUMP:${p}\n`;

  if (serialConnected && port && port.isOpen) {
    port.write(cmd, (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      console.log("💧 Serial write via REST:", cmd.trim());
      return res.json({ success: true, pump: p });
    });
  } else {
    console.warn("⚠️ Serial not connected — pump command via REST not sent");
    return res.status(503).json({ success: false, error: "Serial not connected" });
  }
});

// Start everything
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  // Initialize serial (or mock) after server ready
  startSerial();
});
