"""Dataset download, import, and authentication management workflows for Baloda Bazar GIS."""

import json
from pathlib import Path

DATA_RAW_DIR = Path(__file__).resolve().parents[2] / "data" / "raw"
DATA_PROCESSED_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"
DATA_RAW_DIR.mkdir(parents=True, exist_ok=True)
DATA_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

DATASET_CATALOG = [
    {
        "id": "soi_village_boundaries",
        "name": "Survey of India (SoI) Village Boundaries",
        "category": "Administrative Boundaries",
        "official_url": "https://surveyofindia.gov.in/pages/village-boundary-data-base-of-entire-india",
        "district_scope": "Baloda Bazar (Census/LGD 674, Chhattisgarh)",
        "auth_required": True,
        "auth_type": "Government Portal Registration / Open Data API Token",
        "status": "Integrated (LGD 674 Village Hierarchy & GeoJSON)",
        "import_instructions": (
            "1. Register on Survey of India portal (surveyofindia.gov.in).\n"
            "2. Download Chhattisgarh District 674 (Baloda Bazar) Village Boundary shapefile/GeoJSON.\n"
            "3. Place file in 'backend/data/raw/soi_boundaries.geojson' or use the Import API."
        ),
    },
    {
        "id": "sentinel2_copernicus",
        "name": "Sentinel-2 MSI Satellite Imagery & NDVI",
        "category": "Optical Remote Sensing",
        "official_url": "https://browser.dataspace.copernicus.eu/",
        "district_scope": "Baloda Bazar (Tiles 44QND, 44QPD)",
        "auth_required": True,
        "auth_type": "Copernicus Data Space Ecosystem (CDSE) OAuth2 / WMS",
        "status": "Active (Real-time NDVI Computation + Sentinel-2 Tile Layer)",
        "import_instructions": (
            "1. Obtain free CDSE credentials at dataspace.copernicus.eu.\n"
            "2. Configure CDSE_CLIENT_ID / CDSE_CLIENT_SECRET in backend/.env for automated S2 imagery fetching.\n"
            "3. Or upload GeoTIFF / B4+B8 NIR-RED rasters to 'backend/data/raw/satellite/'."
        ),
    },
    {
        "id": "bhuvan_lulc_50k",
        "name": "ISRO NRSC Bhuvan LULC & Wasteland 50k",
        "category": "Land Use / Land Cover",
        "official_url": "https://bhuvan-app1.nrsc.gov.in/2dresources/bhuvanstore2.php",
        "district_scope": "Baloda Bazar District, Chhattisgarh",
        "auth_required": False,
        "auth_type": "Public Open OGC WMS & Open Data",
        "status": "Active (Bhuvan WMS Service & 50K Classification)",
        "import_instructions": (
            "1. Visit ISRO Bhuvan Store (bhuvan-app1.nrsc.gov.in).\n"
            "2. Download Land Use / Land Cover 50K and Wasteland thematic shapefiles for Chhattisgarh.\n"
            "3. Upload via the Import API or copy into 'backend/data/raw/bhuvan/'."
        ),
    },
    {
        "id": "bhuvan_panchayat",
        "name": "Bhuvan Panchayat Village Asset Data",
        "category": "Cadastral & Village Assets",
        "official_url": "https://bhuvanpanchayat.nrsc.gov.in/",
        "district_scope": "Gram Panchayats of Baloda Bazar",
        "auth_required": True,
        "auth_type": "Panchayat / MoPR Institutional Access",
        "status": "Active (Panchayat Gothan & Asset Layers Integrated)",
        "import_instructions": (
            "1. Access bhuvanpanchayat.nrsc.gov.in using rural development credentials.\n"
            "2. Export Gram Panchayat asset and commons layers for Baloda Bazar tehsils."
        ),
    },
    {
        "id": "soilgrids_isric",
        "name": "ISRIC SoilGrids 250m Global Soil Data",
        "category": "Pedology & Soil Properties",
        "official_url": "https://www.isric.org/explore/soilgrids",
        "district_scope": "Baloda Bazar District (pH, SOC, Clay, Sand)",
        "auth_required": False,
        "auth_type": "Public Open REST API & WCS",
        "status": "Live Connected (Real-time REST API queries via rest.isric.org)",
        "import_instructions": "Live API is enabled by default. Offline caching is stored in 'backend/data/processed/soil_cache.json'.",
    },
    {
        "id": "chhattisgarh_bhunaksha",
        "name": "Chhattisgarh BhuNaksha & DILRMP Land Records",
        "category": "Cadastral & Revenue Records",
        "official_url": "http://cg.nic.in/bhunaksha/",
        "district_scope": "District 674 (Baloda Bazar-Bhatapara, DILRMP 674)",
        "dilrmp_url": "https://dilrmp.gov.in/dilrmpold/MapULPIN/tehsil-level/674",
        "auth_required": False,
        "auth_type": "State Revenue Portal Public Cadastral Query",
        "status": "Active (Khasra Parcel IDs, ULPIN Status, Legal Availability)",
        "import_instructions": (
            "1. Query Khasra map sheets on cg.nic.in/bhunaksha.\n"
            "2. Verify ULPIN cadastral status on dilrmp.gov.in/dilrmpold/MapULPIN/tehsil-level/674.\n"
            "3. Import CSV/GeoJSON cadastral exports to reconcile government vs private ownership."
        ),
    },
    {
        "id": "copernicus_dem",
        "name": "Copernicus GLO-30 Digital Elevation Model",
        "category": "Elevation & Terrain",
        "official_url": "https://dataspace.copernicus.eu/",
        "district_scope": "Baloda Bazar District Elevation & Slope",
        "auth_required": False,
        "auth_type": "Public 30m Global DEM",
        "status": "Active (Elevation, Slope in degrees & Solar Potential Modeling)",
        "import_instructions": "GLO-30 regional elevation and slope model is integrated directly into terrain service.",
    },
]


def get_dataset_status_catalog() -> list:
    """Return all 7 geospatial datasets, their connectivity, and documentation."""
    return DATASET_CATALOG


def import_custom_geojson(geojson_data: dict, dataset_name: str = "custom_import") -> dict:
    """Parse and ingest imported GeoJSON into the raw/processed repository."""
    features = geojson_data.get("features", [])
    if not features:
        return {"status": "error", "message": "No GeoJSON features found in provided payload."}

    dest_file = DATA_RAW_DIR / f"{dataset_name}.geojson"
    with open(dest_file, "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, indent=2)

    return {
        "status": "success",
        "message": f"Successfully imported {len(features)} spatial features into {dest_file.name}",
        "feature_count": len(features),
        "dataset_name": dataset_name,
    }
