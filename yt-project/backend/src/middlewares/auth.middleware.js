import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

// Required auth — blocks request if no valid token
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

/**
 * Optional auth — attaches req.user if a valid token is present,
 * but does NOT block the request if there is no token.
 * Use this on public routes that need to know who the user is
 * (e.g. to compute isSubscribed, isLiked) without requiring login.
 */
export const optionalVerifyJWT = async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) return next() // no token — continue as guest

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (user) req.user = user
    } catch {
        // invalid or expired token — continue as guest, don't block
    }
    next()
}