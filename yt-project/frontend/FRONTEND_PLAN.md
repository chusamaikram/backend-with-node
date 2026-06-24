# VideoTube — Frontend Plan

> A clean, minimal, and professional frontend for the VideoTube REST API.
> Author: Usama Ikram | Stack: React + Vite + TailwindCSS

---

## 1. Design Philosophy

**Theme:** Dark-first, minimal, distraction-free — inspired by linear.app and arc.net aesthetics.

**Principles:**
- Every element earns its place. No decoration for the sake of decoration.
- Content is the hero. The UI frames it, not competes with it.
- Consistent spacing, type scale, and color usage throughout.
- Smooth micro-interactions without being flashy.

---

## 2. Design System

### 2.1 Color Palette

```
Background:
  --bg-base:       #0f0f0f   (main page background)
  --bg-surface:    #1a1a1a   (cards, sidebars, modals)
  --bg-elevated:   #242424   (hover states, dropdowns, inputs)
  --bg-border:     #2e2e2e   (dividers, card borders)

Text:
  --text-primary:  #f5f5f5   (headings, body)
  --text-secondary:#a3a3a3   (meta, timestamps, subtitles)
  --text-muted:    #525252   (placeholders, disabled)

Accent:
  --accent:        #e05252   (primary CTA, like button, active states)
  --accent-hover:  #cc3e3e

Semantic:
  --success:       #22c55e
  --warning:       #f59e0b
  --error:         #ef4444
```

### 2.2 Typography

```
Font Family:
  Headings  → "Inter"  (Google Fonts, weights: 400, 500, 600, 700)
  Body      → "Inter"
  Mono      → "JetBrains Mono" (for durations, counts, code)

Type Scale (Tailwind custom):
  xs:    12px / 1.5  — timestamps, badges
  sm:    14px / 1.5  — meta, captions
  base:  16px / 1.6  — body text
  lg:    18px / 1.4  — card titles
  xl:    20px / 1.3  — section headings
  2xl:   24px / 1.2  — page titles
  3xl:   30px / 1.1  — hero headings
```

### 2.3 Spacing & Layout

```
Base unit: 4px (Tailwind default)
Container max-width: 1440px
Content max-width: 1280px
Sidebar width: 240px (expanded) / 72px (collapsed)
Video grid gap: 20px
Border radius:
  sm: 6px   (buttons, inputs)
  md: 10px  (cards)
  lg: 16px  (modals, panels)
  full: 9999px (avatars, badges)
```

### 2.4 Iconography

- Library: **Lucide React** (consistent stroke-based icons, lightweight)
- Size: 20px default, 16px for inline, 24px for nav

---

## 3. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, modern bundling |
| Styling | Tailwind CSS v3 | Utility-first, fast to build |
| State | Zustand | Minimal, no boilerplate |
| Server State | TanStack Query (React Query) | Caching, pagination, refetch |
| Forms | React Hook Form + Zod | Validation + type safety |
| Routing | React Router v6 | File-convention routing, nested layouts |
| HTTP Client | Axios | Interceptors for token refresh |
| Icons | Lucide React | Clean, consistent |
| Video Player | Video.js or native HTML5 | For Cloudinary video URLs |
| Notifications | React Hot Toast | Minimal, non-intrusive toasts |
| Fonts | Google Fonts (Inter + JetBrains Mono) | |

---

## 4. Project Structure

