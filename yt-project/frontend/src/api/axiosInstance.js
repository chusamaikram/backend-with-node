import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
});


api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
    refreshQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve(token);
    });
    refreshQueue = [];
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const is401 = status === 401;
        const alreadyRetried = originalRequest._retry === true;
        const isRefreshCall = originalRequest.url?.includes("/users/refresh-token");

        if (!is401 || alreadyRetried || isRefreshCall) {
            return Promise.reject(error);
        }

        // Queue this request while a refresh is already in flight
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await api.post("/users/refresh-token");
            const newToken = response.data?.data?.accessToken;

            // Update in-memory token only — never touches localStorage
            useAuthStore.getState().setAccessToken(newToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            processQueue(null, newToken);

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            // Only redirect to login if the user was actually logged in.
            // For guests, a failed refresh just means no session — don't redirect.
            const { isLoggedIn } = useAuthStore.getState();
            if (isLoggedIn) {
                useAuthStore.getState().clearUser();
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
