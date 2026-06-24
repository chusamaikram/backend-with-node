
import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";

const router = Router();

// Public — guests can read comments
router.route("/:videoId").get(optionalVerifyJWT, getVideoComment)

// Protected — must be logged in to add/edit/delete
router.route("/:videoId").post(verifyJWT, addComment)
router.route("/c/:commentId").patch(verifyJWT, updateComment).delete(verifyJWT, deleteComment)

export default router;