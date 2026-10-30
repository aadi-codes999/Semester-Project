import { apiRequest } from "./api";

export function getDatasetStatus() {
  return apiRequest("/gis/dataset-status");
}

export function getGisLayers() {
  return apiRequest("/gis/layers");
}

export function getParcelsGeoJson(villageId) {
  const query = villageId ? `?village_id=${encodeURIComponent(villageId)}` : "";
  return apiRequest(`/gis/parcels/geojson${query}`);
}

export function getVillagesGeoJson() {
  return apiRequest("/gis/villages/geojson");
}

export function importGeoData(geoJsonPayload, datasetName = "custom_import") {
  return apiRequest(`/gis/import?name=${encodeURIComponent(datasetName)}`, {
    method: "POST",
    data: geoJsonPayload,
  });
}
