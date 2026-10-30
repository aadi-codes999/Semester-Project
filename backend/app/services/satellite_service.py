"""Satellite imagery service for Sentinel-2 MSI processing and NDVI computation."""

from typing import Dict, Tuple


def calculate_ndvi(b8_nir: float, b4_red: float) -> float:
    """Compute Normalized Difference Vegetation Index (NDVI) from Sentinel-2 NIR and Red bands.
    
    Formula: NDVI = (B8 - B4) / (B8 + B4)
    """
    if (b8_nir + b4_red) == 0:
        return 0.0
    ndvi = (b8_nir - b4_red) / (b8_nir + b4_red)
    return round(float(ndvi), 4)


def interpret_vegetation_cover(ndvi: float, summer_ndvi: float = None) -> Tuple[str, str, bool]:
    """Classify land surface and determine if biophysically potentially unused/fallow.
    
    Returns: (land_cover_label, status_category, is_potentially_unused)
    """
    # If summer NDVI is low (< 0.20) and post-monsoon NDVI is moderate (0.20 - 0.32),
    # the land is uncultivated fallow / scrub rather than double-cropped agricultural land.
    if ndvi < 0.05:
        return "Water Body / Wetland", "water", False
    elif ndvi < 0.16:
        return "Barren Wasteland / Stony Scrub", "suitable", True
    elif ndvi < 0.26:
        return "Degraded Scrub / Open Fallow", "suitable", True
    elif ndvi < 0.38:
        return "Seasonal Fallow / Sparse Scrub", "assessment", True
    elif ndvi < 0.52:
        return "Single Crop / Light Canopy", "constraints", False
    else:
        return "Dense Crop / Forest Cover", "constraints", False


def get_sentinel2_tile_service() -> Dict[str, str]:
    """Provide URLs and attribution for real satellite tile layers."""
    return {
        "sentinel2_true_color": {
            "name": "Sentinel-2 Cloudless (Copernicus)",
            "url": "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
            "attribution": "&copy; <a href='https://s2maps.eu'>Sentinel-2 cloudless by EOX IT Services GmbH</a> (Copernicus Sentinel data)",
            "maxZoom": 18,
        },
        "world_imagery": {
            "name": "High-Resolution Satellite Imagery",
            "url": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            "attribution": "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            "maxZoom": 19,
        },
        "bhuvan_wms": {
            "name": "ISRO Bhuvan LULC 50K",
            "url": "https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms",
            "layers": "lulc:BR_LULC50K_1516",
            "attribution": "&copy; <a href='https://bhuvan.nrsc.gov.in'>ISRO / NRSC Bhuvan</a>",
        },
    }
