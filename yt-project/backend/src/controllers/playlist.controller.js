import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
    });

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "playlist created successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can update playlist");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, { name, description }, { new: true });
    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to update playlist");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "playlist updated successfully"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const aggregatePlaylists = Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            avatar: 1,
                            fullname: 1,
                        },
                    },
                ]
            },

        },
        {
            $unwind: "$ownerDetails"
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            videoFile: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                ownerDetails: 1,
                videos: 1,
                createdAt: 1,
            }
        },
    ])

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const playlists = await Playlist.aggregatePaginate(aggregatePlaylists, options);

    if (!playlists.docs.length) {
        throw new ApiError(404, "No playlists found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "playlists fetched successfully"));

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    if (Playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can delete playlist");
    }
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if (!deletedPlaylist) {
        throw new ApiError(500, "Failed to delete playlist");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, deletedPlaylist, "playlist deleted successfully"));
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    };

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (playlist.owner.toString() && video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can add video to playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:
                { videos: videoId }
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to add video to playlist");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "video added to playlist successfully"));

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    //validate ids
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    //find playlist and video
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //validate ownership
    if (playlist.owner.toString() && video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can remove video from playlist");
    }
    //remove video from playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    );
    //validate update
    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to remove video from playlist");
    }
    //return response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "video removed from playlist successfully"));
})
export {
    createPlaylist,
    updatePlaylist,
    getUserPlaylists,
    getPlaylistById,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist

};
