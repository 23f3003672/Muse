# IBVAP (Night's Watch) - SIH Demonstration Video Script

**Target Duration:** ~2.5 - 3 Minutes
**Tone:** Professional, Tactical, and Clear
**Objective:** Showcase the simplicity and beauty of the frontend while explaining the powerful backend mechanics that drive it.

---

## 🎬 Introduction (0:00 - 0:15)

**[Visual]**
Fade in to the project logo and title: *Night's Watch — Intelligent Border Video Analytics Platform (IBVAP)*.

**[Voiceover]**
"Welcome to the demonstration of Night's Watch, an edge-compatible AI vision engine designed for real-time border surveillance on standard CCTV infrastructure. Let's walk through the tactical command dashboard."

---

## 1. System Initialization & Landing Page (0:15 - 0:35)

**[Visual]**
Screen recording of the **System Initialization** wizard. The user selects a surveillance mode (e.g., *Alert zone*, *Civilian zone*) for connected cameras and clicks "Save Configuration & Start System".

**[Frontend Functionality]**
Provides a seamless onboarding experience, allowing operators to assign specific threat-level rules to each camera before the dashboard loads.

**[Backend Reaction]**
The frontend sends a payload to the backend's `/api/v1/config/init` endpoint. The FastAPI backend saves this configuration (in PostgreSQL or memory) and immediately pushes these rules to the edge **Vision Engines**. The detection pipeline boots up instantly with the applied rules.

---

## 2. Command Center & KPI Strip (0:35 - 0:50)

**[Visual]**
The dashboard loads, revealing a beautiful dark-mode, glassmorphism UI. The camera pans across the top KPI cards.

**[Frontend Functionality]**
Displays real-time, high-level metrics: API Link Status, Total Detections, Critical Threats, and Pending Reviews. It gives commanders a 5-second overview of the border's security health.

**[Backend Reaction]**
The dashboard continuously polls the `/api/v1/stats` endpoint. The backend aggregates live data from the `ALERTS_DB`, processing the priority breakdown of all events ingested from the edge nodes.

---

## 3. Live Surveillance Wall (0:50 - 1:20)

**[Visual]**
Navigate to the **📹 Live Feeds** tab. The user adjusts the grid layout from `1x1` to `2x2`. Live camera feeds appear with AI-annotated bounding boxes around people and vehicles.

**[Frontend Functionality]**
Renders a zero-latency surveillance wall. It uses native browser rendering for smooth MJPEG streaming without lag, accommodating up to a 10x10 grid of cameras.

**[Backend Reaction]**
The frontend establishes a connection to `/api/v1/stream/{camera_id}`. The backend acts as a conduit, continuously yielding JPEG frames directly from the edge engine's thread-safe buffer. Behind the scenes, the edge node's **3-stage AI pipeline (MOG2 → YOLOv8 → DeepSORT)** has already processed and annotated these frames before streaming them to the web app.

---

## 4. Tactical Map & Alert Queue (1:20 - 1:55)

**[Visual]**
Switch to the **🗺️ Tactical Map** and **🛡️ Alert Queue** tabs. 
- The map shows colored markers (Red for persons, Blue for vehicles).
- The queue shows detailed alert cards. The operator clicks the **"Mark False"** button on an alert.

**[Frontend Functionality]**
- **Map:** Geographically plots incursions on a dark-themed Folium map.
- **Alert Queue:** Displays priority-ranked event cards (Critical down to Low) containing telemetry like speed, heading, ANPR license plates, and a snapshot thumbnail. 

**[Backend Reaction]**
Alerts are fetched from `/api/v1/alerts` and sorted by the backend's priority cognitive engine. When the operator clicks "Mark False", a `POST` request hits `/api/v1/alerts/{id}/feedback`. The backend immediately downgrades the threat priority, and ingeniously saves the alert thumbnail to a `hard_negatives` folder. This creates a localized dataset to retrain the AI and suppress future false alarms.

---

## 5. Dynamic Camera Configuration (1:55 - 2:15)

**[Visual]**
Navigate to the **⚙️ Camera Config** tab. The user changes a camera's mode from *Civilian zone* to *Emergency/sensitive zone* and clicks Save.

**[Frontend Functionality]**
Allows operators to dynamically alter the strictness of a camera's ruleset on the fly without restarting the system.

**[Backend Reaction]**
Hits the `/api/v1/cameras/{id}/zones` endpoint. The backend bypasses standard polling delays and instantly injects the new behavioral rules into the edge `RuleEngine`. From that exact millisecond, all entities on that camera are flagged under maximum security protocols.

---

## 6. AI Reports & GenAI Copilot (2:15 - 2:45)

**[Visual]**
Switch to the **🤖 AI Reports** tab. The user types: *"Summarize incursions on CAM-BOP-01"* and clicks "Generate AI Report". A perfectly formatted text report streams in.

**[Frontend Functionality]**
Provides a natural language chat interface, acting as a tactical assistant so operators don't have to manually sift through hundreds of logs.

**[Backend Reaction]**
The query is sent to `/api/v1/investigate`. The backend converts the query into a vector embedding, performs a semantic similarity search in the **PostgreSQL pgvector** database to find relevant historical alerts, constructs a context-rich prompt (RAG), and routes it to a local **Ollama LLM** (Llama 3). The LLM processes the context and returns a concise, factual incident report back to the frontend.

---

## 🏁 Conclusion (2:45 - 3:00)

**[Visual]**
Fade out to the project logo, team members' names, and the SSB logo.

**[Voiceover]**
"Night's Watch brings software-defined intelligence, semantic compression, and GenAI capabilities to standard edge infrastructure. The Night gathers, and now our watch begins. Thank you."
