import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest(path, options = {}) {
  const { body, data, ...requestOptions } = options;

  try {
    const response = await api.request({
      url: path,
      data: data ?? body,
      ...requestOptions,
    });
    return response.data;
  } catch (error) {
    const detail = axios.isAxiosError(error)
      ? error.response?.data?.message ?? error.message
      : "Unexpected API error";
    throw new Error(`API request failed: ${detail}`, { cause: error });
  }
}
