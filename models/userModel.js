import db from "../config/db.js";

// Ambil profile user
const getProfile = (email, callback) => {
  db.query(
    "SELECT id, name, email, points, duration, cardReviewed FROM users WHERE email = ?",
    [email],
    callback
  );
};

// Update progress user
const updateProgress = (
  email,
  duration,
  cardReviewed,
  points,
  callback
) => {
  const sql = `
    UPDATE users
    SET duration = duration + ?,
        cardReviewed = cardReviewed + ?,
        points = points + ?
    WHERE email = ?
  `;

  db.query(
    sql,
    [duration || 0, cardReviewed || 0, points || 0, email],
    callback
  );
};

// Leaderboard
const getLeaderboard = (callback) => {
  const sql = `
    SELECT name, points
    FROM users
    ORDER BY points DESC
    LIMIT 10
  `;

  db.query(sql, callback);
};

// Ambil semua user (admin only)
const getAllUsers = (callback) => {
  db.query(
    "SELECT id, name, email, role, points, duration, cardReviewed FROM users",
    callback
  );
};

export default {
  getProfile,
  updateProgress,
  getLeaderboard,
  getAllUsers,
};