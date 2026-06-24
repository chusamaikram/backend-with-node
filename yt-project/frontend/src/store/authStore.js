import {
    create
} from "zustand";
import {
    persist
} from "zustand/middleware";

/**
 * Auth store — holds logged-in user data and access token.
 *
 * Security model:
 *   - `user` and `isLoggedIn` are persisted to localStorage (safe — no secrets).
 *   - `accessToken` is intentionally NOT persisted — it lives in memory only.
 *     On a hard refresh the Axios 401 interceptor will automatically call
 *     POST /users/refresh-token (cookie sent by browser) to get a new one.
 *   - `refreshToken` is never touched by the frontend — it lives in an
 *     HttpOnly cookie managed entirely by the backend.
 */
const useAuthStore = create(
    persist(
        (set) => ({
            /** @type {{ _id: string, username: string, fullname: string, email: string, avatar: string, coverImage: string } | null} */
            user: null,

            /** In-memory only — never persisted to localStorage. */
            accessToken: null,

            /** Derived flag — prefer this over manually checking user !== null */
            isLoggedIn: false,

            /**
             * Called after a successful login or register.
             * @param {{ _id, username, fullname, email, avatar, coverImage }} user
             * @param {string} token
             */
            setUser: (user, token) =>
                set({
                    user,
                    accessToken: token,
                    isLoggedIn: true,
                }),

            /**
             * Called by the Axios interceptor after a silent token refresh.
             * Only updates the in-memory token — does not touch persisted state.
             * @param {string} token
             */
            setAccessToken: (token) => set({ accessToken: token }),

            /**
             * Partial update — used by SettingsPage after profile/avatar edits.
             * @param {Partial<typeof user>} partial
             */
            updateUser: (partial) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...partial } : null,
                })),

            /** Called on logout — clears all auth state. */
            clearUser: () =>
                set({
                    user: null,
                    accessToken: null,
                    isLoggedIn: false,
                }),
        }),
        {
            name: "auth-storage",
            // accessToken is deliberately excluded — in-memory only
            partialize: (state) => ({
                user: state.user,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);

export default useAuthStore;