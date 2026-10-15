export const villages = [
  { id: "rampur", name: "Rampur", district: "Nashik", center: [20.006, 73.789] },
  { id: "khed", name: "Khed", district: "Pune", center: [18.846, 73.888] },
  { id: "sonwadi", name: "Sonwadi", district: "Ahmednagar", center: [19.094, 74.741] },
];

const parcelSeeds = [
  ["RV-024", "rampur", 4.8, "Open scrub", "suitable", "Verified", 78, "Agriculture"],
  ["RV-031", "rampur", 2.6, "Fallow field", "assessment", "Pending", 54, "Rainwater harvesting"],
  ["RV-042", "rampur", 6.1, "Grassland", "water", "In review", 71, "Plantation"],
  ["RV-057", "rampur", 1.9, "Mixed vegetation", "constraints", "Pending", 39, "Community facilities"],
  ["RV-063", "rampur", 3.4, "Open scrub", "insufficient", "Unverified", null, null],
  ["RV-079", "rampur", 5.2, "Fallow field", "suitable", "Verified", 84, "Agriculture"],
  ["KD-012", "khed", 2.2, "Open scrub", "suitable", "Verified", 76, "Plantation"],
  ["KD-026", "khed", 4.1, "Fallow field", "assessment", "Pending", 58, "Agriculture"],
  ["KD-038", "khed", 3.7, "Mixed vegetation", "water", "In review", 69, "Rainwater harvesting"],
  ["KD-049", "khed", 1.6, "Open scrub", "insufficient", "Unverified", null, null],
  ["SW-008", "sonwadi", 7.3, "Grassland", "suitable", "Verified", 81, "Agriculture"],
  ["SW-017", "sonwadi", 2.9, "Fallow field", "assessment", "Pending", 51, "Community facilities"],
  ["SW-029", "sonwadi", 4.6, "Mixed vegetation", "constraints", "In review", 43, "Plantation"],
  ["SW-035", "sonwadi", 3.1, "Open scrub", "water", "Verified", 73, "Rainwater harvesting"],
];

export const assessmentLabels = {
  suitable: "Potentially suitable",
  assessment: "Needs assessment",
  water: "Water-related",
  insufficient: "Insufficient data",
  constraints: "Review constraints",
};

const offsets = [
  [-0.004, -0.005],
  [-0.003, 0.002],
  [0.001, -0.004],
  [0.003, 0.003],
  [0.005, -0.001],
  [-0.001, 0.006],
];

export const parcels = parcelSeeds.map(([id, villageId, area, cover, status, verification, score, use], index) => {
  const village = villages.find((item) => item.id === villageId);
  const [latOffset, lngOffset] = offsets[index % offsets.length];
  const villageIndex = villages.findIndex((item) => item.id === villageId);
  const clusterOffset = (villageIndex - 1) * 0.0003;

  return {
    id,
    villageId,
    area,
    cover,
    status,
    statusLabel: assessmentLabels[status],
    verification,
    score,
    suggestedUse: use,
    roadAccess: index % 3 === 1 ? "Moderate · 1.2 km" : "Good · 0.4 km",
    waterProximity: index % 3 === 2 ? "Near · 0.8 km" : "Seasonal · 1.6 km",
    updated: ["2026-10-14", "2026-10-12", "2026-10-09"][index % 3],
    center: [village.center[0] + latOffset + clusterOffset, village.center[1] + lngOffset + clusterOffset],
  };
});

export const recommendations = {
  Agriculture: "Observed open or fallow cover; soil and ownership checks are still required.",
  Plantation: "Vegetation pattern may support tree cover after water and soil validation.",
  "Rainwater harvesting": "Review local drainage and seasonal water flow before planning.",
  "Community facilities": "Consider only after access, ownership, and community consultation.",
};
