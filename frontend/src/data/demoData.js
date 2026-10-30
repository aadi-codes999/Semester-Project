export const villages = [
  { id: "baloda_bazar_hq", name: "Baloda Bazar", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Baloda Bazar", center: [21.6582, 82.1608] },
  { id: "bhatapara_rural", name: "Bhatapara", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Bhatapara", center: [21.7371, 81.9362] },
  { id: "simga_rural", name: "Simga", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Simga", center: [21.6241, 81.7063] },
  { id: "kasdol_rural", name: "Kasdol", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Kasdol", center: [21.6184, 82.4271] },
  { id: "palari_rural", name: "Palari", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Palari", center: [21.5284, 82.0291] },
  { id: "lawan_village", name: "Lawan", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Lawan", center: [21.5681, 82.3164] },
  { id: "girodhpuri_village", name: "Girodhpuri", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Kasdol", center: [21.6510, 82.5620] },
  { id: "damakheda_village", name: "Damakheda", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Simga", center: [21.6820, 81.7910] },
  { id: "sonadih_village", name: "Sonadih", district: "Baloda Bazar", state: "Chhattisgarh", tehsil: "Baloda Bazar", center: [21.6912, 82.1950] },
];

export const assessmentLabels = {
  suitable: "Potentially suitable",
  assessment: "Needs assessment",
  water: "Water-related",
  insufficient: "Insufficient data",
  constraints: "Review constraints",
};

const parcelSeeds = [
  ["BB-001", "baloda_bazar_hq", "Khasra 142/1", 12.4, "Degraded Scrub / Open Fallow", "suitable", "Verified", 92, "Solar Energy", 0.22, 1.2, 7.0, "Vertisol (Kanhar)", "Government Cultivable Wasteland", true, 0.005, 0.006],
  ["BB-002", "baloda_bazar_hq", "Khasra 219/3", 8.2, "Seasonal Fallow / Sparse Scrub", "suitable", "Verified", 85, "Agriculture", 0.31, 1.4, 6.8, "Alfisol (Dorsa)", "Panchayat Gothan / Grazing Land", true, -0.004, 0.003],
  ["BB-003", "baloda_bazar_hq", "Khasra 88/2", 15.6, "Barren Wasteland / Stony Scrub", "suitable", "Verified", 94, "Solar Energy", 0.14, 1.0, 7.2, "Vertisol (Kanhar)", "Revenue Nazul Fallow Land", true, 0.002, -0.005],
  ["BB-004", "baloda_bazar_hq", "Khasra 405", 5.1, "Single Crop / Light Canopy", "assessment", "In review", 74, "Agroforestry", 0.44, 2.8, 6.7, "Alfisol (Dorsa)", "Private Single-Crop Fallow", false, -0.006, -0.004],
  ["BB-005", "baloda_bazar_hq", "Khasra 512/1", 3.8, "Water Body / Wetland", "water", "In review", 45, "Rainwater harvesting", 0.03, 0.5, 7.4, "Alluvial Clay", "Water Drainage Buffer (Talab)", false, 0.007, -0.002],
  ["BP-101", "bhatapara_rural", "Khasra 74/2", 22.5, "Degraded Scrub / Open Fallow", "suitable", "Verified", 93, "Solar Energy", 0.20, 1.1, 7.1, "Vertisol (Kanhar)", "Government Chhote Jhad Ka Jungle", true, 0.004, 0.007],
  ["BP-102", "bhatapara_rural", "Khasra 312", 14.0, "Seasonal Fallow / Sparse Scrub", "suitable", "Verified", 82, "Agroforestry", 0.29, 2.2, 6.9, "Alfisol (Dorsa)", "Panchayat Grazing / Pasture Land", true, -0.005, -0.003],
  ["BP-103", "bhatapara_rural", "Khasra 490/1", 18.8, "Barren Wasteland / Stony Scrub", "suitable", "Verified", 95, "Solar Energy", 0.12, 0.9, 7.3, "Vertisol (Kanhar)", "Government Cultivable Wasteland", true, 0.006, -0.005],
  ["BP-104", "bhatapara_rural", "Khasra 602", 7.4, "Single Crop / Light Canopy", "assessment", "In review", 70, "Agriculture", 0.48, 1.5, 6.8, "Alfisol (Dorsa)", "Private Fallow Land", false, -0.003, 0.006],
  ["SM-201", "simga_rural", "Khasra 45/1", 16.2, "Degraded Scrub / Open Fallow", "suitable", "Verified", 91, "Solar Energy", 0.21, 1.0, 7.0, "Vertisol (Kanhar)", "Government Non-Agricultural Fallow", true, 0.004, -0.006],
  ["SM-202", "simga_rural", "Khasra 189", 11.0, "Seasonal Fallow / Sparse Scrub", "suitable", "Verified", 84, "Agriculture", 0.33, 1.3, 6.9, "Alfisol (Dorsa)", "Panchayat Gothan Land", true, -0.004, 0.005],
  ["SM-203", "simga_rural", "Khasra 278", 4.2, "Water Body / Wetland", "water", "In review", 40, "Water protection", 0.02, 0.4, 7.5, "Alluvial Silt", "Sheonath River Catchment Buffer", false, -0.006, -0.004],
  ["KD-301", "kasdol_rural", "Khasra 98/4", 28.6, "Degraded Scrub / Open Fallow", "suitable", "Verified", 89, "Agroforestry", 0.25, 3.8, 6.5, "Inceptisol (Bhata)", "Revenue Scrub / Cultivable Wasteland", true, 0.006, 0.008],
  ["KD-302", "kasdol_rural", "Khasra 215", 19.4, "Seasonal Fallow / Sparse Scrub", "suitable", "Verified", 86, "Agroforestry", 0.32, 4.2, 6.6, "Alfisol (Dorsa)", "Community Nistar / Grazing Reserve", true, -0.005, 0.004],
  ["KD-303", "kasdol_rural", "Khasra 510/2", 34.0, "Barren Wasteland / Stony Scrub", "suitable", "Verified", 96, "Solar Energy", 0.15, 1.8, 6.8, "Vertisol (Kanhar)", "Government Stony / Barren Wasteland", true, 0.008, -0.007],
  ["KD-304", "kasdol_rural", "Khasra 630", 9.5, "Dense Crop / Forest Cover", "constraints", "In review", 50, "Forest conservation", 0.58, 6.5, 6.4, "Forest Loam", "Forest Department Boundary Reserve", false, -0.008, -0.006],
];

export const parcels = parcelSeeds.map((seed) => {
  const [
    id, villageId, khasraNo, area, cover, status, verification, score, use,
    ndvi, slopeDeg, soilPH, soilType, khasraType, isLegallyVerified, latOff, lonOff,
  ] = seed;
  const village = villages.find((item) => item.id === villageId) || villages[0];

  return {
    id,
    villageId,
    villageName: village.name,
    tehsil: village.tehsil,
    khasraNo,
    area,
    cover,
    status,
    statusLabel: assessmentLabels[status] || status,
    verification,
    score,
    suggestedUse: use,
    ndvi,
    slopeDeg,
    soilPH,
    soilType,
    khasraType,
    isLegallyVerified,
    legalStatus: isLegallyVerified ? "Legally Verified Available (Revenue/Panchayat Land)" : "Potentially Available (Private / Unverified)",
    confidenceScore: 88,
    roadAccess: "Good · 0.6 km",
    waterProximity: "Moderate · 1.5 km",
    updated: "2026-10-24",
    center: [Number((village.center[0] + latOff).toFixed(5)), Number((village.center[1] + lonOff).toFixed(5))],
  };
});

export const recommendations = {
  "Solar Energy": "Flat topography and high solar irradiance on uncultivated wasteland indicate excellent ground-mounted solar PV potential.",
  "Agriculture": "Fertile Kanhar/Dorsa soil and gentle slope support high agricultural productivity with planned irrigation.",
  "Agroforestry": "Undulating terrain and scrub cover are optimal for drought-hardy silviculture, fruit tree planting, and community commons.",
};

export const reports = [
  {
    id: "report-001",
    title: "Baloda Bazar District Land Suitability Snapshot",
    type: "District Assessment",
    generatedAt: "2026-10-24",
    status: "Ready",
    summary: "Satellite NDVI and terrain analysis across Baloda Bazar district (DILRMP Code 674), identifying candidate uncultivated wastelands.",
  },
  {
    id: "report-002",
    title: "Mahanadi & Sheonath River Catchment Drainage Review",
    type: "Environmental & Hydrology",
    generatedAt: "2026-10-20",
    status: "Ready",
    summary: "Drainage buffers and seasonal flood risk assessment for candidate solar and agroforestry parcels.",
  },
  {
    id: "report-003",
    title: "Chhattisgarh BhuNaksha Cadastral Availability Reconciliation",
    type: "Legal & Revenue Audit",
    generatedAt: "2026-10-18",
    status: "Ready",
    summary: "Distinguishing biophysically potentially unused scrub from legally verified Government Nazul/Gothan commons.",
  },
];
