import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";

/**
 * Dashboard service
 * Both endpoints are scoped to the currently logged-in channel (verified by JWT).
 */

export const getChannelStats = async () => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
    return response.data;
};

export const getChannelVideos = async () => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.VIDEOS);
    return response.data;
};