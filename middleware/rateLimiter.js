import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // maksimal 10 request per IP per window
  message: {
    message: "Terlalu banyak percobaan, coba lagi dalam beberapa menit",
  },
  standardHeaders: true,
  legacyHeaders: false,
});