```
src/
├── api/                    # Axios instance + all API functions
│   ├── axiosInstance.js    # Base URL, interceptors, token refresh
│   ├── auth.api.js
│   ├── video.api.js
│   ├── comment.api.js
│   ├── like.api.js
│   ├── subscription.api.js
│   ├── tweet.api.js
│   ├── playlist.api.js
│   └── dashboard.api.js
│
├── components/             # Reusable UI components
│   ├── ui/                 # Primitives: Button, Input, Avatar, Badge, Spinner
│   ├── layout/             # Navbar, Sidebar, PageContainer, Footer
│   ├── video/              # VideoCard, VideoPlayer, VideoGrid, VideoSkeleton
│   ├── comment/            # CommentList, CommentItem, CommentForm
│   ├── tweet/              # TweetCard, TweetForm, TweetList
│   ├── playlist/           # PlaylistCard, PlaylistModal, PlaylistList
│   ├── channel/            # ChannelHeader, SubscribeButton, ChannelCard
│   └── dashboard/          # StatCard, VideoTable, PublishToggle
│
├── pages/                  # Route-level components (one per page)
│   ├── HomePage.jsx
│   ├── VideoPage.jsx
│   ├── ChannelPage.jsx
│   ├── SearchPage.jsx
│   ├── SubscriptionsPage.jsx
│   ├── LikedVideosPage.jsx
│   ├── WatchHistoryPage.jsx
│   ├── TweetsPage.jsx
│   ├── PlaylistsPage.jsx
│   ├── PlaylistDetailPage.jsx
│   ├── UploadVideoPage.jsx
│   ├── DashboardPage.jsx
│   ├── SettingsPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── store/                  # Zustand global state
│   ├── authStore.js        # user, isLoggedIn, tokens
│   └── uiStore.js          # sidebar open/close, modal states
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.js
│   ├── useInfiniteVideos.js
│   └── useDebounce.js
│
├── utils/                  # Pure helpers
│   ├── formatDuration.js   # seconds → "12:34"
│   ├── formatViews.js      # 1200000 → "1.2M views"
│   ├── formatDate.js       # ISO → "2 days ago"
│   └── cn.js               # Tailwind className merger (clsx + twMerge)
│
├── router/
│   └── index.jsx           # Route tree with protected routes
│
├── App.jsx
└── main.jsx
```

---

## 5. Routing Structure

```
/                           → HomePage (public)
/login                      → LoginPage (guest only)
/register                   → RegisterPage (guest only)
/watch/:videoId             → VideoPage (public)
/search                     → SearchPage (public)  ?q=query
/channel/:username          → ChannelPage (public)

── Protected routes (require login) ──────────────────────
/subscriptions              → SubscriptionsPage
/liked                      → LikedVideosPage
/history                    → WatchHistoryPage
/tweets                     → TweetsPage
/playlists                  → PlaylistsPage
/playlists/:playlistId      → PlaylistDetailPage
/upload                     → UploadVideoPage
/dashboard                  → DashboardPage
/settings                   → SettingsPage
  /settings/profile         → Profile tab
  /settings/password        → Password tab
  /settings/avatar          → Avatar tab
```

---

## 6. Page-by-Page Layout

### 6.1 App Shell

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR  (fixed top, h-14, bg-surface, blur backdrop)│
│  [Logo] [SearchBar]           [Upload] [Avatar Menu] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │  PAGE CONTENT                            │
│ (fixed)  │  (scrollable, padding-left = sidebar w)  │
│          │                                          │
│ 240px    │                                          │
│ (72px    │                                          │
│  mobile) │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Navbar contents:**
- Left: Logo (`VideoTube` wordmark in `--text-primary`, subtle red dot on the T)
- Center: Search bar (rounded, bg-elevated, expand on focus with keyboard shortcut `/`)
- Right (logged out): "Sign In" button
- Right (logged in): Upload icon button → `/upload`, Notification bell (future), Avatar dropdown

**Sidebar links (icons + label):**
- Home (house icon)
- Subscriptions (play-circle icon) — auth required
- --- divider ---
- Liked Videos (heart icon) — auth required
- Watch History (clock icon) — auth required
- Your Tweets (feather icon) — auth required
- Playlists (list icon) — auth required
- --- divider ---
- Dashboard (bar-chart icon) — auth required
- Settings (settings icon) — auth required

---

### 6.2 HomePage

**Layout:** Responsive video grid

```
┌─────────────────────────────────────────────────────┐
│  Sort/Filter Bar: [Newest] [Most Viewed] [Trending]  │
│  (pill buttons, active = bg-accent)                  │
├─────────────────────────────────────────────────────┤
│  [VideoCard] [VideoCard] [VideoCard]                 │
│  [VideoCard] [VideoCard] [VideoCard]                 │
│  ...                                                 │
│  [Load More / Infinite scroll]                       │
└─────────────────────────────────────────────────────┘
```

