import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);

export default router;