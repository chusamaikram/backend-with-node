import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()

// Public — reading tweets doesn't require auth
router.route("/").get(optionalVerifyJWT, getAllTweets)


// Protected — mutations require auth
router.route("/u/:uId").get(verifyJWT, getUserTweets)
router.route("/create-tweet").post(verifyJWT, createTweet)
router.route("/t/:tweetId")
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet)

export default router