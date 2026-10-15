import { apiRequest } from "./api";

export function getRecommendations(villageId) {
  const query = villageId ? `?village_id=${encodeURIComponent(villageId)}` : "";
  return apiRequest(`/recommendations${query}`);
}

export function getParcelRecommendations(parcelId) {
  return apiRequest(`/recommendations/${encodeURIComponent(parcelId)}`);
}
