# ☀️ Helios-Solar — Smart Energy Monitoring & Prediction

<p align="center">
  <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" width="100%" alt="Solar Energy Banner" />
</p>

<p align="center">
  <b>End-to-end monitoring + forecasting for photovoltaic (PV) systems.</b><br/>
  Real-time sensor telemetry, weather correlation, and ML-driven generation prediction.
</p>

<p align="center">
  <a href="#-system-design">System Design</a> •
  <a href="#-project-summary">Summary</a> •
  <a href="#-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-hardware-architecture-optional">Hardware</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-license">License</a>
</p>

---

## 🧩 System Design

### High-level Architecture

<img width="1024" height="1024" alt="Gemini_Generated_Image_zamxrozamxrozamx" src="https://github.com/user-attachments/assets/46df0531-dd6b-4d03-a016-e8c103a96350" />



### Data Flow

1. **Sensors** measure PV telemetry (V, A, temperature, light, etc.) on a microcontroller.
2. Device publishes readings to an **MQTT broker** (topic-based streaming).
3. **Ingestion service** subscribes to topics, validates payloads, and writes points into **InfluxDB**.
4. **FastAPI** serves aggregated metrics and recent telemetry to the dashboard.
5. **Weather service** pulls OpenWeatherMap signals (cloud cover, UV index, etc.) and stores/correlates them.
6. **Forecasting job** trains/updates a simple model (e.g., linear regression) to predict next-day generation.
7. **Alerting** triggers notifications on fault patterns or efficiency drops.

### Key Design Choices

- **Time-series database (InfluxDB):** fast writes + efficient downsampling and range queries.
- **MQTT:** lightweight, reliable telemetry transport for IoT networks.
- **Stateless API layer:** easy to scale FastAPI horizontally if needed.
- **Jobs as separate services:** ingestion / forecasting / alerting can be deployed independently.

### Reliability & Security (Practical Defaults)

- Use MQTT auth + TLS where possible.
- Validate message schemas server-side (reject missing/invalid fields).
- Store secrets in `.env` / `config.yaml` and never commit them.
- Add basic rate limiting to API endpoints if exposed publicly.

---

## 📋 Project Summary

**Helios-Solar** is an end-to-end monitoring solution designed to maximize the efficiency of photovoltaic (PV) systems.
By integrating **real-time sensor data** with **predictive weather modeling**, the platform provides actionable insights into:

- Energy production trends
- Storage/battery health signals (optional)
- Consumption patterns and anomalies

Whether you are a researcher analyzing panel degradation or a homeowner optimizing grid usage, Helios-Solar makes energy data **transparent and useful**.

---

## ✨ Features

- 📊 **Real-Time Analytics:** Live dashboard for Voltage (V), Current (A), and Power (W)
- ☁️ **Weather Integration:** Correlate solar yield with cloud cover and UV index (OpenWeatherMap)
- 🧠 **ML-Powered Forecasting:** Predict next-day generation using historical data + linear regression
- 🚨 **Smart Alerts:** Discord/Slack notifications for faults or abnormal efficiency drops
- 📱 **Mobile Responsive:** Works across desktop, tablet, and mobile

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| Frontend | React.js, Tailwind CSS |
| Database | InfluxDB (time-series) |
| IoT Connectivity | MQTT, ESP32, Arduino |
| Data/ML | Pandas, NumPy, Scikit-Learn |
| Deployment | Docker, Raspberry Pi |

---

## 🔧 Hardware Architecture (Optional)

If your project includes hardware, this section describes a reference setup:

- **Microcontroller:** ESP32 (Wi‑Fi)
- **Sensors:**
  - INA219 (current/voltage)
  - DHT22 (ambient temperature)
  - LDR (light intensity)
- **Communication:** MQTT protocol to a local broker (or cloud-hosted broker)

---

## 🚀 Getting Started

### 1) Installation

```bash
# Clone the repository
git clone https://github.com/rajkandula/Helios-Solar.git

# Navigate to the project directory
cd Helios-Solar

# Install Python dependencies
pip install -r requirements.txt
```

### 2) Configuration

Create a `config.yaml` or `.env` file (choose one approach and document it in your repo):

```yaml
API_KEY: "your_weather_api_key"
BROKER_URL: "your_mqtt_broker_ip"
DB_TOKEN: "your_influxdb_token"
```

> Tip: Add `config.yaml` / `.env` to `.gitignore`.

### 3) Execution

```bash
# Start the data ingestion service
python src/ingest_data.py

# Launch the dashboard
npm start
```

---

## 📈 Roadmap

- [ ] **Dual-Axis Support:** Control logic for motorized solar trackers
- [ ] **Battery Management:** SOC (State of Charge) monitoring for Li-ion storage
- [ ] **Native App:** Flutter app for iOS/Android
- [ ] **API Access:** Public endpoints for third-party integrations

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m "Add AmazingFeature"`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Project Lead

**Raj Kandula**
