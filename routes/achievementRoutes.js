import express from "express";
import {
  claimAchievement,
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";
import validateAchievement, {
  validateAchievementInput,
} from "../middleware/validateMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Semua user yang login
router.get("/", authMiddleware, getAllAchievements);
router.post(
  "/claim-achievement",
  authMiddleware,
  validateAchievement,
  claimAchievement
);

// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateAchievementInput,
  createAchievement
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validateAchievementInput,
  updateAchievement
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAchievement
);

export default router;