import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

const getVideoComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "video not found")

    }
    // const comments = await Comment.find({ video: videoId })

    const commentAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"

            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                owner: {
                    username: 1,
                    fullname: 1,
                    "avatar.url": 1
                },
                isLiked: 1,
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const comments = await Comment.aggregatePaginate(
        commentAggregate,
        options
    );

    return res.status(200)
        .json(
            new ApiResponse(200, comments, "comments fetched successfully. ")
        )




})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "comment should not be empty")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    const comment = await Comment.create(
        {
            content,
            video: video?._id,
            owner: req.user?._id
        }
    )

    return res.status(201)
        .json(
            new ApiResponse(201, comment, "comment added to video . ")
        )

})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "video not found")
    }

    if (!content) {
        throw new ApiError(400, "comment should not be empty")

    }

    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only comments Owner can edit their comments .")
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    if (!updatedComment) {
        throw new ApiError(500, "error while updating comment")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, updatedComment, "comment updated successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "comment not found")
    }

    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only comments Owner can delete their comments .")
    }

    const deletedComment = await Comment.findByIdAndDelete(
        commentId
    )


    if (!deletedComment) {
        throw new ApiError(500, "error while deleting comment")
    }

    await Like.deleteMany({
        comment: commentId,
        likedBy: req.user?._id
    })

    return res.status(200)
        .json(
            new ApiResponse(200, deletedComment, "comment deleted successfully")
        )
})



export {
    getVideoComment,
    addComment,
    updateComment,
    deleteComment
}