# VideoTube — Frontend Sprints

> Tracks all remaining implementation sprints after the foundation (Sprints 1–2) is complete.
> Each sprint builds on the previous one. Do not skip sprints.

---

## ✅ Done — Sprint 1 & 2 (Foundation + Auth)

**Completed:**
- Full project structure, Vite + React + Tailwind config, design system
- App shell — Navbar, Sidebar, AppLayout, Container
- Routing tree — ProtectedRoute, GuestRoute, all page shells
- Auth — LoginPage, RegisterPage, useAuth hook
- AuthProvider — session validation on boot via GET /users/current-user
- authStore (Zustand, accessToken in-memory only), uiStore
- axiosInstance — Bearer token injection + silent 401 refresh interceptor
- All API service files (user, video, comment, like, tweet, playlist, subscription, dashboard)
- UI primitives — Button, Input, Avatar, Badge, Spinner
- Skeleton loaders — VideoCardSkeleton, VideoGridSkeleton, CommentSkeleton,
  ChannelCardSkeleton, PlaylistCardSkeleton, StatCardSkeleton, VideoTableSkeleton
- VideoCard, VideoGrid (mock data only)
- All page shells exist but most use mock data

---

## Sprint 3 — Core Video Feed

**Goal:** HomePage and SearchPage hit real APIs. Users can browse and search real videos.

### Tasks

- [x] `videoStore.js` — caches videos, page, hasNextPage, filters in Zustand
- [x] `useDebounce.js` — debounces search input 300ms before API call
- [x] `useVideos.js` — custom hook handling fetch, pagination, filter changes
- [x] Wire `HomePage` to `GET /videos` — real API, infinite scroll, skeletons
- [x] Implement infinite scroll using `IntersectionObserver` on sentinel div
- [x] Show `VideoGridSkeleton` on initial load, spinner on subsequent page fetches
- [x] Wire `SearchPage` to `GET /videos?query=&sortBy=&sortType=&page=`
- [x] Sort stored in URL params (?sort=) — shareable/bookmarkable URLs
- [x] Show horizontal skeleton while search results load
- [x] Empty state — "No results for query" when results array is empty
- [x] Empty state — "Nothing here yet" on HomePage when no videos exist

### APIs
```
GET /api/v1/videos?page=&limit=12&sortBy=createdAt&sortType=desc
GET /api/v1/videos?query=:q&sortBy=:sort&sortType=:order&page=:page&limit=12
```

### Notes
- Pagination response shape: `{ docs, totalDocs, limit, page, totalPages, hasNextPage }`
- Use `hasNextPage` from response to stop the infinite scroll observer
- Search query should be debounced (300ms) before firing the API call — add `useDebounce` hook

---

## ✅ Done — Sprint 4 (Video Page)

**Completed:**
- `videoDetailStore.js` — single video cache with optimistic like/subscribe state
- `commentStore.js` — paginated comments with full optimistic CRUD
- `useVideoDetail.js` — fetches video, handles like/subscribe with optimistic updates
- `useComments.js` — full comment CRUD with optimistic add/edit/delete/like
- `VideoPage` — real data, skeleton loading, error state
- `VideoInfo` — purely presentational, receives all state as props
- `VideoPlayer` — HTML5 player with Cloudinary URL
- `CommentSection` — real API, guests can read but not interact
- `RelatedVideos` — real API, local state (ephemeral data)
- Backend fixes — `toggleVideoLike` syntax bug, `GET /comments/:videoId` made public
- View count fix — `sessionStorage` session guard on frontend + `countView` param on backend

### APIs
```
GET    /api/v1/videos/:videoId
POST   /api/v1/likes/v/:videoId
POST   /api/v1/subscriptions/:channelId
GET    /api/v1/comments/:videoId?page=&limit=10
POST   /api/v1/comments/:videoId
PATCH  /api/v1/comments/c/:commentId
DELETE /api/v1/comments/c/:commentId
POST   /api/v1/likes/c/:commentId
```

### Notes
- `video.thumbnail` and `video.videoFile` are objects `{ url, public_id }` — always use `.url`
- `ispublished` is lowercase in the video model
- Increment view count is handled by the backend on `GET /videos/:videoId`

---

## ✅ Done — Sprint 5 (Channel Page)