**VideoCard component:**
```
┌─────────────────────────┐
│  [Thumbnail 16:9]       │  ← aspect-video, object-cover, rounded-md
│  [Duration badge] ─────┘  ← bottom-right, bg-black/80, mono font
│                           
│  [Avatar 32px]  [Title 2 lines]           
│                 [Channel name · Views · Time]
└─────────────────────────────────────────────
```

API: `GET /api/v1/videos?page=1&limit=12&sortBy=createdAt&sortType=desc`

---

### 6.3 VideoPage `/watch/:videoId`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Video Player — full width, 16:9, dark bg]                     │
├──────────────────────────────┬──────────────────────────────────┤
│  Video Info                  │  Up Next / Related Videos        │
│  ─────────────────────────   │  ────────────────────────────    │
│  Title (xl, semibold)        │  [VideoCard mini] × 8            │
│  Views · Date                │  (horizontal layout cards)       │
│  ─────────────────────────   │                                  │
│  [👍 Like count] [Playlist]  │                                  │
│  ─────────────────────────   │                                  │
│  Channel row:                │                                  │
│  [Avatar] Channel  [Subscribe│                                  │
│           Subscribers count] │                                  │
│  ─────────────────────────   │                                  │
│  Description (collapsible)   │                                  │
│  ─────────────────────────   │                                  │
│  Comments (N)                │                                  │
│  [Add comment input]         │                                  │
│  [CommentItem] × paginated   │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

APIs used:
- `GET /api/v1/videos/:videoId` — video details, owner, like count, subscription
- `POST /api/v1/likes/v/:videoId` — toggle like
- `POST /api/v1/subscriptions/:channelId` — toggle subscribe
- `GET /api/v1/comments/:videoId?page=1&limit=10` — paginated comments
- `POST /api/v1/comments/:videoId` — add comment

---

### 6.4 ChannelPage `/channel/:username`

```
┌─────────────────────────────────────────────────────┐
│  [Cover Image — full width, h-48, object-cover]      │
├─────────────────────────────────────────────────────┤
│  [Avatar 80px]  Username  Fullname                   │
│                 X subscribers · X channels           │
│                 [Subscribe Button]                   │
├─────────────────────────────────────────────────────┤
│  [Videos] [Playlists] [Tweets]  ← Tab navigation    │
├─────────────────────────────────────────────────────┤
│  Tab content: video grid / playlist grid / tweet list│
└─────────────────────────────────────────────────────┘
```

APIs used:
- `GET /api/v1/users/c/:username` — channel profile + subscriber counts
- `GET /api/v1/videos?userId=:id` — channel's videos
- `GET /api/v1/playlists/:userId` — channel playlists
- `GET /api/v1/tweets/?` — user tweets (show on channel)

---

### 6.5 SearchPage `/search?q=`

```
┌─────────────────────────────────────────────────────┐
│  "Results for "query"" — N results                   │
│  Filter: [Relevance ▼] [Upload Date ▼] [Views ▼]   │
├─────────────────────────────────────────────────────┤
│  [VideoCard horizontal] ← wider, title + description │
│  [VideoCard horizontal]                              │
│  [VideoCard horizontal]                              │
│  [Pagination or Load More]                           │
└─────────────────────────────────────────────────────┘
```

API: `GET /api/v1/videos?query=:q&sortBy=:sort&page=:page`

---

### 6.6 SubscriptionsPage `/subscriptions`

```
┌─────────────────────────────────────────────────────┐
│  Subscribed Channels                                 │
│  [ChannelCard] [ChannelCard] [ChannelCard]           │
│  (shows avatar, name, latest video thumbnail)        │
├─────────────────────────────────────────────────────┤
│  Latest from subscriptions — video grid              │
└─────────────────────────────────────────────────────┘
```

API: `GET /api/v1/subscriptions/c/:subscriberId`

---

### 6.7 LikedVideosPage `/liked`

Standard video grid layout with header "Liked Videos (N)".

API: `GET /api/v1/likes/videos`

---

### 6.8 WatchHistoryPage `/history`

