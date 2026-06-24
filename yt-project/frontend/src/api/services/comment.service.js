import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";

/**
 * Comment service
 */


export const getVideoComments = async (videoId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.COMMENT.GET_BY_VIDEO(videoId), {
        params
    });
    return response.data;
};


export const addComment = async (videoId, data) => {
    const response = await api.post(API_ENDPOINTS.COMMENT.ADD(videoId), data);
    return response.data;
};

/**
 * @param {string} commentId
 * @param {{ content: string }} data
 */
export const updateComment = async (commentId, data) => {
    const response = await api.patch(API_ENDPOINTS.COMMENT.UPDATE(commentId), data);
    return response.data;
};

/**
 * @param {string} commentId
 */
export const deleteComment = async (commentId) => {
    const response = await api.delete(API_ENDPOINTS.COMMENT.DELETE(commentId));
    return response.data;
};