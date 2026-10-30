# GIS Village Land Intelligence – Baloda Bazar District, Chhattisgarh

A GIS-based spatial intelligence application for identifying, assessing, and utilizing potentially unused land across **Baloda Bazar-Bhatapara District (Census/DILRMP Code 674), Chhattisgarh, India**.

## Authoritative Geospatial Data Sources

| Source | Domain | Baloda Bazar Integration & Role | Authentication / Access |
|---|---|---|---|
| **Survey of India (SoI)** | Administrative Boundaries | LGD 674 Tehsils & Village polygon boundaries | Open Government Portal / Token |
| **Sentinel-2 (Copernicus)** | Optical Remote Sensing | Real-time NDVI calculation `(B8 - B4)/(B8 + B4)` for fallow/wasteland detection | Copernicus CDSE OAuth2 / WMS |
| **ISRO Bhuvan** | Land Use / Land Cover & Wasteland | 50K Thematic LULC & Wasteland WMS layer | Open OGC WMS |
| **Bhuvan Panchayat** | Cadastral & Village Assets | Gram Panchayat Gothan, pasture, and commons layers | MoPR / NIC Institutional Access |
| **ISRIC SoilGrids** | Pedology & Soil Properties | REST API queries for pH, SOC, Kanhar/Dorsa clay % | Public Open REST API (`rest.isric.org`) |
| **Chhattisgarh BhuNaksha** | Cadastral Maps & Land Records | Khasra numbers, recorded tenure, DILRMP 674 reconciliation | Public State Revenue Query |
| **Copernicus DEM (GLO-30)** | Elevation & Topography | 30m Digital Elevation Model for slope, aspect, and solar GHI | Public Global 30m DEM |

---

## AI/ML Classification & Multi-Criteria Decision Analysis

The system integrates a **Random Forest ML model** and multi-criteria evaluation to classify land-cover patterns and rank candidate areas:
1. **Solar Energy PV Suitability**: Evaluates flat terrain (slope < 2.5°), high solar irradiance (GHI > 5.2 kWh/m²/day), non-agricultural wasteland status (NDVI < 0.28), and road access.
2. **Crop Agriculture Suitability**: Evaluates fertile Kanhar/Dorsa black soil (pH 6.5–7.2, high SOC > 10 g/kg), gentle slope (< 3°), and river/canal proximity.
3. **Agroforestry Suitability**: Evaluates undulating topography (slope 2.5°–8°), medium soil depth, and native scrub cover for drought-hardy silviculture.
4. **Legal Availability Distinction**: Explicitly distinguishes **"Potentially Unused Land"** (biophysically idle scrub/fallow identified by satellite) from **"Legally Verified Available Land"** (Government Nazul/Gothan commons verified via BhuNaksha).

---

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

- Accessible at: `http://localhost:5173/dashboard`
- Features interactive Leaflet map with **OpenStreetMap** and **Copernicus / Sentinel-2 High-Resolution Satellite Basemaps**.
- Toggleable **Survey of India Village Boundaries**, **BhuNaksha Cadastral Parcels**, and **Sentinel-2 NDVI Vegetation Heatmaps**.

---

## Backend & Database Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

Configure `backend/.env`:
```env
SECRET_KEY=your-secret-key
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=gis_village
```

### Dataset Import & Reset Workflows
To re-seed or refresh the entire Baloda Bazar district dataset in MongoDB:
```powershell
python scripts/seed_mongo.py --reset
```

To import custom GeoJSON / Shapefile datasets:
```http
POST /api/gis/import?name=custom_boundaries
Content-Type: application/json
```
