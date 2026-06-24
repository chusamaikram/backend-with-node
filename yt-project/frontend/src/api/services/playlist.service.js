import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";

/**
 * Playlist service
 */

/** @param {{ name: string, description?: string }} data */
export const createPlaylist = async (data) => {
    const response = await api.post(API_ENDPOINTS.PLAYLIST.CREATE, data);
    return response.data;
};

/** @param {string} userId */
export const getUserPlaylists = async (userId) => {
    const response = await api.get(API_ENDPOINTS.PLAYLIST.GET_BY_USER(userId));
    return response.data;
};

/** @param {string} playlistId */
export const getPlaylistById = async (playlistId) => {
    const response = await api.get(API_ENDPOINTS.PLAYLIST.GET_BY_ID(playlistId));
    return response.data;
};

/**
 * @param {string} playlistId
 * @param {{ name?: string, description?: string }} data
 */
export const updatePlaylist = async (playlistId, data) => {
    const response = await api.patch(API_ENDPOINTS.PLAYLIST.UPDATE(playlistId), data);
    return response.data;
};

/** @param {string} playlistId */
export const deletePlaylist = async (playlistId) => {
    const response = await api.delete(API_ENDPOINTS.PLAYLIST.DELETE(playlistId));
    return response.data;
};

/**
 * @param {string} playlistId
 * @param {string} videoId
 */
export const addVideoToPlaylist = async (playlistId, videoId) => {
    const response = await api.patch(API_ENDPOINTS.PLAYLIST.ADD_VIDEO(playlistId, videoId));
    return response.data;
};

/**
 * @param {string} playlistId
 * @param {string} videoId
 */
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
    const response = await api.delete(API_ENDPOINTS.PLAYLIST.REMOVE_VIDEO(playlistId, videoId));
    return response.data;
};