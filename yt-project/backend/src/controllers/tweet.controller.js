
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js"
import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js";

const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    const aggregateTweets = Tweet.aggregate([
        {
            // No $match — fetch all tweets from all users
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
                pipeline: [
                    {
                        $project: { likedBy: 1 }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                ownerDetails: { $first: "$ownerDetails" },
                isLiked: req.user?._id ? {
                    $cond: {
                        if: { $in: [req.user._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                } : false
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                ownerDetails: 1,
                isLiked: 1
            }
        }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const tweets = await Tweet.aggregatePaginate(aggregateTweets, options)

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "All tweets fetched successfully"))
})

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body

    if (!content) {
        throw new ApiError(
            400, "content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(500, "Error while creating tweet")
    }

    return res.status(201)
        .json(new ApiResponse(201, tweet, "tweet created successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    //chk for tweet id
    if (!tweetId) {
        throw new ApiError(404, "Tweet Id is required")
    }
    //validate tweet it
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }
    //check for contentF
    if (!content) {
        throw new ApiError(400, "content is required")
    }
    //find tweet from db
    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    //validate tweet owner
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "Only owner can update the tweet")
    }

    //update tweet
    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )
    if (!newTweet) {
        throw new ApiError(
            500, "Error while updating tweet")
    }

    return res.status(200)
        .json(new ApiResponse(200, newTweet, "tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    //chk for tweet id
    if (!tweetId) {
        throw new ApiError(404, "Tweet Id is required")
    }
    //validate tweet id
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    //find tweet from db
    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    //validate tweet owner
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "Only owner can delete the tweet")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        throw new ApiError(
            500, "Error while deleting tweet")
    }

    // delete tweet likes 
    Like.deleteMany({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res.status(200)
        .json(new ApiResponse(200, deletedTweet, "tweet deleted successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query
    const { uId } = req.params

    // uId from params (channel page) or fall back to logged-in user
    const targetUserId = uId ?? req.user?._id

    if (!targetUserId) {
        throw new ApiError(400, "userId is required")
    }

    const aggregateTweets = Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(targetUserId)
            }
        },
        {
            // Stage 2: join with "users" collection to get owner's profile info
            // localField "owner" in Tweet matches foreignField "_id" in User
            // result stored in "ownerDetails" array
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        // only return these fields from the user document
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullname: 1
                        },
                    },
                ],
            },
        },
        {
            // Stage 3: join with "likes" collection to get all likes on each tweet
            // localField "_id" in Tweet matches foreignField "tweet" in Like
            // result stored in "likes" array
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
                pipeline: [
                    {

                        // only return likedBy field from each like document
                        $project: {
                            likedBy: 1
                        },
                    },
                ],
            },
        },
        {
            // Stage 4: compute extra fields from the joined data
            $addFields: {
                // count total likes by getting size of the likes array
                likesCount: {
                    $size: "$likes",
                },
                // ownerDetails is an array from $lookup, $first picks the single object
                ownerDetails: {
                    $first: "$ownerDetails"
                },
                // check if the logged-in user's _id exists inside likes.likedBy array
                // $in returns true/false → used with $cond to set isLiked boolean
                isLiked: req.user?._id ? {
                    $cond: {
                        if: { $in: [req.user._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    },
                } : false,
            },
        },
        {
            // Stage 5: sort tweets newest first
            $sort: {
                createdAt: -1
            }
        },
        {
            // Stage 6: shape the final output — only expose needed fields
            // _id is excluded by default unless added here
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                ownerDetails: 1,
                isLiked: 1

            },
        },
    ]);
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const tweets = await Tweet.aggregatePaginate(
        aggregateTweets,
        options

    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweets, "User tweets fetched successfully")
        )

})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets,
    getAllTweets
}