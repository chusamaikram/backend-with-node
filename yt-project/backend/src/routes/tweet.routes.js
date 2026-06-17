import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/").get(getUserTweets)
router.route("/create-tweet").post(createTweet)
router.route("/t/:tweetId")
    .patch(updateTweet)
    .delete(deleteTweet)

export default router