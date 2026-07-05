import db from "../config/db.js";

// Cari user berdasarkan email
const findUserByEmail = (email, callback) => {
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    callback
  );
};

// Simpan hasil quiz
const saveQuiz = (userId, subject, score, totalQuestions, callback) => {
  db.query(
    "INSERT INTO study_history (user_id, subject, score, total_questions) VALUES (?, ?, ?, ?)",
    [userId, subject, score, totalQuestions],
    callback
  );
};

// Tambah point user
const updatePoints = (score, userId, callback) => {
  db.query(
    "UPDATE users SET points = points + ? WHERE id = ?",
    [score, userId],
    callback
  );
};

// Ambil history belajar
const getStudyHistory = (email, limit, offset, callback) => {
  const query = `
    SELECT
      sh.*,
      'quiz' as type
    FROM study_history sh
    JOIN users u ON sh.user_id = u.id
    WHERE u.email = ?
    ORDER BY sh.date DESC
    LIMIT ? OFFSET ?
  `;
  db.query(query, [email, limit, offset], callback);
};

export default {
  findUserByEmail,
  saveQuiz,
  updatePoints,
  getStudyHistory,
};