import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log("URL:", `${config.baseURL ?? ""}${config.url ?? ""}`);
    console.log(config);
  }

  return config;
});

export const aiServerClient = axios.create({
  baseURL: import.meta.env.VITE_AI_SERVER_URL,
  headers:{
    "Content-Type": "application/json",
  }
});

export default apiClient;
