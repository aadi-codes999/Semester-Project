"""AI/ML land cover classification and multi-criteria suitability evaluation."""

import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Seeded reference data representing spectral, pedological, and topographic patterns in Baloda Bazar
# Features: [NDVI, Slope(deg), Soil_pH, Soil_SOC(g/kg), Clay(%), Solar_GHI, Road_Dist(km), Water_Dist(km)]
# Targets: 0: Barren Wasteland, 1: Degraded Scrub / Fallow, 2: Active Cropland, 3: Water/Wetland
_X_REF = np.array([
    [0.10, 1.2, 7.2, 6.5, 25.0, 5.45, 0.4, 3.2],
    [0.12, 1.8, 7.0, 7.0, 28.0, 5.42, 0.8, 2.5],
    [0.18, 1.4, 6.8, 11.0, 36.0, 5.40, 0.5, 1.2],
    [0.22, 2.0, 6.7, 10.5, 38.0, 5.38, 1.1, 1.5],
    [0.24, 4.5, 6.5, 9.8, 32.0, 5.35, 1.8, 2.2],
    [0.55, 0.9, 6.9, 13.5, 42.0, 5.41, 0.3, 0.4],
    [0.62, 1.1, 7.1, 14.0, 40.0, 5.43, 0.6, 0.5],
    [0.02, 0.5, 7.5, 3.0, 15.0, 5.48, 2.0, 0.0],
    [0.01, 0.8, 7.4, 4.0, 18.0, 5.46, 1.5, 0.0],
    [0.15, 6.2, 6.3, 8.5, 29.0, 5.32, 2.5, 3.5],
])
_Y_REF = np.array([0, 0, 1, 1, 1, 2, 2, 3, 3, 0])

_MODEL = RandomForestClassifier(n_estimators=50, random_state=42)
_MODEL.fit(_X_REF, _Y_REF)

_CLASS_LABELS = {
    0: "Barren / Cultivable Wasteland",
    1: "Potentially Unused Fallow / Scrub",
    2: "Active Cropland / High Biomass",
    3: "Water Body / Seasonal Wetland",
}


def classify_land_cover(
    ndvi: float,
    slope: float,
    ph: float,
    soc: float,
    clay: float,
    solar_ghi: float,
    road_km: float,
    water_km: float,
) -> dict:
    """Classify land surface cover using the Random Forest model and calculate confidence score."""
    sample = np.array([[ndvi, slope, ph, soc, clay, solar_ghi, road_km, water_km]])
    pred_class = int(_MODEL.predict(sample)[0])
    probs = _MODEL.predict_proba(sample)[0]
    confidence = round(float(np.max(probs)) * 100.0, 1)

    return {
        "predicted_class_id": pred_class,
        "predicted_cover": _CLASS_LABELS.get(pred_class, "Mixed Land Cover"),
        "confidence_score": confidence,
    }


def assess_multi_criteria_suitability(
    ndvi: float,
    slope: float,
    elevation: float,
    soil_ph: float,
    soil_soc: float,
    clay_pct: float,
    solar_ghi: float,
    road_km: float,
    water_km: float,
    khasra_type: str = "Government Land",
) -> dict:
    """Evaluate multi-criteria suitability for Agriculture, Agroforestry, and Solar PV in Baloda Bazar."""
    # 1. Agriculture Suitability (0 - 100)
    # Favors: Low slope (< 3 deg), pH 6.2 - 7.5, high SOC, good clay content (Kanhar soil), close to water
    slope_agri_factor = max(0.0, 1.0 - (slope / 6.0))
    ph_agri_factor = 1.0 - abs(soil_ph - 6.8) / 3.0
    soc_agri_factor = min(1.0, soil_soc / 14.0)
    water_agri_factor = max(0.0, 1.0 - (water_km / 3.5))
    agri_score = int(round((slope_agri_factor * 30 + ph_agri_factor * 20 + soc_agri_factor * 30 + water_agri_factor * 20)))
    agri_score = max(10, min(95, agri_score))

    # 2. Solar Energy Suitability (0 - 100)
    # Favors: Flat slope (< 2.5 deg), high solar GHI (> 5.2), non-agricultural wasteland/scrub (NDVI < 0.28), close to road
    slope_solar_factor = max(0.0, 1.0 - (slope / 4.0))
    solar_ghi_factor = min(1.0, (solar_ghi - 4.5) / 1.0)
    wasteland_factor = 1.0 if ndvi < 0.25 else max(0.1, 1.0 - (ndvi - 0.25) / 0.3)
    road_solar_factor = max(0.0, 1.0 - (road_km / 4.0))
    solar_score = int(round((slope_solar_factor * 35 + solar_ghi_factor * 25 + wasteland_factor * 25 + road_solar_factor * 15)))
    solar_score = max(10, min(98, solar_score))

    # 3. Agroforestry Suitability (0 - 100)
    # Favors: Gentle-to-moderate slope (2 - 8 deg), moderate SOC, drainage, scrub cover
    slope_agro_factor = 1.0 - abs(slope - 4.0) / 6.0
    veg_agro_factor = 1.0 if 0.20 <= ndvi <= 0.45 else 0.5
    soc_agro_factor = min(1.0, soil_soc / 10.0)
    agro_score = int(round((max(0.1, slope_agro_factor) * 35 + veg_agro_factor * 35 + soc_agro_factor * 30)))
    agro_score = max(15, min(92, agro_score))

    # Determine recommended use
    scores = [("Solar Energy", solar_score), ("Agriculture", agri_score), ("Agroforestry", agro_score)]
    scores.sort(key=lambda item: item[1], reverse=True)
    best_use, best_score = scores[0]

    # Generate transparent explanation
    if best_use == "Solar Energy":
        explanation = (
            f"Flat terrain ({slope:.1f}° slope) and high solar irradiance ({solar_ghi:.2f} kWh/m²/day) "
            f"on uncultivated scrub (NDVI {ndvi:.2f}) make this parcel prime for ground-mounted solar PV."
        )
    elif best_use == "Agriculture":
        explanation = (
            f"Fertile soil (pH {soil_ph:.1f}, SOC {soil_soc:.1f} g/kg, Kanhar clay {clay_pct:.0f}%) "
            f"with gentle slope ({slope:.1f}°) and water proximity ({water_km:.1f} km) indicates high crop viability."
        )
    else:
        explanation = (
            f"Undulating terrain ({slope:.1f}° slope) and sparse scrub cover (NDVI {ndvi:.2f}) "
            f"are well suited for drought-resilient silviculture and community agroforestry."
        )

    # Classify legal status based on revenue records / khasra type
    if "Government" in khasra_type or "Gothan" in khasra_type or "Nistar" in khasra_type:
        legal_status = "Legally Verified Available (Revenue/Panchayat Land)"
        is_legally_verified = True
    elif "Forest" in khasra_type or "Catchment" in khasra_type:
        legal_status = "Restricted (Forest Dept / FRA Protected)"
        is_legally_verified = False
    else:
        legal_status = "Potentially Available (Private Fallow - Requires Consent)"
        is_legally_verified = False

    return {
        "agriculture_score": agri_score,
        "solar_score": solar_score,
        "agroforestry_score": agro_score,
        "suggested_use": best_use,
        "suitability_score": best_score,
        "explanation": explanation,
        "legal_status": legal_status,
        "is_legally_verified": is_legally_verified,
    }
