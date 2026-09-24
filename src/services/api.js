import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    const isAuthEndpoint =
      config?.url?.includes("/auth/login") ||
      config?.url?.includes("/auth/refresh-token");

    if (response?.status !== 401 || isAuthEndpoint || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      // Share one in-flight refresh across concurrent 401s instead of
      // firing a refresh request per failed call.
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh-token")
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshResponse = await refreshPromise;
      const newAccessToken = refreshResponse.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("No access token returned from refresh");
      }

      localStorage.setItem("accessToken", newAccessToken);
      config.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(config);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      return Promise.reject(error);
    }
  }
);

export default api;