**Completed:**
- `channelStore.js` — channel profile + subscribe state
- `useChannelProfile.js` — fetches channel by username, handles subscribe
- `ChannelHeader` — purely presentational, skeleton loading state
- `ChannelPage` — real API, lazy tab loading (Videos/Playlists/Tweets fetch only on first activation)
- Backend fixes — `GET /users/c/:username` made public, guest-safe `isSubscribed` in aggregation
- `GET /playlists/:userId` and `GET /tweets` made public
- `getUserTweets` accepts optional `userId` query param for channel page
- `isLiked` in tweet aggregation made guest-safe

---

## Sprint 6 — Social Pages

**Goal:** All "my stuff" protected pages — subscriptions, liked, history, tweets CRUD.

### Tasks

**SubscriptionsPage**
- [ ] Fetch subscribed channels — `GET /subscriptions/c/:subscriberId`
- [ ] Show `ChannelCardSkeleton` while loading
- [ ] Render `ChannelCard` grid with subscribe/unsubscribe toggle
- [ ] Empty state — "Subscribe to channels to see them here"

**LikedVideosPage**
- [ ] Fetch liked videos — `GET /likes/videos`
- [ ] Show `VideoGridSkeleton` while loading
- [ ] Render standard `VideoGrid`
- [ ] Empty state — "Like videos to see them here"

**WatchHistoryPage**
- [ ] Fetch watch history — `GET /users/watch-history`
- [ ] Group videos by date — Today / Yesterday / This Week / Earlier
- [ ] Render each group as a labeled section with `VideoCard` horizontal list
- [ ] Show skeleton while loading
- [ ] Empty state — "Videos you watch will appear here"

**TweetsPage**
- [ ] Fetch tweets — `GET /tweets?page=1&limit=10`
- [ ] Create tweet — `POST /tweets/create-tweet` — prepend optimistically
- [ ] Edit tweet (inline) — `PATCH /tweets/t/:tweetId` — update optimistically
- [ ] Delete tweet — `DELETE /tweets/t/:tweetId` — remove optimistically
- [ ] Like / unlike tweet — `POST /likes/t/:tweetId` with optimistic toggle
- [ ] Empty state — "Share your thoughts"

### APIs
```
GET    /api/v1/subscriptions/c/:subscriberId
GET    /api/v1/likes/videos
GET    /api/v1/users/watch-history
GET    /api/v1/tweets?page=&limit=10
POST   /api/v1/tweets/create-tweet
PATCH  /api/v1/tweets/t/:tweetId
DELETE /api/v1/tweets/t/:tweetId
POST   /api/v1/likes/t/:tweetId
```

---

## Sprint 7 — Playlists + Upload + Dashboard

**Goal:** Content creation and channel management fully wired.

### Tasks

**PlaylistsPage**
- [ ] Fetch playlists — `GET /playlists/:userId`
- [ ] Show `PlaylistCardSkeleton` while loading
- [ ] "New Playlist" button opens modal — `POST /playlists` with name + description
- [ ] Empty state — "Create your first playlist"

**PlaylistDetailPage**
- [ ] Fetch playlist — `GET /playlists/p/:playlistId`
- [ ] Render playlist header (name, description, video count, edit/delete actions)
- [ ] Render videos as `VideoCard` horizontal list
- [ ] Remove video from playlist — `DELETE /playlists/p/:playlistId/videos/:videoId`
- [ ] Edit playlist details — `PATCH /playlists/p/:playlistId`
- [ ] Delete playlist — `DELETE /playlists/p/:playlistId` → redirect to `/playlists`

**UploadVideoPage**
- [ ] Drag & drop zone for video file (`videoFile` field)
- [ ] Form fields — title, description, thumbnail image upload
- [ ] React Hook Form + Zod validation for all fields
- [ ] Upload progress bar during `POST /videos/upload-video` (Axios `onUploadProgress`)
- [ ] On success → redirect to `/watch/:videoId`
- [ ] Disable submit button during upload to prevent double submission

**DashboardPage**
- [ ] Fetch stats — `GET /dashboard/stats`
- [ ] Show `StatCardSkeleton count={4}` while loading → render `StatCard` grid
- [ ] Fetch channel videos — `GET /dashboard/videos`
- [ ] Show `VideoTableSkeleton` while loading → render `VideoTable`
- [ ] Toggle publish — `PATCH /videos/toggle-publish/:videoId` with optimistic update
- [ ] Delete video from table — `DELETE /videos/delete-video/:videoId` with confirmation
- [ ] "Upload New Video" button links to `/upload`

