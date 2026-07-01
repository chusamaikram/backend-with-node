import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";



export const registerUser = async (formData) => {
    const response = await api.post(API_ENDPOINTS.USER.REGISTER, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 0, // disable timeout for file uploads — Cloudinary can be slow
    });
    return response.data;
};


export const loginUser = async (credentials) => {
    const response = await api.post(API_ENDPOINTS.USER.LOGIN, credentials);
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post(API_ENDPOINTS.USER.LOGOUT);
    return response.data;
};

export const refreshToken = async () => {
    const response = await api.post(API_ENDPOINTS.USER.REFRESH_TOKEN);
    return response.data;
};

// ── Account ──────────────────────────────────────────────────────────────────

export const getCurrentUser = async () => {
    const response = await api.get(API_ENDPOINTS.USER.CURRENT_USER);
    return response.data;
};


export const updateAccount = async (data) => {
    const response = await api.patch(API_ENDPOINTS.USER.UPDATE_ACCOUNT, data);
    return response.data;
};


export const changePassword = async (data) => {
    const response = await api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
    return response.data;
};


export const updateAvatar = async (formData) => {
    const response = await api.patch(API_ENDPOINTS.USER.UPDATE_AVATAR, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 0,
    });
    return response.data;
};

export const updateCoverImage = async (formData) => {
    const response = await api.patch(API_ENDPOINTS.USER.UPDATE_COVER, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 0,
    });
    return response.data;
};

// ── Channel & History ─────────────────────────────────────────────────────────


export const getChannelProfile = async (username) => {
    const response = await api.get(API_ENDPOINTS.USER.CHANNEL_PROFILE(username));
    return response.data;
};

export const getWatchHistory = async () => {
    const response = await api.get(API_ENDPOINTS.USER.WATCH_HISTORY);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post(API_ENDPOINTS.USER.FORGOT_PASSWORD, { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post(API_ENDPOINTS.USER.RESET_PASSWORD(token), { newPassword });
    return response.data;
};