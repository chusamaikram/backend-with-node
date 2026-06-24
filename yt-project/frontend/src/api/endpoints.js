/**
 * API_ENDPOINTS — single source of truth for every backend URL.
 *
 * Rules:
 *  - Base prefix /api/v1 is handled by axiosInstance baseURL, never repeat it here.
 *  - Static paths  → plain strings.
 *  - Dynamic paths → arrow functions that accept an id and return the full path.
 *  - HTTP method is noted in comments; the actual method is set in the API function.
 *
 * Backend route prefixes (app.js):
 *   /api/v1/users          → API_ENDPOINTS.USER
 *   /api/v1/videos         → API_ENDPOINTS.VIDEO
 *   /api/v1/comments       → API_ENDPOINTS.COMMENT
 *   /api/v1/likes          → API_ENDPOINTS.LIKE
 *   /api/v1/tweets         → API_ENDPOINTS.TWEET
 *   /api/v1/subscriptions  → API_ENDPOINTS.SUBSCRIPTION
 *   /api/v1/playlists      → API_ENDPOINTS.PLAYLIST
 *   /api/v1/dashboard      → API_ENDPOINTS.DASHBOARD
 *   /api/v1/healthcheck    → API_ENDPOINTS.HEALTH
 */

export const API_ENDPOINTS = {

    // ─── User / Auth ─────────────────────────────────────────────────────
    USER: {
        // Public
        REGISTER: "/users/register", // POST  multipart: avatar (req), coverImage (opt)
        LOGIN: "/users/login", // POST  { identifier, password }
        REFRESH_TOKEN: "/users/refresh-token", // POST  (refreshToken cookie sent automatically)

        // Protected
        LOGOUT: "/users/logout", // POST
        CHANGE_PASSWORD: "/users/change-password", // POST  { oldPassword, newPassword }
        CURRENT_USER: "/users/current-user", // GET
        UPDATE_ACCOUNT: "/users/update-account", // PATCH { fullname, email }
        UPDATE_AVATAR: "/users/avatar", // PATCH multipart: avatar
        UPDATE_COVER: "/users/cover-image", // PATCH multipart: coverImage
        WATCH_HISTORY: "/users/watch-history", // GET

        // Dynamic
        CHANNEL_PROFILE: (username) => `/users/c/${username}`, // GET  channel + subscriber counts
    },

    // ─── Videos ──────────────────────────────────────────────────────────
    VIDEO: {
        // Static
        GET_ALL: "/videos", // GET  ?page&limit&query&sortBy&sortType&userId
        UPLOAD: "/videos/upload-video", // POST multipart: videoFile (req), thumbnail (req)

        // Dynamic
        GET_BY_ID: (videoId) => `/videos/${videoId}`, // GET
        DELETE: (videoId) => `/videos/delete-video/${videoId}`, // DELETE
        TOGGLE_PUBLISH: (videoId) => `/videos/toggle-publish/${videoId}`, // PATCH
        UPDATE: (videoId) => `/videos/update-video/${videoId}`, // PATCH multipart: thumbnail (opt)
    },

    // ─── Comments ────────────────────────────────────────────────────────
    COMMENT: {
        // Dynamic — GET and POST share the same path, differentiated by HTTP method
        GET_BY_VIDEO: (videoId) => `/comments/${videoId}`, // GET  ?page&limit
        ADD: (videoId) => `/comments/${videoId}`, // POST { content }
        UPDATE: (commentId) => `/comments/c/${commentId}`, // PATCH  { content }
        DELETE: (commentId) => `/comments/c/${commentId}`, // DELETE
    },

    // ─── Likes ───────────────────────────────────────────────────────────
    LIKE: {
        // Static
        LIKED_VIDEOS: "/likes/videos", // GET  → array of videos the current user liked

        // Dynamic — all POST (toggle on/off)
        TOGGLE_VIDEO: (videoId) => `/likes/v/${videoId}`,
        TOGGLE_COMMENT: (commentId) => `/likes/c/${commentId}`,
        TOGGLE_TWEET: (tweetId) => `/likes/t/${tweetId}`,
    },

    // ─── Tweets ──────────────────────────────────────────────────────────
    TWEET: {
        // Static
        GET_ALL: "/tweets", // GET  → current user's tweets
        CREATE: "/tweets/create-tweet", // POST { content }

        // Dynamic — UPDATE and DELETE share the same path, differentiated by HTTP method
        UPDATE: (tweetId) => `/tweets/t/${tweetId}`, // PATCH  { content }
        DELETE: (tweetId) => `/tweets/t/${tweetId}`, // DELETE
    },

    // ─── Subscriptions ───────────────────────────────────────────────────
    SUBSCRIPTION: {
        // Dynamic
        TOGGLE: (channelId) => `/subscriptions/${channelId}`, // POST   toggle subscribe/unsubscribe
        GET_SUBSCRIBERS: (channelId) => `/subscriptions/s/${channelId}`, // GET    who subscribed to this channel
        GET_SUBSCRIBED: (subscriberId) => `/subscriptions/c/${subscriberId}`, // GET    channels this user follows
    },

    // ─── Playlists ───────────────────────────────────────────────────────
    PLAYLIST: {
        // Static
        CREATE: "/playlists", // POST { name, description }

        // Dynamic
        GET_BY_USER: (userId) => `/playlists/${userId}`, // GET
        GET_BY_ID: (playlistId) => `/playlists/p/${playlistId}`, // GET
        UPDATE: (playlistId) => `/playlists/p/${playlistId}`, // PATCH  { name, description }
        DELETE: (playlistId) => `/playlists/p/${playlistId}`, // DELETE

        // ADD and REMOVE share the same path — differentiated by PATCH vs DELETE
        ADD_VIDEO: (playlistId, videoId) => `/playlists/p/${playlistId}/videos/${videoId}`, // PATCH
        REMOVE_VIDEO: (playlistId, videoId) => `/playlists/p/${playlistId}/videos/${videoId}`, // DELETE
    },

    // ─── Dashboard ───────────────────────────────────────────────────────
    DASHBOARD: {
        STATS: "/dashboard/stats", // GET → { totalVideos, totalViews, totalLikes, totalSubscribers }
        VIDEOS: "/dashboard/videos", // GET → channel's videos with per-video stats
    },

    // ─── Health check ────────────────────────────────────────────────────
    HEALTH: {
        CHECK: "/healthcheck", // GET → { message: "ok" }
    },
};