### APIs
```
GET    /api/v1/playlists/:userId
POST   /api/v1/playlists
GET    /api/v1/playlists/p/:playlistId
PATCH  /api/v1/playlists/p/:playlistId
DELETE /api/v1/playlists/p/:playlistId
DELETE /api/v1/playlists/p/:playlistId/videos/:videoId
POST   /api/v1/videos/upload-video          (multipart/form-data)
GET    /api/v1/dashboard/stats
GET    /api/v1/dashboard/videos
PATCH  /api/v1/videos/toggle-publish/:videoId
DELETE /api/v1/videos/delete-video/:videoId
```

### Notes
- `dashboard/videos` returns `createdAt` as date parts object `{ year, month, day }` — reconstruct for display
- `ispublished` is lowercase — handle carefully in the publish toggle
- Show a confirmation dialog before delete (can use a simple inline confirm state, no library needed)

---

## Sprint 8 — Settings + Polish

**Goal:** Settings fully wired. App is production-ready visually and functionally.

### Tasks

**SettingsPage**
- [ ] Profile tab — React Hook Form + Zod, `PATCH /users/update-account`, update `authStore` on success
- [ ] Avatar tab — image preview before upload, `PATCH /users/avatar`, update `authStore.user.avatar`
- [ ] Cover image tab — same pattern as avatar, `PATCH /users/cover-image`
- [ ] Password tab — add confirm password field + Zod `refine` to match passwords, already wired to `useAuth.updatePassword`

**Error Handling**
- [ ] Create `ErrorBoundary` component — wrap `RouterProvider` to catch render crashes
- [ ] Create reusable `ErrorMessage` component for inline API errors (not just toasts)
- [ ] Handle `404` from API gracefully — show `NotFoundPage` instead of crashing

**Empty States Audit**
- [ ] Confirm every list page has a proper empty state matching the plan
- [ ] No subscriptions → "Subscribe to channels to see their videos"
- [ ] No liked videos → "Like videos to see them here"
- [ ] No history → "Videos you watch will appear here"
- [ ] No tweets → "Share your thoughts"
- [ ] No playlists → "Create your first playlist"
- [ ] No search results → "No results for \":query\""

**Responsive Pass**
- [ ] Mobile sidebar — full overlay panel, dismissed by backdrop click (already built, test thoroughly)
- [ ] Navbar on mobile — hide keyboard shortcut hint, compact spacing
- [ ] Video grid breakpoints — verify 1 / 2 / 3 / 4 col at all breakpoints
- [ ] VideoPage layout — stack player + sidebar vertically on mobile
- [ ] DashboardPage table — horizontal scroll on small screens

**Polish & Micro-interactions**
- [ ] Page transition — subtle fade-in on route change
- [ ] Skeleton → content transition — fade-in when data arrives
- [ ] Like button — scale + color pop on click
- [ ] Subscribe button — smooth text swap animation
- [ ] Upload progress bar — smooth width transition

### APIs
```
PATCH /api/v1/users/update-account
PATCH /api/v1/users/avatar          (multipart/form-data)
PATCH /api/v1/users/cover-image     (multipart/form-data)
POST  /api/v1/users/change-password
```

---

## Sprint Overview

| Sprint | Focus | Key Deliverable |
|---|---|---|
| ✅ 1–2 | Foundation + Auth | App shell, login/register, token management |
| 3 | Core Video Feed | Real video data, infinite scroll, search |
| 4 | Video Page | Player, likes, subscribe, comments CRUD |
| 5 | Channel Page | Public profile, tabs, subscribe |
| 6 | Social Pages | Subscriptions, liked, history, tweets CRUD |
| 7 | Creation + Management | Playlists, video upload, dashboard |
| 8 | Settings + Polish | Settings, error handling, responsive, animations |

---

## General Rules Across All Sprints

- Every data-fetching component must show a skeleton — never a blank screen
- Every list page must have an empty state
- All mutations (like, subscribe, comment, tweet) use optimistic updates — update UI instantly, revert on error
- Use custom hooks + Zustand for all server state — no raw `useState` + `useEffect` for API calls
- Use React Hook Form + Zod for all forms with file uploads or multiple fields
- Never store sensitive data (tokens) in localStorage — accessToken stays in Zustand memory only
- All API calls go through `axiosInstance` — never raw `axios` or `fetch`
