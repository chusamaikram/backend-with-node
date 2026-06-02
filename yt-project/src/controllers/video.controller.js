import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { uploadToCloudinary, deleteOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";


const publishVideo = asyncHandler(async (req, res) => {

    // get title and description from user
    const { title, description } = req.body;

    // validate title and description
    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    //check for local files
    const localThumbnail = req.files?.thumbnail?.[0]?.path
    const localVodeo = req.files?.videoFile?.[0]?.path

    //validate local files
    if (!localThumbnail) {
        throw new ApiError(400, "Thumbnail is required")
    }
    if (!localVodeo) {
        throw new ApiError(400, "Video file is required")
    }

    //upload files to cloudinary
    const thumbnailFile = await uploadToCloudinary(localThumbnail)
    const videoFile = await uploadToCloudinary(localVodeo)

    if (!videoFile) {
        throw new ApiError(500, "Video upload failed")
    }

    if (!thumbnailFile) {
        throw new ApiError(500, "Thumbnail upload failed")
    }
    //create video object
    const video = await Video.create({
        title,
        description,
        thumbnail: {
            url: thumbnailFile.url,
            public_id: thumbnailFile.public_id
        },
        videoFile: {
            url: videoFile.url,
            public_id: videoFile.public_id
        },
        duration: videoFile.duration,
        owner: req.user?._id,
        isPublished: true
    })
    // get video from db
    const uploadedVideo = await Video.findById(video._id);

    if (!uploadedVideo) {
        throw new ApiError(500, "Video upload failed")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, uploadedVideo, "video uploaded successfully"))


})

