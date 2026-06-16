import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary, deleteOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

//method for generate access and refresh token 

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")

    }

}

const registerUser = asyncHandler(async (req, res) => {


    const { fullname, email, password, username, } = req.body

    //validation
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if already exist
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist with this email or username")
    }

    //chk for avatar and cover image

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocal = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "upload avatar")
    }

    // upload them to cloudinary 

    const avatarCloud = await uploadToCloudinary(avatarLocalPath)
    const coverImageCloud = await uploadToCloudinary(coverImageLocal)

    if (!avatarCloud) {
        throw new ApiError(400, "Avatar file is required")
    }

    //create user object

    const user = await User.create({
        fullname,
        avatar: avatarCloud.url,
        coverImage: coverImageCloud?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //remove password and refresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "User registration failed")
    }

    // return api response
    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        )
}
)

const loginUser = asyncHandler(async (req, res) => {

    // req body sy data nikalo 
    const { username, email, password } = req.body

    //chk for username
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    //find user in db 
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    //check password 

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    //generate access and refresh token

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    //send in cookies

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User loggen in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used")
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "access token refreshed"
                )
            )
    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")

    }



})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body


    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "password changed successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
            }
        },
        {
            returnDocument: 'after'  // same as , new : true
        }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully ")
        )


})


const updateUserAvatar = asyncHandler(async (req, res) => {

    const localAvatar = req.file?.path

    if (!localAvatar) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // get current user to extract old avatar public_id before overwriting
    const currentUser = await User.findById(req.user?._id)

    const avatar = await uploadToCloudinary(localAvatar)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    // delete old avatar from cloudinary after new one is uploaded successfully
    // extract public_id from url: https://res.cloudinary.com/<cloud>/image/upload/v123/<public_id>.jpg
    if (currentUser.avatar) {
        const oldAvatarPublicId = currentUser.avatar.split("/").pop().split(".")[0]
        await deleteOnCloudinary(oldAvatarPublicId, "image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { returnDocument: "after" }   // same as new : true but it is deprecated now. 
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar updated successfully")
        )
})
const updateUserCoverImage = asyncHandler(async (req, res) => {

    const localImage = req.file?.path

    if (!localImage) {
        throw new ApiError(400, "Cover image is missing")
    }

    // get current user to extract old cover image public_id before overwriting
    const currentUser = await User.findById(req.user?._id)

    const coverImage = await uploadToCloudinary(localImage)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading Cover image")
    }

    // delete old cover image from cloudinary after new one is uploaded successfully
    if (currentUser.coverImage) {
        const oldCoverPublicId = currentUser.coverImage.split("/").pop().split(".")[0]
        await deleteOnCloudinary(oldCoverPublicId, "image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { returnDocument: 'after' }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "Subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "SubscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$Subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$SubscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [new mongoose.Types.ObjectId(req.user?._id), "$Subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                email: 1

            }
        }
    ])

    console.log("channels data : ", channel)

    if (!channel || channel.length === 0) {
        throw new ApiError(404, "channel does not exist.")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, channel[0], "user channel fetched successfully ")
        )
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }

                    }
                ]
            }

        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(200, user[0].watchHistory, "watch history fetched successfully")
        )

})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} 