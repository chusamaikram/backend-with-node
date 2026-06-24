import { create } from "zustand";

const useTweetStore = create((set) => ({
    tweets: [],
    loading: false,
    error: null,
    hasNextPage: false,
    page: 1,

    setTweets: (tweets, hasNextPage, page) => set({ tweets, hasNextPage, page }),
    setLoading: (value) => set({ loading: value }),
    setError: (message) => set({ error: message }),

    // Optimistic prepend on create
    prependTweet: (tweet) => set((state) => ({ tweets: [tweet, ...state.tweets] })),

    // Optimistic edit
    updateTweet: (tweetId, content) =>
        set((state) => ({
            tweets: state.tweets.map((t) => (t._id === tweetId ? { ...t, content } : t)),
        })),

    // Revert edit
    revertTweet: (tweetId, originalContent) =>
        set((state) => ({
            tweets: state.tweets.map((t) => (t._id === tweetId ? { ...t, content: originalContent } : t)),
        })),

    // Optimistic delete
    removeTweet: (tweetId) =>
        set((state) => ({ tweets: state.tweets.filter((t) => t._id !== tweetId) })),

    // Revert delete
    insertTweet: (tweet, index) =>
        set((state) => {
            const copy = [...state.tweets];
            copy.splice(index, 0, tweet);
            return { tweets: copy };
        }),

    // Optimistic like toggle
    toggleLike: (tweetId) =>
        set((state) => ({
            tweets: state.tweets.map((t) =>
                t._id === tweetId
                    ? { ...t, isLiked: !t.isLiked, likesCount: t.isLiked ? t.likesCount - 1 : t.likesCount + 1 }
                    : t
            ),
        })),

    reset: () => set({ tweets: [], loading: false, error: null, hasNextPage: false, page: 1 }),
}));

export default useTweetStore;
