# YT Project — Codebase Reference

A YouTube-like backend REST API (**VideoTube**) built with Node.js, Express, MongoDB, and Cloudinary.

**Base URL:** `/api/v1`  
**Database:** MongoDB — `videotube`  
**Author:** Usama Ikram

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack & Libraries](#tech-stack--libraries)
3. [Project Structure](#project-structure)
4. [Setup & Environment](#setup--environment)
5. [Architecture](#architecture)
6. [Database Models](#database-models)
7. [Utilities & Middlewares](#utilities--middlewares)
8. [Controllers](#controllers)
9. [API Endpoints](#api-endpoints)
10. [Authentication](#authentication)
11. [File Upload Flow](#file-upload-flow)
12. [Response Format](#response-format)

---

## Overview

| Area | What it does |
|---|---|
| Users | Register, login, JWT auth, profile & avatar updates, channel profile, watch history |
| Videos | Upload to Cloudinary, list/search/sort, view tracking, publish toggle, CRUD |
| Comments | Paginated comments on videos with like counts |
| Likes | Toggle likes on videos, comments, tweets; fetch liked videos |
| Subscriptions | Subscribe/unsubscribe channels, list subscribers & subscribed channels |
| Tweets | CRUD tweets for logged-in user with like counts |
| Playlists | CRUD playlists, add/remove videos |
| Dashboard | Channel stats and video list for the logged-in creator |
| Health Check | Server status endpoint |

---

## Tech Stack & Libraries

### Runtime & Framework

| Tool | Version | Purpose |
|---|---|---|
| Node.js | — | JavaScript runtime |
| Express | ^5.2.1 | Web framework, routing, middleware |
| ES Modules | `"type": "module"` | Native `import/export` syntax |

### Database

| Library | Purpose |
|---|---|
| mongoose | MongoDB ODM — schemas, models, queries, aggregation |
| mongoose-aggregate-paginate-v2 | Paginated aggregation on Video, Comment, Subscription, Tweet, Playlist |

### Auth & Security

| Library | Purpose |
|---|---|
| bcrypt | Password hashing (pre-save hook on User) |
| jsonwebtoken | Access & refresh JWT generation and verification |
| cookie-parser | Parse HTTP cookies for token storage |

### File Handling

| Library | Purpose |
|---|---|
| multer | Parse `multipart/form-data`, save uploads to `public/temp/` |
| cloudinary | Permanent cloud storage for images and videos |
| fs (built-in) | Delete local temp files after Cloudinary upload |

### Other

| Library | Purpose |
|---|---|
| dotenv | Load `.env` variables into `process.env` |
| cors | Allow cross-origin requests from `CLIENT_URL` with credentials |
| nodemon | Dev server auto-restart (`npm run dev`) |
| prettier | Code formatting |

---

## Project Structure

```
yt-project/
├── public/temp/                 # Multer temp upload directory
├── src/
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── playlist.controller.js
│   │   ├── dashboard.controller.js
│   │   └── healthcheck.controller.js
│   ├── db/index.js              # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js   # verifyJWT
│   │   └── multer.middleware.js # upload
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   └── playlist.model.js
│   ├── routes/                  # One route file per resource
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── Cloudinary.js
│   ├── app.js                   # Express config & route mounting
│   ├── constants.js             # DB_NAME = "videotube"
│   └── index.js                 # Entry point
├── .env                         # Not committed
├── package.json
└── CODEBASE.md
```

---

## Setup & Environment

```bash
npm install
npm run dev        # nodemon + dotenv, starts on PORT (default 8000)
```

**Required `.env` variables:**

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
```

---

## Architecture

### Entry Point — `src/index.js`

1. Load `.env` **before** any other imports (ES modules run imports first)
2. Connect to MongoDB via `connectDB()`
3. Start Express server on `process.env.PORT || 8000`

### Database — `src/db/index.js`

- Connects to `${MONGODB_URI}/${DB_NAME}` where `DB_NAME = "videotube"`
- Exits process on connection failure

### App — `src/app.js`

| Middleware | Config |
|---|---|
| cors | `origin: CLIENT_URL`, `credentials: true` |
| express.json | limit 16kb |
| express.urlencoded | limit 16kb, extended |
| express.static | serves `public/` |
| cookieParser | enables `req.cookies` |

**Mounted routes:**

| Prefix | Router |
|---|---|
| `/api/v1/users` | userRouter |
| `/api/v1/videos` | VideoRouter |
| `/api/v1/comments` | commentRouter |
| `/api/v1/likes` | likeRouter |
| `/api/v1/tweets` | tweetRouter |
| `/api/v1/subscriptions` | subscriptionRouter |
| `/api/v1/playlists` | playlistRouter |
| `/api/v1/healthcheck` | healthcheckRouter |
| `/api/v1/dashboard` | dashboardRouter |

---

## Database Models

### User

| Field | Type | Notes |
|---|---|---|
| username, email, fullname | String | Unique username/email; indexed |
| avatar, coverImage | String | Cloudinary URLs |
| watchhistory | [ObjectId → Video] | Updated when user views a video |
| password | String | Bcrypt hashed on save |
| refreshToken | String | Set on login, cleared on logout |

**Methods:** `isPasswordCorrect()`, `generateAccessToken()`, `generateRefreshToken()`

### Video

| Field | Type | Notes |
|---|---|---|
| title, description | String | Required |
| videoFile, thumbnail | `{ url, public_id }` | Cloudinary objects |
| duration | Number | From Cloudinary |
| views | Number | Default 0; `$inc` on each view |
| ispublished | Boolean | Default true |
| owner | ObjectId → User | |

Uses `mongooseAggregatePaginate` plugin.

### Comment

| Field | Type | Notes |
|---|---|---|
| content | String | Required |
| video | ObjectId → Video | |
| owner | ObjectId → User | |

### Like

| Field | Type | Notes |
|---|---|---|
| video / comment / tweet | ObjectId | One target per document |
| likedBy | ObjectId → User | |

### Subscription

| Field | Type | Notes |
|---|---|---|
| subscriber | ObjectId → User | Who subscribed |
| channel | ObjectId → User | Channel subscribed to |

### Tweet

| Field | Type | Notes |
|---|---|---|
| owner | ObjectId → User | |
| content | String | Required |

### Playlist

| Field | Type | Notes |
|---|---|---|
| name, description | String | Required |
| videos | [ObjectId → Video] | |
| owner | ObjectId → User | |

All models include `createdAt` / `updatedAt` timestamps (except Like has timestamps too).

---

## Utilities & Middlewares

### Utils

| File | Purpose |
|---|---|
| `asyncHandler.js` | Wraps async controllers — catches errors and forwards to `next(err)` |
| `ApiError.js` | Custom error class with `statusCode`, `message`, `success: false` |
| `ApiResponse.js` | Standard success wrapper with `statusCode`, `data`, `message`, `success` |
| `Cloudinary.js` | `uploadToCloudinary()` — upload & delete temp file; `deleteOnCloudinary()` — remove from cloud |

### Middlewares

| File | Export | Purpose |
|---|---|---|
| `auth.middleware.js` | `verifyJWT` | Reads token from cookie or `Authorization: Bearer`; attaches `req.user` |
| `multer.middleware.js` | `upload` | Saves files to `public/temp/`; used as `upload.single()` or `upload.fields()` |

---

## Controllers

| Controller | Key Functions |
|---|---|
| `user.controller.js` | register, login, logout, refresh token, change password, get/update profile, avatar, cover image, channel profile, watch history |
| `video.controller.js` | publish, getAll (search/sort/filter/paginate), getById (+ views & watch history), delete, toggle publish, update content |
| `comment.controller.js` | get video comments (paginated), add, update, delete |
| `like.controller.js` | toggle video/comment/tweet like, get liked videos |
| `subscription.controller.js` | toggle subscribe, get subscribers, get subscribed channels |
| `tweet.controller.js` | create, update, delete, get user tweets (paginated) |
| `playlist.controller.js` | create, update, delete, get by user/id, add/remove video |
| `dashboard.controller.js` | channel stats (subscribers, likes, views, videos), channel videos list |
| `healthcheck.controller.js` | server status check |

---

## API Endpoints

> **Auth:** Routes marked 🔒 require `verifyJWT` (cookie `accessToken` or `Authorization: Bearer <token>`)

### Health Check

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/healthcheck` | — | Server running check |

### Users — `/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register (multipart: avatar, coverImage) |
| POST | `/login` | — | Login |
| POST | `/logout` | 🔒 | Logout |
| POST | `/refresh-token` | — | Refresh access token |
| POST | `/change-password` | 🔒 | Change password |
| GET | `/current-user` | 🔒 | Current user |
| PATCH | `/update-account` | 🔒 | Update fullname, email |
| PATCH | `/avatar` | 🔒 | Update avatar (file) |
| PATCH | `/cover-image` | 🔒 | Update cover image (file) |
| GET | `/c/:username` | 🔒 | Channel profile + subscriber counts |
| GET | `/watch-history` | 🔒 | User watch history |

### Videos — `/videos` (all 🔒)

| Method | Path | Description |
|---|---|---|
| GET | `/` | List published videos — query: `page`, `limit`, `query`, `sortBy`, `sortType`, `userId` |
| POST | `/upload-video` | Upload video + thumbnail (multipart) |
| GET | `/:videoId` | Get video; increments views; adds to watch history |
| DELETE | `/delete-video/:videoId` | Delete video (owner) |
| PATCH | `/toggle-publish/:videoId` | Toggle publish status (owner) |
| PATCH | `/update-video/:videoId` | Update title/description/thumbnail (owner) |

### Comments — `/comments` (all 🔒)

| Method | Path | Description |
|---|---|---|
| GET | `/:videoId` | Paginated comments — query: `page`, `limit` |
| POST | `/:videoId` | Add comment |
| PATCH | `/c/:commentId` | Update comment (owner) |
| DELETE | `/c/:commentId` | Delete comment (owner) |

### Likes — `/likes` (all 🔒)

| Method | Path | Description |
|---|---|---|
| POST | `/v/:videoId` | Toggle video like |
| POST | `/c/:commentId` | Toggle comment like |
| POST | `/t/:tweetId` | Toggle tweet like |
| GET | `/videos` | Get liked videos |

### Subscriptions — `/subscriptions` (all 🔒)

| Method | Path | Description |
|---|---|---|
| POST | `/:channelId` | Toggle subscribe/unsubscribe |
| GET | `/s/:channelId` | Paginated subscribers — query: `page`, `limit` |
| GET | `/c/:subscriberId` | Paginated subscribed channels |

### Tweets — `/tweets` (all 🔒)

| Method | Path | Description |
|---|---|---|
| GET | `/` | User tweets (paginated) — query: `page`, `limit` |
| POST | `/create-tweet` | Create tweet |
| PATCH | `/t/:tweetId` | Update tweet (owner) |
| DELETE | `/t/:tweetId` | Delete tweet (owner) |

### Playlists — `/playlists` (all 🔒)

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create playlist |
| GET | `/:userId` | User playlists (paginated) |
| GET | `/p/:playlistId` | Get playlist by ID |
| PATCH | `/p/:playlistId` | Update playlist (owner) |
| DELETE | `/p/:playlistId` | Delete playlist (owner) |
| PATCH | `/p/:playlistId/videos/:videoId` | Add video to playlist |
| DELETE | `/p/:playlistId/videos/:videoId` | Remove video from playlist |

### Dashboard — `/dashboard` (all 🔒)

| Method | Path | Description |
|---|---|---|
| GET | `/stats` | `{ totalSubscribers, totalLikes, totalViews, totalVideos }` |
| GET | `/videos` | Channel videos with likes count |

---

## Authentication

Dual-token JWT strategy:

| Token | Expiry | Stored | Usage |
|---|---|---|---|
| Access Token | 1d | Cookie + response body | Every protected request |
| Refresh Token | 10d | Cookie + DB (`user.refreshToken`) | Renew access token |

**Flow:**

```
Login → generate both tokens → save refreshToken in DB → set httpOnly cookies
Protected route → verifyJWT reads cookie or Bearer header → sets req.user
Token expired → POST /refresh-token → verify refresh token vs DB → issue new pair
Logout → clear refreshToken in DB → clear cookies
```

Cookie options: `{ httpOnly: true, secure: true }`

---

## File Upload Flow

```
Client (multipart/form-data)
  → Multer saves to public/temp/
  → Controller reads req.file / req.files path
  → uploadToCloudinary() uploads to Cloudinary
  → fs.unlinkSync() removes local temp file
  → Cloudinary URL (and public_id) saved to MongoDB
```

On delete/update: `deleteOnCloudinary(public_id)` removes old assets from Cloudinary.

---

## Response Format

**Success:**

```json
{ "statusCode": 200, "data": {}, "message": "...", "success": true }
```

**Error:**

```json
{ "statusCode": 400, "message": "...", "success": false, "errors": [] }
```

**Paginated** (via `aggregatePaginate`):

```json
{
  "docs": [],
  "totalDocs": 0,
  "limit": 10,
  "page": 1,
  "totalPages": 0,
  "hasNextPage": false,
  "hasPrevPage": false
}
```

---

## Notes

- `dotenv.config()` must run in `index.js` before other imports so Cloudinary and JWT secrets load correctly.
- Aggregation pipelines use `new mongoose.Types.ObjectId(id)` for `$match` comparisons.
- Pass an **Aggregate object** (not awaited) to `Model.aggregatePaginate()` — e.g. `Playlist.aggregate([...])`, not `await Playlist.aggregate([...])`.
- For full API examples and repo-level docs, see the root [`README.md`](../README.md).
