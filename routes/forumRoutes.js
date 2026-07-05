import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  createReply,
  upvotePost,
  upvoteReply,
  deletePost,
  deleteReply,
} from "../controllers/forumController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { validatePost, validateReply } from "../middleware/validateForum.js";

const router = express.Router();

router.get("/posts", authMiddleware, getAllPosts);
router.get("/posts/:id", authMiddleware, getPostById);
router.post("/posts", authMiddleware, validatePost, createPost);
router.post("/posts/:id/replies", authMiddleware, validateReply, createReply);
router.post("/posts/:id/upvote", authMiddleware, upvotePost);
router.post("/replies/:id/upvote", authMiddleware, upvoteReply);

// Admin only
router.delete("/posts/:id", authMiddleware, roleMiddleware("admin"), deletePost);
router.delete("/replies/:id", authMiddleware, roleMiddleware("admin"), deleteReply);

export default router;