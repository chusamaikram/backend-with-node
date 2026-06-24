import api from "../axiosinstance";
import { API_ENDPOINTS } from "../endpoints";



/**
 * @param {{ page?: number, limit?: number, query?: string, sortBy?: string, sortType?: string, userId?: string }} params
 */
export const getAllVideos = async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.VIDEO.GET_ALL, {
        params
    });
    return response.data;
};

/**
 * @param {string} videoId
 */
export const getVideoById = async (videoId, countView = true) => {
    const response = await api.get(API_ENDPOINTS.VIDEO.GET_BY_ID(videoId), {
        params: { countView }
    });
    return response.data;
};

/**
 * @param {FormData} formData - fields: title, description, videoFile (file), thumbnail (file)
 */
export const uploadVideo = async (formData) => {
    const response = await api.post(API_ENDPOINTS.VIDEO.UPLOAD, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    });
    return response.data;
};

/**
 * @param {string} videoId
 * @param {FormData} formData - fields: title?, description?, thumbnail? (file)
 */
export const updateVideo = async (videoId, formData) => {
    const response = await api.patch(API_ENDPOINTS.VIDEO.UPDATE(videoId), formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    });
    return response.data;
};

/**
 * @param {string} videoId
 */
export const deleteVideo = async (videoId) => {
    const response = await api.delete(API_ENDPOINTS.VIDEO.DELETE(videoId));
    return response.data;
};

/**
 * @param {string} videoId
 */
export const togglePublishStatus = async (videoId) => {
    const response = await api.patch(API_ENDPOINTS.VIDEO.TOGGLE_PUBLISH(videoId));
    return response.data;
};