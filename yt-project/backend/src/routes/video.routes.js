import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideoContent } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getAllVideos)
router.route("/upload-video").post(
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
router.route("/:videoId").get(getVideoById)
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/toggle-publish/:videoId").patch(togglePublishStatus)
router.route("/update-video/:videoId").patch(
    upload.single("thumbnail"),
    updateVideoContent
)


export default router;