import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideoContent } from "../controllers/video.controller.js";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ── Public routes (no auth required) ─────────────────────────────────
// optionalVerifyJWT attaches req.user if logged in, continues as guest if not
router.route("/").get(optionalVerifyJWT, getAllVideos)
router.route("/:videoId").get(optionalVerifyJWT, getVideoById)

// ── Protected routes (auth required) ─────────────────────────────────
router.route("/upload-video").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
)
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)
router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus)
router.route("/update-video/:videoId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideoContent
)


export default router;