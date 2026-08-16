
> **Topological Disaster Supply Rerouting Engine for Extreme Monsoon Inundation & Infrastructure Failure**

---

## 📌 Overview

**D.R.I.V.E.** (*Disaster Rerouting & Intelligent Vehicle Engine*) is a real-time, GIS-integrated emergency logistics engine designed to prevent relief supply chain collapse during severe urban flooding and natural disasters.

During extreme monsoon inundation events, standard navigation systems fail because they rely on static shortest-path algorithms, routing emergency fleets directly into submerged subways and impassable low-elevation corridors. **D.R.I.V.E.** dynamically recalculates safe relief corridors by integrating road elevation telemetry, sensor water levels, crowdsourced field reports, and A* topological graph weighting.

---

## ✨ Key Features

- 🚑 **Emergency Route Dispatcher**: Calculates safe supply routes around submerged roads using weighted A* topological algorithms, providing side-by-side comparisons with standard shortest routes.
- 🌊 **Disaster Flood Simulator**: Live interactive slider and 1-click intensity presets (`0.8m Minor`, `1.8m Monsoon Stage`, `2.5m Severe Flood`, `3.5m Catastrophic Inundation`) to visualize graph edge blockages in real-time.
- 🔄 **Historical Scenario Replay**: Step-by-step disaster timeline controller to simulate flood progression and supply chain rerouting over time.
- ⚠️ **Crowdsourced & Sensor Incident Center**: Real-time field hazard reporting with instant AI confidence scoring, status tracking, and graph edge blockages.
- 🚛 **Logistics Mission Control**: Active fleet dispatch tracking for emergency medicine, food rations, drinking water, and amphibious rescue vehicles.
- 🤖 **AI Command Center & Situation Briefings**: Natural language disaster query parser and automated situational summary briefings.
- 🗺️ **GIS Interactive Map**: Live Leaflet dark-mode canvas displaying road elevation status, flooded corridors, emergency facilities, and active route polyline geometries.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library**: [React 18](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS & [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Mapping & GIS**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons & Data Viz**: [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/), [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Engine**: Python 3.10+, [FastAPI](https://fastapi.tiangolo.com/)
- **Graph & Topology**: [NetworkX](https://networkx.org/), [Shapely](https://shapely.readthedocs.io/), [GeoPandas](https://geopandas.org/)
- **Server**: [Uvicorn](https://www.uvicorn.org/), WebSockets, Pydantic v2

---

## 📁 Repository Structure

```text
DRIVE/
├── frontend/                 # Next.js 14 React Frontend Application
│   ├── app/                  # App Router pages and global CSS
│   ├── components/           # UI Components
│   │   ├── ai/               # AI Briefing & Command components
│   │   ├── analytics/        # Performance Analytics view
│   │   ├── dashboard/        # KPI Cards & AI Command Bar
│   │   ├── incidents/        # Incident Center & Field Report Modal
│   │   ├── layout/           # Header & Navigation Sidebar
│   │   ├── map/              # Leaflet Map Canvas Component
│   │   ├── missions/         # Emergency Fleet Mission Control
│   │   ├── routing/          # Route Planner & Comparison Cards
│   │   ├── simulation/       # Flood Slider & Replay Controller
│   │   └── system/           # System Health & Data Sources
│   ├── lib/                  # Graph Engine, API client, types & seed data
│   └── package.json
│
├── backend/                  # FastAPI Python Graph Engine
│   ├── app/
│   │   ├── ai/               # AI Analysis & Prompting services
│   │   ├── api/              # API Routers & endpoints
│   │   ├── data/             # Spatial road datasets & facility data
│   │   ├── graph/            # NetworkX Graph Engine & A* algorithms
│   │   ├── incidents/        # Incident signal processing engine
│   │   └── models/           # Pydantic schemas & data models
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher (optional for local API backend server)

---

### 1. Frontend Setup & Execution

Navigate to the `frontend` folder, install dependencies, and launch the development server:

```powershell
# Navigate into the frontend directory
cd DRIVE\frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

### 2. Backend Setup & Execution (Optional)

To run the Python FastAPI graph server locally:

```powershell
# Navigate into the backend directory
cd DRIVE\backend

# Install Python requirements
pip install -r requirements.txt

# Launch FastAPI server via uvicorn
python main.py
```

The backend server will run at **`http://localhost:8000`** with interactive API docs available at **`http://localhost:8000/docs`**.

*(Note: The frontend includes built-in fast client-side fallback engines so all interactive features, routing algorithms, simulations, and incident reporting work seamlessly even without running the Python backend).*
