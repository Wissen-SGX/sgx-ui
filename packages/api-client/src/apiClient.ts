/// <reference types="vite/client" />
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
  //withCredentials: true,
  transformRequest: [
    (data: unknown, headers: Record<string, string> | undefined) => {
      if (data instanceof FormData) {
        // Let the browser set Content-Type with the multipart boundary
        if (headers) delete headers["Content-Type"];
        return data;
      }
      return data !== undefined && data !== null ? JSON.stringify(data) : data;
    },
  ],
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Cookie is cleared server-side; redirect to re-authenticate.
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
