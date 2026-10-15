import { apiRequest } from "./api";

export function getReports() {
  return apiRequest("/reports");
}