Grouped by date (Today, Yesterday, This Week, Earlier).
Each group has a row of VideoCards.

API: `GET /api/v1/users/watch-history`

---

### 6.9 TweetsPage `/tweets`

```
┌─────────────────────────────────────────────────────┐
│  My Tweets                                           │
│  [Compose box — textarea + Post button]              │
├─────────────────────────────────────────────────────┤
│  [TweetCard]                                         │
│  Content · ❤ like count · [Edit] [Delete]            │
│  Username · Avatar · Time                            │
│  ─────────────────────────────────────────────────  │
│  [TweetCard] ...                                     │
└─────────────────────────────────────────────────────┘
```

APIs:
- `GET /api/v1/tweets?page=1&limit=10`
- `POST /api/v1/tweets/create-tweet`
- `PATCH /api/v1/tweets/t/:tweetId`
- `DELETE /api/v1/tweets/t/:tweetId`
- `POST /api/v1/likes/t/:tweetId`

---

### 6.10 PlaylistsPage `/playlists`

Grid of PlaylistCards showing name, description, video count, thumbnail mosaic.
"New Playlist" button opens a modal.

APIs:
- `GET /api/v1/playlists/:userId`
- `POST /api/v1/playlists`

---

### 6.11 PlaylistDetailPage `/playlists/:playlistId`

```
┌────────────────────────────────────────────────────┐
│  [Playlist thumbnail mosaic]  Name                  │
│                               Description           │
│                               N videos              │
│                               [Edit] [Delete]       │
├────────────────────────────────────────────────────┤
│  [VideoCard horizontal] with [Remove from Playlist] │
│  [VideoCard horizontal]                             │
└────────────────────────────────────────────────────┘
```

---

### 6.12 UploadVideoPage `/upload`

```
┌────────────────────────────────────────────────────┐
│  Upload Video                                       │
│                                                     │
│  [Drag & drop zone for video file]                  │
│  ──────────────────────────────────                 │
│  Title *              [Input]                       │
│  Description *        [Textarea]                    │
│  Thumbnail *          [Image upload zone]           │
│  ──────────────────────────────────                 │
│  [Cancel]             [Publish Video →]             │
└────────────────────────────────────────────────────┘
```

Upload progress bar shown during Cloudinary upload.

API: `POST /api/v1/videos/upload-video` (multipart/form-data)

---

### 6.13 DashboardPage `/dashboard`

