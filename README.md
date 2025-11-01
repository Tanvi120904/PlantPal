# 🌿 PlantPal — Smart IoT-Based Plant Monitoring & Irrigation System

PlantPal is an intelligent **IoT + MERN Stack** project that automates plant care 🌱.
It monitors soil moisture using sensors and controls water pumps automatically,
while providing a web dashboard for real-time plant health insights.

---

## 🚀 Tech Stack

**Frontend:** React + Vite + Tailwind CSS
**Backend:** Node.js + Express + MongoDB
**AI Integration:** Gemini API (for pest & disease detection)
**IoT Hardware:** Arduino UNO + Soil Moisture Sensor + Relay Module

---

## ⚙️ Features

✨ Real-time soil moisture monitoring
💧 Automated water pump control
🧠 AI-based plant disease & pest detection (via Gemini API)
📊 Interactive dashboard with live data
📱 User-friendly web interface

---

## 🧉 Project Structure

```
/frontend         → React + Vite client  
/backend          → Node.js + Express server  
/arduino          → Arduino UNO code (plantpal.ino)  
```

---

## 🪴 Arduino Setup

The Arduino UNO collects real-time soil moisture data and controls the water pump based on threshold values.

🔗 Full code: [arduino/plantpal.ino](./arduino/plantpal.ino)

---

## 💻 Local Setup Instructions

1. **Clone this repository**

   ```bash
   git clone https://github.com/Tanvi120904/PlantPal.git
   cd PlantPal
   ```

2. **Backend setup**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend setup**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **IoT Integration**

   * Upload the Arduino code from `/arduino/plantpal.ino`
   * Update the serial or MQTT configuration if needed

---

## 🧠 AI (Gemini API) Integration

The backend connects with **Gemini API** to identify possible plant diseases or pests from images.
Users can upload plant leaf photos, and the system returns detection results.

---


## 🛠️ Future Improvements

* ☄️ Weather-based smart irrigation
* 📱 Mobile app for real-time alerts
* 🌍 Multi-plant support dashboard

---

## 👩‍💻 Author

**Tanvi Khicchi**
🎓 B.E. Information Technology | Don Bosco Institute of Technology
🌐 [GitHub](https://github.com/Tanvi120904) · [LinkedIn](https://www.linkedin.com/in/tanvikhicchi/)

---

> Made with ❤️ combining IoT, AI, and Web Tech to keep plants happy 🌱
