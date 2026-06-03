
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannel, getSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/:channelId").post(toggleSubscription)
router.route("/s/:channelId").get(getSubscribers)
router.route("/c/:subscriberId").get(getSubscribedChannel)

export default router