```
┌────────────────────────────────────────────────────┐
│  Channel Dashboard                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Videos   │ │ Views    │ │ Likes    │ │Subs    │ │
│  │   12     │ │  45.2K   │ │  3.1K   │ │  892   │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
├────────────────────────────────────────────────────┤
│  Your Videos                    [Upload New Video]  │
│  ┌──────────────────────────────────────────────┐   │
│  │ Thumb │ Title     │ Views │ Likes │ Status │⋮│   │
│  │ Thumb │ Title     │ Views │ Likes │ Status │⋮│   │
│  │ Thumb │ Title     │ Views │ Likes │ Status │⋮│   │
│  └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

Status = Published / Draft toggle (toggle publish API)
Action menu (⋮): Edit, Delete

APIs:
- `GET /api/v1/dashboard/stats`
- `GET /api/v1/dashboard/videos`
- `PATCH /api/v1/videos/toggle-publish/:videoId`
- `DELETE /api/v1/videos/delete-video/:videoId`
- `PATCH /api/v1/videos/update-video/:videoId`

---

### 6.14 SettingsPage `/settings`

Three tabs: **Profile**, **Password**, **Appearance**

**Profile tab:**
- Full Name (text input)
- Email (text input)
- Avatar upload (click to replace, preview)
- Cover Image upload (click to replace, preview)
- Save Changes button

**Password tab:**
- Old Password
- New Password
- Confirm New Password
- Change Password button

APIs:
- `PATCH /api/v1/users/update-account`
- `PATCH /api/v1/users/avatar`
- `PATCH /api/v1/users/cover-image`
- `POST /api/v1/users/change-password`

---

### 6.15 LoginPage `/login`

```
┌──────────────────────────────────────┐
│              VideoTube               │  ← Logo, centered
│                                      │
│  Username or Email    [___________]  │
│  Password             [___________]  │
│                                      │
│           [Sign In →]                │
│                                      │
│     Don't have an account? Sign up   │
└──────────────────────────────────────┘
```

Clean centered card on `--bg-base`. No background image.

---

### 6.16 RegisterPage `/register`

```
┌──────────────────────────────────────┐
│              VideoTube               │
│                                      │
│  Full Name            [___________]  │
│  Username             [___________]  │
│  Email                [___________]  │
│  Password             [___________]  │
│                                      │
│  Avatar *             [Upload Zone]  │
│  Cover Image          [Upload Zone]  │
│                                      │
│           [Create Account →]         │
│                                      │
│        Already have account? Sign in │
└──────────────────────────────────────┘
```

---

## 7. Components Specification

### Button (ui/Button.jsx)

Variants: `primary`, `secondary`, `ghost`, `danger`
Sizes: `sm`, `md`, `lg`
States: default, hover, loading (spinner replaces text), disabled

```
primary  → bg-accent text-white hover:bg-accent-hover
secondary → bg-elevated text-primary border border-border
ghost    → transparent hover:bg-elevated text-secondary
danger   → bg-error/20 text-error hover:bg-error/30
```

### Input (ui/Input.jsx)

```
bg-elevated border border-border rounded-sm
focus: border-accent outline-none ring-0
placeholder: text-muted
```

### Avatar (ui/Avatar.jsx)

Props: `src`, `fallback` (initials), `size` (sm=24 md=32 lg=48 xl=80)
Fallback: initials with gradient bg

### VideoCard (video/VideoCard.jsx)

Props: `video` object (from API), `layout` (grid | horizontal)
Shows: thumbnail (lazy loaded), duration badge, title, channel avatar, views, date

### VideoSkeleton (video/VideoSkeleton.jsx)

Animated pulse skeleton matching VideoCard dimensions for loading states.

### CommentItem (comment/CommentItem.jsx)

Shows: avatar, username, timestamp, content, like button + count.
If owner → show edit/delete actions (appear on hover).
Inline edit: replaces content with textarea.

### SubscribeButton (channel/SubscribeButton.jsx)

```
Unsubscribed → bg-accent text-white "Subscribe"
Subscribed   → bg-elevated text-secondary "Subscribed ✓"
              → on hover changes to "Unsubscribe" text in red
```

---

## 8. API Layer

### 8.1 Axios Instance (`api/axiosInstance.js`)

```javascript
// Base config
baseURL: import.meta.env.VITE_API_BASE_URL  // "http://localhost:8000/api/v1"
withCredentials: true  // sends cookies automatically

// Request interceptor:
//   Attach Authorization: Bearer <accessToken> from authStore

