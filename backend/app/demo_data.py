VILLAGES = [
    {"id": "rampur", "name": "Rampur", "district": "Nashik", "center": [20.006, 73.789]},
    {"id": "khed", "name": "Khed", "district": "Pune", "center": [18.846, 73.888]},
    {"id": "sonwadi", "name": "Sonwadi", "district": "Ahmednagar", "center": [19.094, 74.741]},
]

ASSESSMENT_LABELS = {
    "suitable": "Potentially suitable",
    "assessment": "Needs assessment",
    "water": "Water-related",
    "insufficient": "Insufficient data",
    "constraints": "Review constraints",
}

PARCEL_SEEDS = [
    ["RV-024", "rampur", 4.8, "Open scrub", "suitable", "Verified", 78, "Agriculture"],
    ["RV-031", "rampur", 2.6, "Fallow field", "assessment", "Pending", 54, "Rainwater harvesting"],
    ["RV-042", "rampur", 6.1, "Grassland", "water", "In review", 71, "Plantation"],
    ["RV-057", "rampur", 1.9, "Mixed vegetation", "constraints", "Pending", 39, "Community facilities"],
    ["RV-063", "rampur", 3.4, "Open scrub", "insufficient", "Unverified", None, None],
    ["RV-079", "rampur", 5.2, "Fallow field", "suitable", "Verified", 84, "Agriculture"],
    ["KD-012", "khed", 2.2, "Open scrub", "suitable", "Verified", 76, "Plantation"],
    ["KD-026", "khed", 4.1, "Fallow field", "assessment", "Pending", 58, "Agriculture"],
    ["KD-038", "khed", 3.7, "Mixed vegetation", "water", "In review", 69, "Rainwater harvesting"],
    ["KD-049", "khed", 1.6, "Open scrub", "insufficient", "Unverified", None, None],
    ["SW-008", "sonwadi", 7.3, "Grassland", "suitable", "Verified", 81, "Agriculture"],
    ["SW-017", "sonwadi", 2.9, "Fallow field", "assessment", "Pending", 51, "Community facilities"],
    ["SW-029", "sonwadi", 4.6, "Mixed vegetation", "constraints", "In review", 43, "Plantation"],
    ["SW-035", "sonwadi", 3.1, "Open scrub", "water", "Verified", 73, "Rainwater harvesting"],
]

_OFFSETS = [
    [-0.004, -0.005],
    [-0.003, 0.002],
    [0.001, -0.004],
    [0.003, 0.003],
    [0.005, -0.001],
    [-0.001, 0.006],
]

PARCELS = []
for index, data in enumerate(PARCEL_SEEDS):
    parcel_id, village_id, area, cover, status, verification, score, suggested_use = data
    village = next(item for item in VILLAGES if item["id"] == village_id)
    village_index = VILLAGES.index(village)
    lat_offset, lng_offset = _OFFSETS[index % len(_OFFSETS)]
    cluster_offset = (village_index - 1) * 0.0003
    PARCELS.append(
        {
            "id": parcel_id,
            "villageId": village_id,
            "area": area,
            "cover": cover,
            "status": status,
            "statusLabel": ASSESSMENT_LABELS[status],
            "verification": verification,
            "score": score,
            "suggestedUse": suggested_use,
            "roadAccess": "Moderate · 1.2 km" if index % 3 == 1 else "Good · 0.4 km",
            "waterProximity": "Near · 0.8 km" if index % 3 == 2 else "Seasonal · 1.6 km",
            "updated": ["2026-10-14", "2026-10-12", "2026-10-09"][index % 3],
            "center": [
                village["center"][0] + lat_offset + cluster_offset,
                village["center"][1] + lng_offset + cluster_offset,
            ],
        }
    )

RECOMMENDATION_TEXT = {
    "Agriculture": "Observed open or fallow cover; soil and ownership checks are still required.",
    "Plantation": "Vegetation pattern may support tree cover after water and soil validation.",
    "Rainwater harvesting": "Review local drainage and seasonal water flow before planning.",
    "Community facilities": "Consider only after access, ownership, and community consultation.",
}

REPORTS = [
    {
        "id": "report-001",
        "title": "Village land suitability snapshot",
        "type": "Summary report",
        "generatedAt": "2026-10-14",
        "status": "Ready",
        "summary": "Preliminary land suitability review for the current village portfolio.",
    },
    {
        "id": "report-002",
        "title": "Water access and drainage review",
        "type": "Environmental review",
        "generatedAt": "2026-10-12",
        "status": "Draft",
        "summary": "Seasonal water patterns and drainage suitability for candidate parcels.",
    },
]


def get_dashboard_stats(village_id=None):
    parcels = get_parcels(village_id=village_id)
    total = len(parcels)
    potentially_unused = sum(1 for parcel in parcels if parcel["status"] == "suitable")
    flagged_for_assessment = sum(1 for parcel in parcels if parcel["status"] in {"assessment", "constraints"})
    assessed = sum(1 for parcel in parcels if parcel["verification"] == "Verified")
    return {
        "totalParcels": total,
        "potentiallyUnused": potentially_unused,
        "flaggedForAssessment": flagged_for_assessment,
        "assessedParcels": assessed,
    }


def get_villages():
    return VILLAGES


def get_parcels(village_id=None, status=None):
    parcels = PARCELS
    if village_id:
        parcels = [parcel for parcel in parcels if parcel["villageId"] == village_id]
    if status:
        parcels = [parcel for parcel in parcels if parcel["status"] == status]
    return parcels


def get_parcel(parcel_id):
    for parcel in PARCELS:
        if parcel["id"] == parcel_id:
            return parcel
    return None


def get_assessments():
    return [
        {
            "parcelId": parcel["id"],
            "villageId": parcel["villageId"],
            "status": parcel["status"],
            "statusLabel": parcel["statusLabel"],
            "verification": parcel["verification"],
            "score": parcel["score"],
            "updated": parcel["updated"],
        }
        for parcel in PARCELS
    ]


def get_assessment(parcel_id):
    parcel = get_parcel(parcel_id)
    if parcel is None:
        return None
    return {
        "parcelId": parcel["id"],
        "villageId": parcel["villageId"],
        "status": parcel["status"],
        "statusLabel": parcel["statusLabel"],
        "verification": parcel["verification"],
        "score": parcel["score"],
        "updated": parcel["updated"],
    }


def get_recommendations():
    return [
        {
            "id": f"recommendation-{index + 1}",
            "parcelId": parcel["id"],
            "title": parcel["suggestedUse"],
            "category": parcel["suggestedUse"],
            "summary": RECOMMENDATION_TEXT.get(parcel["suggestedUse"], "Assess the parcel using local field checks."),
            "priority": "Medium" if parcel["status"] != "suitable" else "High",
        }
        for index, parcel in enumerate(PARCELS)
    ]


def get_parcel_recommendations(parcel_id):
    parcel = get_parcel(parcel_id)
    if parcel is None:
        return None
    return {
        "parcelId": parcel["id"],
        "title": parcel["suggestedUse"],
        "category": parcel["suggestedUse"],
        "summary": RECOMMENDATION_TEXT.get(parcel["suggestedUse"], "Assess the parcel using local field checks."),
        "priority": "Medium" if parcel["status"] != "suitable" else "High",
    }


def get_reports():
    return REPORTS
