import express from "express";
import {
  login,
  register,
  requestResetPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateLogin,
  validateRegister,
} from "../middleware/validateAuth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", authLimiter, validateLogin, login);
router.post("/register", authLimiter, validateRegister, register);
router.post("/request-reset-password", authLimiter, requestResetPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;