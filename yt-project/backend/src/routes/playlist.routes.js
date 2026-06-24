import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

// Public — viewing playlists doesn't require auth
router.route("/:userId").get(getUserPlaylists)
router.route("/p/:playlistId").get(getPlaylistById)

// Protected — mutations require auth
router.route("/").post(verifyJWT, createPlaylist);
router.route("/p/:playlistId")
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist)
router.route("/p/:playlistId/videos/:videoId")
    .patch(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist)

export default router;