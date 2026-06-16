import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getUsersPlaylists, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/:userId").get(getUsersPlaylists)
router.route("/:playlistId").patch(updatePlaylist)

export default router;
