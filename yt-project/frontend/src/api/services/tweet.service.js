import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";

/**
 * Tweet service
 */

/**
 * @param {{ page?: number, limit?: number }} params
 */
export const getAllTweets = async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.TWEET.GET_ALL, { params });
    return response.data;
};

/**
 * @param {string} userId
 * @param {{ page?: number, limit?: number }} params
 */
export const getUserTweets = async (userId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.TWEET.GET_USER(userId), { params });
    return response.data;
};

/** @param {{ content: string }} data */
export const createTweet = async (data) => {
    const response = await api.post(API_ENDPOINTS.TWEET.CREATE, data);
    return response.data;
};

/**
 * @param {string} tweetId
 * @param {{ content: string }} data
 */
export const updateTweet = async (tweetId, data) => {
    const response = await api.patch(API_ENDPOINTS.TWEET.UPDATE(tweetId), data);
    return response.data;
};

/** @param {string} tweetId */
export const deleteTweet = async (tweetId) => {
    const response = await api.delete(API_ENDPOINTS.TWEET.DELETE(tweetId));
    return response.data;
};