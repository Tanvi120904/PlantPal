import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SensorContext = createContext();

export function SensorProvider({ children }) {
  const [moisture, setMoisture] = useState(null);
  const [pump, setPump] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const backend =
      typeof process !== "undefined" && process.env.REACT_APP_BACKEND_URL
        ? process.env.REACT_APP_BACKEND_URL
        : "http://localhost:3000";

    const socket = io(backend, { transports: ["websocket"] });

    socket.on("connect", () => {
      setConnected(true);
      console.log("🔗 sensor socket connected", socket.id);
      socket.emit("sensor:getLatest");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("🔌 sensor socket disconnected");
    });

    socket.on("sensor:update", (payload) => {
      if (!payload) return;
      if (typeof payload.moisture !== "undefined") setMoisture(payload.moisture);
      if (typeof payload.pump !== "undefined") setPump(payload.pump);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <SensorContext.Provider value={{ moisture, pump, connected }}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  return useContext(SensorContext);
}
