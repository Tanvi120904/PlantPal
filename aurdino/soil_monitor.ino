#define SENSOR_PIN A0   // Soil Moisture Sensor analog output connected to A0
#define RELAY_PIN 7     // Relay control for water pump

int sensorValue = 0;      // Raw sensor value
int moisturePercent = 0;  // Moisture percentage
int pumpStatus = 0;       // 1 -> pump ON, 0 -> OFF

unsigned long manualOverrideUntil = 0; // ms timestamp until auto is blocked (if manual override used)

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Pump OFF initially (adjust if relay is active LOW)
  Serial.begin(9600);           // Start serial communication
}

void applyPump(int status) {
  pumpStatus = status ? 1 : 0;
  // If your relay is active LOW, invert: digitalWrite(RELAY_PIN, pumpStatus ? LOW : HIGH);
  digitalWrite(RELAY_PIN, pumpStatus ? HIGH : LOW);
}

void loop() {
  // 1) Read moisture
  sensorValue = analogRead(SENSOR_PIN);

  // 2) Convert to percent (calibration: dry ~800, wet ~300)
  moisturePercent = map(sensorValue, 800, 300, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  // 3) Auto decision only when not manual-overridden
  int autoPump = (moisturePercent < 50) ? 1 : 0;
  if (millis() > manualOverrideUntil) {
    applyPump(autoPump);
  }

  // 4) Send JSON to Serial (one line)
  Serial.print("{\"moisture\":");
  Serial.print(moisturePercent);
  Serial.print(",\"pump\":");
  Serial.print(pumpStatus);
  Serial.println("}");

  // 5) Non-blocking read for commands like: PUMP:1\n or PUMP:0\n or MANUAL:1:60000 (manual override 60s)
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();
    if (line.length() > 0) {
      // Handle "PUMP:0" or "PUMP:1"
      if (line.startsWith("PUMP:")) {
        int val = line.substring(5).toInt();
        applyPump(val);
        // Confirm
        Serial.print("{\"ack\":\"pump\",\"pump\":");
        Serial.print(pumpStatus);
        Serial.println("}");
      }
      // Optional: MANUAL override command like MANUAL:1:30000 -> set pump=1 and block auto for 30s
      else if (line.startsWith("MANUAL:")) {
        // MANUAL:<pumpVal>:<durationMs>
        int firstColon = line.indexOf(':');
        int secondColon = line.indexOf(':', firstColon + 1);
        if (firstColon > 0 && secondColon > firstColon) {
          int val = line.substring(firstColon + 1, secondColon).toInt();
          unsigned long duration = (unsigned long) line.substring(secondColon + 1).toInt();
          applyPump(val);
          manualOverrideUntil = millis() + duration;
          Serial.print("{\"ack\":\"manual\",\"pump\":");
          Serial.print(pumpStatus);
          Serial.print(",\"override_ms\":");
          Serial.print(duration);
          Serial.println("}");
        }
      }
    }
  }

  delay(1000); // sample every second
}
