import express from "express";
import {
  getProfile,
  updateProgress,
  getLeaderboard,
  getAllUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validateProgress from "../middleware/validateProgress.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.post(
  "/save-quiz",
  authMiddleware,
  validateProgress,
  updateProgress
);

router.get("/leaderboard", getLeaderboard);

// Admin only
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);

export default router;