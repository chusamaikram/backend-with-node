import { create } from "zustand";

const useSubscriptionStore = create((set) => ({
    channels: [],
    loading: false,
    error: null,

    setChannels: (channels) => set({ channels }),
    setLoading: (value) => set({ loading: value }),
    setError: (message) => set({ error: message }),

    // Optimistic toggle — flip isSubscribed on the matching channel
    toggleChannel: (channelId) =>
        set((state) => ({
            channels: state.channels.map((ch) =>
                ch._id === channelId ? { ...ch, isSubscribed: !ch.isSubscribed } : ch
            ),
        })),

    reset: () => set({ channels: [], loading: false, error: null }),
}));

export default useSubscriptionStore;
