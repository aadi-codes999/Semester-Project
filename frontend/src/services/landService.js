import { apiRequest } from "./api";

export function getLandParcels(params = "") {
  return apiRequest(`/land/parcels${params ? `?${params}` : ""}`);
}

export function getParcelDetails(parcelId) {
  return apiRequest(`/land/parcels/${encodeURIComponent(parcelId)}`);
}
