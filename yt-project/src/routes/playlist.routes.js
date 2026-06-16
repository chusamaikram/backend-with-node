import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/:userId").get(getUserPlaylists)
router.route("/p/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist)
router.route("/p/:playlistId/videos/:videoId")
    .patch(addVideoToPlaylist)
    .delete(removeVideoFromPlaylist)

export default router;