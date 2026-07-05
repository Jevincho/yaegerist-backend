import express from "express";
import {
  saveQuiz,
  getStudyHistory,
} from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateQuiz from "../middleware/validateQuiz.js";

const router = express.Router();

router.post("/save-quiz", authMiddleware, validateQuiz, saveQuiz);
router.get("/study-history", authMiddleware, getStudyHistory);

export default router;