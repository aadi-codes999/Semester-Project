import { apiRequest } from "./api";

export function getDashboardStats(villageId) {
  const query = villageId ? `?village_id=${encodeURIComponent(villageId)}` : "";
  return apiRequest(`/dashboard/stats${query}`);
}

export function getHealth() {
  return apiRequest("/health");
}
