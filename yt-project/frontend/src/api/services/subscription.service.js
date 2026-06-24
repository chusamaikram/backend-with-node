import api from "../axiosinstance";
import {
    API_ENDPOINTS
} from "../endpoints";

/**
 * Subscription service
 */

/** @param {string} channelId */
export const toggleSubscription = async (channelId) => {
    const response = await api.post(API_ENDPOINTS.SUBSCRIPTION.TOGGLE(channelId));
    return response.data;
};

/**
 * Get all subscribers of a channel.
 * @param {string} channelId
 */
export const getSubscribers = async (channelId) => {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIBERS(channelId));
    return response.data;
};

/**
 * Get all channels a user has subscribed to.
 * @param {string} subscriberId - the user's _id
 */
export const getSubscribedChannels = async (subscriberId) => {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIBED(subscriberId));
    return response.data;
};