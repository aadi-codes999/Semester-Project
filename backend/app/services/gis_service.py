"""GIS operations, spatial layer generation, and GeoJSON export for Baloda Bazar."""

from typing import Dict, List
from app.services.satellite_service import get_sentinel2_tile_service


def build_parcels_geojson(parcels: List[dict]) -> dict:
    """Transform parcel records into standard GeoJSON FeatureCollection for Leaflet / GIS mapping."""
    features = []
    for parcel in parcels:
        lat, lon = parcel["center"]
        # Approximate cadastral boundary polygon centered at coordinate
        size = 0.0018 + (parcel["area"] / 100.0) * 0.0012
        polygon_coords = [
            [
                [round(lon - size, 5), round(lat - size * 0.8, 5)],
                [round(lon + size, 5), round(lat - size * 0.7, 5)],
                [round(lon + size * 0.8, 5), round(lat + size, 5)],
                [round(lon - size * 0.9, 5), round(lat + size * 0.9, 5)],
                [round(lon - size, 5), round(lat - size * 0.8, 5)],
            ]
        ]

        feature = {
            "type": "Feature",
            "id": parcel["id"],
            "geometry": {
                "type": "Polygon",
                "coordinates": polygon_coords,
            },
            "properties": {
                "id": parcel["id"],
                "villageId": parcel["villageId"],
                "villageName": parcel.get("villageName"),
                "tehsil": parcel.get("tehsil"),
                "khasraNo": parcel.get("khasraNo"),
                "khasraType": parcel.get("khasraType"),
                "area": parcel["area"],
                "cover": parcel["cover"],
                "predictedCover": parcel.get("predictedCover"),
                "status": parcel["status"],
                "statusLabel": parcel["statusLabel"],
                "verification": parcel["verification"],
                "legalStatus": parcel.get("legalStatus"),
                "isLegallyVerified": parcel.get("isLegallyVerified", False),
                "score": parcel["score"],
                "suggestedUse": parcel["suggestedUse"],
                "explanation": parcel.get("explanation"),
                "ndvi": parcel.get("ndvi"),
                "slopeDeg": parcel.get("slopeDeg"),
                "elevationM": parcel.get("elevationM"),
                "solarGHI": parcel.get("solarGHI"),
                "soilPH": parcel.get("soilPH"),
                "soilType": parcel.get("soilType"),
                "soilOrganicCarbon": parcel.get("soilOrganicCarbon"),
                "confidenceScore": parcel.get("confidenceScore"),
                "solarScore": parcel.get("solarScore"),
                "agricultureScore": parcel.get("agricultureScore"),
                "agroforestryScore": parcel.get("agroforestryScore"),
                "roadAccess": parcel.get("roadAccess"),
                "waterProximity": parcel.get("waterProximity"),
                "updated": parcel.get("updated"),
                "center": parcel["center"],
            },
        }
        features.append(feature)

    return {
        "type": "FeatureCollection",
        "district": "Baloda Bazar",
        "state": "Chhattisgarh",
        "features": features,
    }


def build_villages_geojson(villages: List[dict]) -> dict:
    """Transform village metadata into GeoJSON FeatureCollection."""
    features = []
    for village in villages:
        lat, lon = village["center"]
        radius = 0.025  # ~2.7 km bounding radius
        coords = [
            [
                [round(lon - radius, 5), round(lat - radius, 5)],
                [round(lon + radius, 5), round(lat - radius, 5)],
                [round(lon + radius, 5), round(lat + radius, 5)],
                [round(lon - radius, 5), round(lat + radius, 5)],
                [round(lon - radius, 5), round(lat - radius, 5)],
            ]
        ]
        features.append({
            "type": "Feature",
            "id": village["id"],
            "geometry": {
                "type": "Polygon",
                "coordinates": coords,
            },
            "properties": {
                "id": village["id"],
                "name": village["name"],
                "district": village["district"],
                "state": village.get("state", "Chhattisgarh"),
                "tehsil": village.get("tehsil"),
                "lgdCode": village.get("lgdCode"),
                "center": village["center"],
                "area_sq_km": village.get("area_sq_km"),
                "total_khasras": village.get("total_khasras"),
            },
        })

    return {
        "type": "FeatureCollection",
        "district": "Baloda Bazar",
        "features": features,
    }


def get_available_gis_layers() -> Dict:
    """Return catalog of interactive map tile and vector layers."""
    return {
        "tiles": get_sentinel2_tile_service(),
        "vectors": {
            "village_boundaries": {
                "name": "Survey of India Village Boundaries",
                "endpoint": "/api/gis/villages/geojson",
                "color": "#3b82f6",
            },
            "cadastral_parcels": {
                "name": "Chhattisgarh BhuNaksha Cadastral Parcels",
                "endpoint": "/api/gis/parcels/geojson",
                "color": "#10b981",
            },
        },
    }
