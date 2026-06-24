import { create } from "zustand";

/**
 * channelStore — caches a channel's profile data and subscribe state.
 *
 * Same optimistic update pattern as videoDetailStore:
 *   toggle → fire API → revert on failure.
 *
 * Why a separate store from authStore?
 *   This is public data about someone else's channel — not the logged-in user.
 *   authStore only holds the current user's own data.
 */
const useChannelStore = create((set) => ({
    channel: null,
    loading: false,
    error: null,
    isSubscribed: false,
    subscribersCount: 0,

    setChannel: (channel) =>
        set({
            channel,
            isSubscribed: channel?.isSubscribed ?? false,
            subscribersCount: channel?.subscribersCount ?? 0,
        }),

    setLoading: (value) => set({ loading: value }),
    setError: (message) => set({ error: message }),

    toggleSubscribe: () =>
        set((state) => ({
            isSubscribed: !state.isSubscribed,
            subscribersCount: state.isSubscribed
                ? state.subscribersCount - 1
                : state.subscribersCount + 1,
        })),

    revertSubscribe: () =>
        set((state) => ({
            isSubscribed: !state.isSubscribed,
            subscribersCount: state.isSubscribed
                ? state.subscribersCount - 1
                : state.subscribersCount + 1,
        })),

    reset: () =>
        set({ channel: null, loading: false, error: null, isSubscribed: false, subscribersCount: 0 }),
}));

export default useChannelStore;
