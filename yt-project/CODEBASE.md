# YT Project — Codebase Documentation

A YouTube-like backend REST API built with Node.js, Express, MongoDB, and Cloudinary.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Entry Point & Server Startup](#entry-point--server-startup)
3. [Database Connection](#database-connection)
4. [App Configuration](#app-configuration)
5. [Libraries Used](#libraries-used)
6. [Models](#models)
7. [Utilities](#utilities)
8. [Middlewares](#middlewares)
9. [Controllers](#controllers)
10. [Routes](#routes)
11. [File Upload Flow](#file-upload-flow)
12. [Authentication Flow](#authentication-flow)
13. [API Endpoints Reference](#api-endpoints-reference)

---

## Project Structure

```
yt-project/
├── public/
│   └── temp/              ← multer saves uploaded files here temporarily
├── src/
│   ├── controllers/
│   │   └── user.controller.js
│   ├── db/
│   │   └── index.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   └── subscription.model.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── Cloudinary.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .env
└── package.json
```

---

## Entry Point & Server Startup

**File:** `src/index.js`

```js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });   // MUST be first before any other import

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => app.listen(process.env.PORT || 8000))
    .catch((err) => console.log("db connection failed"))
```

**Why dotenv is first:**
ES modules execute all `import` statements before any code runs. If `dotenv.config()` is placed after imports, files like `Cloudinary.js` will already have run `cloudinary.config()` with `undefined` values since `.env` wasn't loaded yet. Placing `dotenv.config()` before all other imports ensures every file gets the correct environment variables.

---

## Database Connection

**File:** `src/db/index.js`

```js
const connectDB = async () => {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
}
```

- Uses `mongoose.connect()` to connect to MongoDB Atlas
- `DB_NAME` is imported from `constants.js` and is set to `"videotube"`
- Full connection string becomes: `mongodb+srv://<user>:<pass>@cluster.../videotube`
- On failure, calls `process.exit(1)` to stop the server — no point running without a DB

---

## App Configuration

**File:** `src/app.js`

```js
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(express.static("public"))
app.use(cookieParser())
```

| Middleware | Purpose |
|---|---|
| `cors` | Allows cross-origin requests from the frontend URL, with cookies enabled |
| `express.json` | Parses incoming JSON request bodies (limit 16kb) |
| `express.urlencoded` | Parses form-encoded data (HTML forms) |
| `express.static` | Serves files from the `public/` folder directly |
| `cookieParser` | Parses cookies from incoming requests so `req.cookies` works |

---

## Libraries Used

| Library | Purpose |
|---|---|
| `express` | Web framework — handles routing, middleware, request/response |
| `mongoose` | ODM for MongoDB — defines schemas, models, and queries |
| `dotenv` | Loads `.env` file variables into `process.env` |
| `bcrypt` | Hashes passwords before saving to DB, compares on login |
| `jsonwebtoken` | Creates and verifies JWT access/refresh tokens |
| `multer` | Handles `multipart/form-data` — saves uploaded files to disk |
| `cloudinary` | Cloud storage service — stores images/videos permanently |
| `cors` | Enables Cross-Origin Resource Sharing |
| `cookie-parser` | Parses HTTP cookies from requests |
| `mongoose-aggregate-paginate-v2` | Adds pagination support to MongoDB aggregation pipelines |

---

## Models

### User Model — `src/models/user.model.js`

Defines the structure of a user document in MongoDB.

**Schema Fields:**

| Field | Type | Details |
|---|---|---|
| `username` | String | Unique, lowercase, trimmed, indexed for fast search |
| `email` | String | Unique, lowercase, trimmed |
| `fullname` | String | Trimmed, indexed |
| `avatar` | String | Cloudinary URL — required |
| `coverImage` | String | Cloudinary URL — optional |
| `watchhistory` | [ObjectId] | Array of references to `Video` documents |
| `password` | String | Stored as bcrypt hash |
| `refreshToken` | String | Stored after login, cleared on logout |

**Pre-save Hook — Password Hashing:**
```js
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password, 10)
    next
})
```
Before every save, if the password field was changed, it hashes it using bcrypt with a salt round of 10. The `isModified` check prevents re-hashing on every save (e.g. when updating avatar).

**Custom Methods:**

`isPasswordCorrect(password)` — compares plain text password with the stored hash using `bcrypt.compare()`. Returns `true` or `false`.

`generateAccessToken()` — creates a short-lived JWT signed with `ACCESS_TOKEN_SECRET`. Payload contains `_id`, `username`, `email`, `fullname`. Expires based on `ACCESS_TOKEN_EXPIRY` (e.g. `1d`).

`generateRefreshToken()` — creates a long-lived JWT signed with `REFRESH_TOKEN_SECRET`. Payload only contains `_id`. Expires based on `REFRESH_TOKEN_EXPIRY` (e.g. `10d`).

---

### Video Model — `src/models/video.model.js`

**Schema Fields:**

| Field | Type | Details |
|---|---|---|
| `title` | String | Required |
| `description` | String | Required |
| `videoFile` | String | Cloudinary URL |
| `thumbnail` | String | Cloudinary URL |
| `duration` | Number | Comes from Cloudinary response |
| `views` | Number | Default 0 |
| `ispublished` | Boolean | Default true |
| `owner` | ObjectId | Reference to `User` |

Uses `mongooseAggregatePaginate` plugin — adds `.aggregatePaginate()` method to the model for paginated aggregation queries.

---

### Subscription Model — `src/models/subscription.model.js`

**Schema Fields:**

| Field | Type | Details |
|---|---|---|
| `subscriber` | ObjectId | The user who subscribed (ref: User) |
| `channel` | ObjectId | The user being subscribed to (ref: User) |

Both `subscriber` and `channel` reference the `User` model. Every subscription is a separate document. To count subscribers of a channel, you count documents where `channel = channelId`. To count who a user subscribed to, you count documents where `subscriber = userId`.

---

## Utilities

### asyncHandler — `src/utils/asyncHandler.js`

```js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
```

A higher-order function (a function that wraps another function). It wraps every controller so you don't need `try/catch` in every one. If the async controller throws an error, it catches it and passes it to Express's `next(err)` error handler automatically.

**Usage:**
```js
const registerUser = asyncHandler(async (req, res) => {
    // no try/catch needed — errors auto-forwarded to next()
})
```

---

### ApiError — `src/utils/ApiError.js`

```js
class ApiError extends Error {
    constructor(statusCode, message, errors = [], stack = "") {
        super(message)
        this.statusCode = statusCode
        this.success = false
        this.errors = errors
    }
}
```

Extends the built-in `Error` class to create structured error objects. Every thrown error in the app uses this so the response always has a consistent shape with `statusCode`, `message`, and `success: false`.

**Usage:**
```js
throw new ApiError(404, "User does not exist")
throw new ApiError(400, "All fields are required")
```

---

### ApiResponse — `src/utils/ApiResponse.js`

```js
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
```

Standardizes all successful API responses. Every `res.json()` in the app wraps data in this class so the frontend always gets a consistent shape.

**Usage:**
```js
res.status(200).json(new ApiResponse(200, userData, "User fetched successfully"))
```

---

### Cloudinary Utility — `src/utils/Cloudinary.js`

```js
const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"   // handles images, videos, etc.
        })
        fs.unlinkSync(localFilePath)  // delete local temp file after upload
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)  // delete local temp file even on failure
        return null
    }
}
```

- Takes a local file path (saved by multer in `public/temp/`)
- Uploads it to Cloudinary
- `resource_type: "auto"` means Cloudinary auto-detects if it's an image or video
- After upload (success or failure), deletes the local temp file using `fs.unlinkSync()`
- Returns the full Cloudinary response object (which contains `.url`, `.public_id`, `.duration`, etc.)
- Returns `null` on failure

---

## Middlewares

### Multer Middleware — `src/middlewares/multer.middleware.js`

```js
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/public/temp"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage })
```

Multer handles `multipart/form-data` requests (the only way to send files via HTTP). It intercepts the request before the controller runs and saves the file to disk.

- `destination` — where to save the file. `process.cwd()` returns the project root directory, so files go to `D:\Web Dev\backend\yt-project\public\temp\`
- `filename` — what to name the saved file. Uses the original filename from the upload
- `diskStorage` — saves to disk (alternative is `memoryStorage` which keeps in RAM)

**Two ways it's used in routes:**

`upload.fields([...])` — for multiple files with different field names (used in register):
```js
upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
])
// files accessible via req.files.avatar[0] and req.files.coverImage[0]
```

`upload.single("fieldname")` — for a single file (used in avatar/cover image update):
```js
upload.single("avatar")
// file accessible via req.file
```

---

### Auth Middleware — `src/middlewares/auth.middleware.js`

```js
export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    req.user = user
    next()
})
```

Protects routes that require login. It:
1. Looks for the access token in cookies (`req.cookies.accessToken`) OR in the `Authorization` header as `Bearer <token>`
2. Verifies the token using `jwt.verify()` with the secret key
3. Decodes the token payload to get `_id`
4. Fetches the user from DB (excluding password and refreshToken)
5. Attaches the user to `req.user` so controllers can access it
6. Calls `next()` to proceed to the controller

The `_` as second parameter means the `res` object is not used in this middleware.

---

## Controllers

**File:** `src/controllers/user.controller.js`

---

### generateAccessAndRefreshTokens (internal helper)

```js
const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { refreshToken, accessToken }
}
```

A reusable internal function (not exported). Generates both tokens, saves the refresh token to the DB, and returns both. `validateBeforeSave: false` skips schema validation (like required fields) since we're only updating `refreshToken`.

---

### registerUser

**Route:** `POST /api/v1/users/register`

**Steps:**
1. Extract `fullname`, `email`, `password`, `username` from `req.body`
2. Validate none of the fields are empty using `.some()` with `.trim()`
3. Check if user already exists in DB with same email or username using `$or` query
4. Get avatar file path from `req.files.avatar[0].path` (saved by multer)
5. Get cover image path from `req.files.coverImage[0].path` (optional)
6. Upload both to Cloudinary using `uploadToCloudinary()`
7. Create user in DB with `User.create()` using Cloudinary URLs for avatar/coverImage
8. Fetch the created user again with `.select("-password -refreshToken")` to exclude sensitive fields
9. Return `201` response with the user data

---

### loginUser

**Route:** `POST /api/v1/users/login`

**Steps:**
1. Extract `username`, `email`, `password` from `req.body`
2. Check at least one of username or email is provided
3. Find user in DB matching either username or email using `$or`
4. Call `user.isPasswordCorrect(password)` which uses `bcrypt.compare()`
5. Call `generateAccessAndRefreshTokens()` to get both tokens
6. Fetch user again without password and refreshToken
7. Set both tokens as HTTP-only cookies
8. Return `200` response with user data and both tokens in the body too (for mobile clients that can't use cookies)

**Cookie options:**
```js
const options = { httpOnly: true, secure: true }
```
- `httpOnly: true` — cookie cannot be accessed by JavaScript (`document.cookie`), prevents XSS attacks
- `secure: true` — cookie only sent over HTTPS

---

### logoutUser

**Route:** `POST /api/v1/users/logout` (protected)

**Steps:**
1. `verifyJWT` middleware runs first, attaches `req.user`
2. Finds user by `req.user._id` and sets `refreshToken` to `undefined` in DB
3. Clears both cookies from the browser
4. Returns `200` response

---

### refreshAccessToken

**Route:** `POST /api/v1/users/refresh-token`

Used when the access token expires. Instead of logging in again, the client sends the refresh token to get a new access token.

**Steps:**
1. Get refresh token from cookies or `req.body`
2. Verify it using `jwt.verify()` with `REFRESH_TOKEN_SECRET`
3. Find user by decoded `_id`
4. Compare incoming refresh token with the one stored in DB (prevents reuse of old tokens)
5. Generate new pair of tokens
6. Return new tokens in cookies and response body

---

### changeCurrentPassword

**Route:** `POST /api/v1/users/change-password` (protected)

1. Get `oldPassword` and `newPassword` from `req.body`
2. Find user by `req.user._id`
3. Verify old password using `isPasswordCorrect()`
4. Set `user.password = newPassword` and save — the pre-save hook will hash it automatically

---

### getCurrentUser

**Route:** `GET /api/v1/users/current-user` (protected)

Simply returns `req.user` which was already attached by `verifyJWT` middleware. No DB call needed.

---

### updateUserDetails

**Route:** `PATCH /api/v1/users/update-account` (protected)

Updates `fullname` and `email` using `findByIdAndUpdate()` with `$set`. Returns updated user without password.

---

### updateUserAvatar

**Route:** `PATCH /api/v1/users/avatar` (protected)

1. `verifyJWT` runs first, then `upload.single("avatar")` saves file to temp
2. Gets file path from `req.file.path` (single file uses `req.file`, not `req.files`)
3. Uploads to Cloudinary
4. Updates user's `avatar` field in DB with new Cloudinary URL

---

### updateUserCoverImage

**Route:** `PATCH /api/v1/users/cover-image` (protected)

Same flow as `updateUserAvatar` but for `coverImage` field.

---

### getUserChannelProfile

**Route:** `GET /api/v1/users/c/:username` (protected)

Uses MongoDB Aggregation Pipeline to get channel data with subscriber counts.

**Pipeline stages:**

```
$match      → find user by username
$lookup     → join subscriptions where channel = user._id  → gets all subscribers
$lookup     → join subscriptions where subscriber = user._id → gets all channels user subscribed to
$addFields  → calculate subscribersCount, channelsSubscribedToCount, isSubscribed
$project    → return only needed fields
```

`isSubscribed` checks if the currently logged-in user's `_id` exists in the `Subscribers` array using `$in`.

Result is `channel[0]` since aggregate returns an array.

---

### getWatchHistory

**Route:** `GET /api/v1/users/watch-history` (protected)

Uses a nested aggregation pipeline:

```
$match      → find current user by _id (must use new mongoose.Types.ObjectId() in aggregation)
$lookup     → join videos collection on watchhistory array
  └── nested $lookup → for each video, join users collection to get owner details
      └── $project   → only return fullname, username, avatar of owner
  └── $addFields     → replace owner array with first element ($first)
```

The nested pipeline inside `$lookup` is a sub-pipeline that runs for each matched video document.

---

## Routes

**File:** `src/routes/user.routes.js`  
**Base path:** `/api/v1/users`

| Method | Path | Middleware | Controller |
|---|---|---|---|
| POST | `/register` | `upload.fields(avatar, coverImage)` | `registerUser` |
| POST | `/login` | — | `loginUser` |
| POST | `/logout` | `verifyJWT` | `logoutUser` |
| POST | `/refresh-token` | — | `refreshAccessToken` |
| POST | `/change-password` | `verifyJWT` | `changeCurrentPassword` |
| GET | `/current-user` | `verifyJWT` | `getCurrentUser` |
| PATCH | `/update-account` | `verifyJWT` | `updateUserDetails` |
| PATCH | `/avatar` | `verifyJWT`, `upload.single("avatar")` | `updateUserAvatar` |
| PATCH | `/cover-image` | `verifyJWT`, `upload.single("coverImage")` | `updateUserCoverImage` |
| GET | `/c/:username` | `verifyJWT` | `getUserChannelProfile` |
| GET | `/watch-history` | `verifyJWT` | `getWatchHistory` |

---

## File Upload Flow

This is the complete journey of a file from the client to Cloudinary:

```
Client (Postman/Frontend)
    │
    │  POST /api/v1/users/register
    │  Content-Type: multipart/form-data
    │  Body: { fullname, email, password, username, avatar: <file>, coverImage: <file> }
    │
    ▼
Multer Middleware (upload.fields)
    │  Intercepts the multipart request
    │  Saves file to: D:\Web Dev\backend\yt-project\public\temp\cv.jpg
    │  Adds req.files = { avatar: [{ path, filename, size, ... }] }
    │
    ▼
registerUser Controller
    │  Reads: req.files.avatar[0].path  →  "D:\...\public\temp\cv.jpg"
    │
    ▼
uploadToCloudinary(localFilePath)
    │  Uploads file to Cloudinary servers
    │  Cloudinary returns: { url, public_id, duration, ... }
    │  Deletes local temp file using fs.unlinkSync()
    │
    ▼
User.create({ avatar: cloudinaryResponse.url })
    │  Saves the Cloudinary URL string to MongoDB
    │
    ▼
Response sent to client with user data
```

**Why two steps (local → Cloudinary)?**
Cloudinary's SDK needs a file path or URL to upload. Multer saves the file locally first, then we upload from local to Cloudinary, then delete the local copy. This keeps the server clean.

---

## Authentication Flow

### Login & Token Strategy

This project uses a dual-token strategy:

- **Access Token** — short-lived (1 day). Sent with every protected request. Used to identify the user.
- **Refresh Token** — long-lived (10 days). Stored in DB. Used only to generate a new access token when it expires.

```
Login
  │
  ├── Generate Access Token  (expires in 1d)
  ├── Generate Refresh Token (expires in 10d)
  ├── Save Refresh Token to DB (user.refreshToken)
  └── Send both tokens as httpOnly cookies + in response body

Protected Request
  │
  ├── Client sends Access Token in cookie or Authorization header
  ├── verifyJWT middleware verifies token
  ├── Attaches user to req.user
  └── Controller runs

Access Token Expired
  │
  ├── Client sends Refresh Token to POST /refresh-token
  ├── Server verifies refresh token
  ├── Compares with stored token in DB
  ├── Generates new Access Token + new Refresh Token
  └── Returns new tokens

Logout
  │
  ├── Remove refreshToken from DB (set to undefined)
  └── Clear both cookies from browser
```

### Why store Refresh Token in DB?

So you can invalidate it. On logout, the refresh token is deleted from DB. Even if someone has the token, it won't match the DB anymore and will be rejected.

---

## API Endpoints Reference

### Register
```
POST /api/v1/users/register
Content-Type: multipart/form-data

Body (form-data):
  fullname    → text
  email       → text
  password    → text
  username    → text
  avatar      → file (required)
  coverImage  → file (optional)
```

### Login
```
POST /api/v1/users/login
Content-Type: application/json

Body:
{
  "username": "usama1124",   // or email
  "password": "password123"
}
```

### Logout
```
POST /api/v1/users/logout
Authorization: Bearer <accessToken>
```

### Refresh Token
```
POST /api/v1/users/refresh-token
Cookie: refreshToken=<token>
```

### Get Channel Profile
```
GET /api/v1/users/c/:username
Authorization: Bearer <accessToken>
```

### Update Avatar
```
PATCH /api/v1/users/avatar
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Body (form-data):
  avatar → file
```
