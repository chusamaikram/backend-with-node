import {
    create
} from "zustand";

const useUiStore = create((set) => ({
    sidebarOpen: false,

    toggleSidebar: () =>
        set((state) => ({
            sidebarOpen: !state.sidebarOpen
        })),

    setSidebarOpen: (value) => set({
        sidebarOpen: value
    }),

    // ── Add-to-Playlist Modal ─────────────────────────────────
    addToPlaylistModal: {
        open: false,
        /** @type {string | null} videoId to add */
        videoId: null,
    },

    openAddToPlaylist: (videoId) =>
        set({
            addToPlaylistModal: {
                open: true,
                videoId
            }
        }),

    closeAddToPlaylist: () =>
        set({
            addToPlaylistModal: {
                open: false,
                videoId: null
            }
        }),
}));

export default useUiStore;