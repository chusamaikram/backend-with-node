import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";

/**
 * Like service
 * All toggle endpoints return the new like state from the backend.
 */

export const getLikedVideos = async () => {
    const response = await api.get(API_ENDPOINTS.LIKE.LIKED_VIDEOS);
    return response.data;
};

/** @param {string} videoId */
export const toggleVideoLike = async (videoId) => {
    const response = await api.post(API_ENDPOINTS.LIKE.TOGGLE_VIDEO(videoId));
    return response.data;
};

/** @param {string} commentId */
export const toggleCommentLike = async (commentId) => {
    const response = await api.post(API_ENDPOINTS.LIKE.TOGGLE_COMMENT(commentId));
    return response.data;
};

/** @param {string} tweetId */
export const toggleTweetLike = async (tweetId) => {
    const response = await api.post(API_ENDPOINTS.LIKE.TOGGLE_TWEET(tweetId));
    return response.data;
};