// Response interceptor:
//   On 401 → call POST /users/refresh-token
//   Store new tokens → retry original request
//   On refresh failure → logout + redirect /login
```

### 8.2 Auth Flow

1. User logs in → tokens stored in HTTP-only cookies (backend handles)
2. Also store `user` object + `accessToken` in Zustand authStore (in-memory)
3. `accessToken` used as `Authorization: Bearer` header for all requests
4. On 401 → interceptor auto-refreshes using `refreshToken` cookie
5. On logout → call `POST /users/logout` → clear store + redirect

### 8.3 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 9. State Management

### authStore (Zustand)

```javascript
{
  user: null,           // { _id, username, fullname, email, avatar, coverImage }
  accessToken: null,
  isLoggedIn: false,
  setUser(user, token),
  clearUser(),
  updateUser(partial),  // for settings updates
}
```

### uiStore (Zustand)

```javascript
{
  sidebarOpen: true,
  toggleSidebar(),
  addToPlaylistModal: { open: false, videoId: null },
  openAddToPlaylist(videoId),
  closeAddToPlaylist(),
}
```

---

## 10. Key UX Patterns

### Pagination Strategy

- **Video grids (Home, Search, Channel):** Infinite scroll using `IntersectionObserver` + TanStack Query `useInfiniteQuery`
- **Comments:** "Load more" button at the bottom
- **Tweets, Playlists:** Paginated with prev/next or load more

### Optimistic Updates

- Like/unlike video: update count immediately, revert on error
- Subscribe/unsubscribe: toggle state immediately
- Add/delete comment: add to top of list immediately
- Tweet CRUD: update list immediately

### Protected Route Wrapper

```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```
If not logged in → redirect to `/login` with `returnTo` param.
After login → redirect back to original destination.

### Token Refresh

Handled silently in Axios interceptor. User never sees a logout unless refresh token is expired (10 days).

### Loading States

Every data-fetching component shows a skeleton, never a blank screen.

### Error States

Inline error messages using a reusable `<ErrorMessage>` component.
Network/server errors shown as toast notifications.

---

## 11. Responsive Behavior

| Breakpoint | Sidebar | Grid columns | Adjustments |
|---|---|---|---|
| < 640px (mobile) | Hidden (hamburger toggle) | 1 col | Compact navbar, bottom nav |
| 640–1024px (tablet) | Icon-only (72px) | 2 col | |
| 1024–1280px | Full (240px) | 3 col | |
| > 1280px | Full (240px) | 4 col | |

---

## 12. File Naming Conventions

- Components: `PascalCase.jsx`
- Pages: `PascalCase.jsx` (suffix `Page`)
- Hooks: `camelCase.js` (prefix `use`)
- Utilities: `camelCase.js`
- API files: `camelCase.api.js`
- Store files: `camelCase.store.js`

---

## 13. Implementation Order

Build in this sequence to maintain a working app at each step:

**Phase 1 — Foundation**
1. Vite + React project setup
2. Tailwind CSS config with custom colors/fonts
3. Axios instance + env setup
4. authStore + uiStore
5. Router setup with route tree
6. App shell: Navbar + Sidebar layout

**Phase 2 — Auth**
7. LoginPage + RegisterPage (forms, validation)
8. Auth API (login, register, logout, refresh)
9. ProtectedRoute wrapper
10. Avatar dropdown menu

**Phase 3 — Core Video**
11. VideoCard + VideoSkeleton components
12. HomePage (grid + infinite scroll)
13. SearchPage (query params, filtering)
14. VideoPage (player, likes, subscribe)

**Phase 4 — Social**
15. ChannelPage (cover, tabs, stats)
16. SubscriptionsPage
17. Comments (list, add, edit, delete, like)
18. LikedVideosPage + WatchHistoryPage

**Phase 5 — Content Creation**
19. TweetsPage (CRUD + likes)
20. PlaylistsPage + PlaylistDetailPage
21. UploadVideoPage (with progress)
22. DashboardPage (stats + video table)

**Phase 6 — Settings & Polish**
23. SettingsPage (profile, password, avatar)
24. Skeleton loaders for all pages
25. Error boundaries + empty states
26. Responsive adjustments
27. Micro-animations + transitions

---

## 14. Empty States

Every list page needs an empty state component:

- No videos found → "Nothing here yet" with an icon and CTA
- No subscriptions → "Subscribe to channels to see their videos"
- No liked videos → "Like videos to see them here"
- No history → "Videos you watch will appear here"
- No tweets → "Share your thoughts"
- No playlists → "Create your first playlist"

---

## 15. Notes & Constraints

- Backend CORS is set to `CLIENT_URL` (default `http://localhost:5173`) — Vite's default port matches.
- All protected routes require the `accessToken` cookie or `Authorization: Bearer` header.
- File uploads use `multipart/form-data`. Axios will handle this automatically with `FormData`.
- Avatar is stored as a plain URL string in the user model. Cover image is also a URL string.
- Video `thumbnail` and `videoFile` are nested objects `{ url, public_id }` — always use `.url` to render.
- The `ispublished` field in the video model is lowercase (not `isPublished`) — handle carefully.
- `watchhistory` is also lowercase in the user model.
- Pagination response shape: `{ docs, totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage }`.
- Dashboard `getChannelVideos` returns `createdAt` as a date parts object `{ year, month, day }` — reconstruct for display.
