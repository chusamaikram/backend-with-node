import {
    create
} from "zustand";

/**
 * UI store — controls global interface state like sidebar visibility
 * and shared modals. Not persisted; resets on every page load.
 */
const useUiStore = create((set) => ({
    // ── Sidebar ──────────────────────────────────────────────
    /** Whether the sidebar is expanded (desktop) or open (mobile) */
    sidebarOpen: true,

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