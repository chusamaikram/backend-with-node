import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js"
import { User } from "../models/user.model.js"

// toggleSubscribe
//getSubscribers
//getSubscribedChannels

const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel Id")
    }

    const isSubscribed = await Subscription.findOne(
        {
            channel: channelId,
            subscriber: req.user?._id
        }
    )

    if (isSubscribed) {
        await Subscription.findByIdAndDelete(isSubscribed?._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { subscribed: false }, "un-subscribed successfuly")
            )
    }

    await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribed: true }, "channel subscribed successfully")
        )


})

const getSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const { page = 1, limit = 20 } = req.query

    if (!channelId) {
        throw new ApiError(400, "please provide channel id ")
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel id")
    }

    const aggregateSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribedToSubscriber"
                        }
                    },
                    {
                        $addFields: {
                            subscribedToSubscriber: {
                                $cond: {
                                    if: {
                                        $in: [
                                            new mongoose.Types.ObjectId(channelId),
                                            "$subscribedToSubscriber.subscriber"
                                        ],
                                    },
                                    then: true,
                                    else: false
                                },
                            },
                            subscribersCount: {
                                $size: "$subscribedToSubscriber"
                            },
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                            subscribedToSubscriber: 1,
                            subscribersCount: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$subscribers"
        },
        {
            $project: {
                _id: 0,
                subscribers: 1

            },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }

    const subscribers = await Subscription.aggregatePaginate(
        aggregateSubscribers,
        options
    )

    if (!channels) {
        throw new ApiError(400, "error while fetching subscribers")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, subscribers, "subscribers fetched successfully")
        )
})

const getSubscribedChannel = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params
    const { page = 1, limit = 20 } = req.query

    if (!subscriberId) {
        throw new ApiError(400, "please provide subscriber id")
    }

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "invalid subscriber id")
    }

    const aggregateSubscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannel",
                pipeline: [
                    {
                        $lookup: {
                            from: "videos",
                            localField: "_id",
                            foreignField: "owner",
                            as: "videos"
                        },
                    },
                    {
                        $addFields: {
                            latestVideos: {
                                $last: "$videos"
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$subscribedChannel"
        },
        {
            $project: {
                _id: 0,
                subscribedChannel: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    latestVideos: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        "thumbnail.url": 1,
                        "videoFile.url": 1,
                        owner: 1,
                        duration: 1,
                        views: 1,
                        createdAt: 1,
                    },
                },
            },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    },
    const subscribedChannels = await Subscription.aggregatePaginate(
        aggregateSubscribedChannels,
        options
    )

    if (!subscribedChannels) {
        throw new ApiError(400, "error while fetching subcribed channels")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscribedChannels, "subscribed channels fetched successfully")
        )

})

export {
    toggleSubscription,
    getSubscribers,
    getSubscribedChannel
}