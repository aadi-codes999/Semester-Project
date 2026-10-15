import { apiRequest } from "./api";

export function getAssessments(villageId) {
  const query = villageId ? `?village_id=${encodeURIComponent(villageId)}` : "";
  return apiRequest(`/assessments${query}`);
}

export function getParcelAssessment(parcelId) {
  return apiRequest(`/assessments/${encodeURIComponent(parcelId)}`);
}
