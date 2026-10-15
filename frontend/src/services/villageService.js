import { apiRequest } from "./api";

export function getVillages() {
  return apiRequest("/villages");
}
