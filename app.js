import express from "express";
import cors from "cors";
import helmet from "helmet";


import { env } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";

import loggerMiddleware from "./middleware/loggerMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import forumRoutes from "./routes/forumRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/forum", forumRoutes);

app.use(errorMiddleware);

export default app;