const getAllVideos = asyncHandler(async (req, res) => {

    // get query params from url
    // page = which page to show, limit = how many videos per page
    // query = search keyword, sortBy = field to sort on, sortType = asc or desc
    // userId = filter videos by a specific channel/user
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    // build the aggregation pipeline array
    const pipeline = []

    // STAGE 1 : $match — filter only published videos
    // ispublished matches the exact field name in video.model.js
    pipeline.push({
        $match: {
            ispublished: true
        }
    })

    // STAGE 2 : $match — if search query is provided, filter by title or description
    // $regex allows partial/case-insensitive search
    // $options: "i" means case insensitive ("Hello" matches "hello")
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        })
    }

    // STAGE 3 : $match — if userId is provided, filter videos by that channel owner
    // isValid() prevents crash if userId is not a valid ObjectId format
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    // STAGE 4 : $lookup — join users collection to get owner details
    // owner field in video.model.js is ObjectId ref to User
    // this replaces owner id with actual user data
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    // only return needed fields from user, not password/tokens
                    $project: {
                        fullname: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    })

    // STAGE 5 : $addFields — flatten owner array to a single object
    // $lookup always returns an array, $first picks the first element
    // also calculate totalViews across all videos using $sum
    pipeline.push({
        $addFields: {
            // flatten owner array [ {...} ] → { ... }
            owner: {
                $first: "$owner"
            }
        }
    })

    // STAGE 6 : $sort — sort videos by the given field and order
    // sortBy can be: "createdAt", "views", "duration", "title"
    // sortType: "asc" = oldest/lowest first, "desc" = newest/highest first
    // default: sort by createdAt descending (newest first)
    const sortOptions = {}
    if (sortBy) {
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1
    } else {
        sortOptions["createdAt"] = -1
    }
    pipeline.push({ $sort: sortOptions })

    // STAGE 7 : $project — define exactly which fields to return in response
    // covers every field from video.model.js
    pipeline.push({
        $project: {
            title: 1,           // from model
            description: 1,     // from model
            videoFile: 1,       // cloudinary url — from model
            thumbnail: 1,       // cloudinary url — from model
            duration: 1,        // number, comes from cloudinary — from model
            views: 1,           // number, default 0 — from model
            ispublished: 1,     // boolean — from model
            owner: 1,           // populated user object from $lookup
            createdAt: 1,       // from timestamps
            updatedAt: 1        // from timestamps
        }
    })

    // use aggregatePaginate plugin (from mongoose-aggregate-paginate-v2)
    // it takes the pipeline and applies skip/limit automatically based on page and limit
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    // Video.aggregatePaginate() runs the pipeline with pagination
    // returns: { docs, totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage }
    const result = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        options
    )

    if (!result.docs.length) {
        throw new ApiError(404, "No videos found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Videos fetched successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {

    // get videoId from url params
    const { videoId } = req.params

    // validate videoId is a proper MongoDB ObjectId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    // validate logged in user id
    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "Invalid userId")
    }

    const video = await Video.aggregate([
        // STAGE 1 : $match — find the specific video by its _id
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },

        // STAGE 2 : $lookup — join users collection to get owner details
        // owner field in video.model.js is ObjectId ref to User
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    // nested $lookup — get subscriber count of the owner channel
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    // calculate subscribersCount and isSubscribed for the owner
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            },
                            // check if the logged in user is subscribed to this channel
                            // must use ObjectId for correct $in comparison in aggregation
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            new mongoose.Types.ObjectId(req.user?._id),
                                            "$subscribers.subscriber"
                                        ]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    // only return needed fields from owner
                    {
                        $project: {
                            username: 1,
                            avatar: 1,       // avatar is a plain string url in user.model.js
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },

        // STAGE 3 : $addFields — flatten owner array and compute derived fields
        {
            $addFields: {
                // $lookup returns array, $first flattens it to single object
                owner: {
                    $first: "$owner"
                }
            }
        },

        // STAGE 4 : $project — return all fields from video.model.js + owner
        {
            $project: {
                videoFile: 1,       // cloudinary url string — from model
                thumbnail: 1,       // cloudinary url string — from model
                title: 1,           // from model
                description: 1,     // from model
                duration: 1,        // number from cloudinary — from model
                views: 1,           // number, default 0 — from model
                ispublished: 1,     // boolean — from model
                owner: 1,           // populated from $lookup
                createdAt: 1,       // from timestamps
                updatedAt: 1        // from timestamps
            }
        }
    ])

    // aggregate returns an array, check if video was found
    if (!video.length) {
        throw new ApiError(404, "Video not found")
    }

    // increment views by 1 every time this video is fetched
    // $inc adds 1 to the existing views value — from model views field
    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    })

    // add this video to the logged in user's watch history
    // $addToSet adds videoId only if it doesn't already exist (no duplicates)
    // watchhistory matches exact field name in user.model.js
    await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { watchhistory: videoId }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // only owner can delete the video
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only owner can delete this video")
    }

    // extract video and thumbnail public id to delete from cloudinary

    const videoPublicId = video?.videoFile?.public_id;
    const thumbnailPublicID = video?.thumbnail?.public_id

    // delete video document from db
    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if (deletedVideo) {
        // delete video file from cloudinary (resource_type: "video")
        await deleteOnCloudinary(videoPublicId, "video")

        // delete thumbnail from cloudinary (resource_type: "image")
        await deleteOnCloudinary(thumbnailPublicID)

    }
    else {
        throw new ApiError(400, "Failed to delete video")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // check if the logged in user is the owner of this video
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can change publish status")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                ispublished: !video.ispublished
            }
        },
        {
            returnDocument: 'after'
        }
    )

    if (!updatedVideo) {
        throw new ApiError(400, "Failed to update publish status")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Publish status updated"))
})

const updateVideoContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //extract the thumbnail public_id to delete from cloudinary
    const oldThumbnailPublicId = video?.thumbnail?.public_id

    // Check ownership
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only owner can update video");
    }

    const updateFields = {};

    if (title) {
        updateFields.title = title;
    }

    if (description) {
        updateFields.description = description;
    }

    // Handle thumbnail update if file is provided
    const localThumbnail = req.file?.path;
    if (localThumbnail) {
        const thumbnail = await uploadToCloudinary(localThumbnail);

        if (thumbnail?.url) {
            // set thumbnail as nested object matching video.model.js structure
            updateFields.thumbnail = {
                url: thumbnail.url,
                public_id: thumbnail.public_id
            }

            // delete old thumbnail from cloudinary 
            await deleteOnCloudinary(oldThumbnailPublicId, "image")
        }
        else {
            throw new ApiError(400, "Error while uploading thumbnail");
        }

    }

    // Ensure at least one field is being updated
    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(
            400,
            "Provide title, description, or thumbnail to update"
        );
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields,
        },
        {
            returnDocument: "after",
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedVideo,
            "Video updated successfully"
        )
    );
});

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
    updateVideoContent,
}