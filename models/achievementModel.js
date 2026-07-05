import db from "../config/db.js";

// Cari user berdasarkan email
const findUserByEmail = async (email) => {
  const [users] = await db.promise().query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  return users;
};

// Ambil semua achievement (master data)
const getAllAchievements = async () => {
  const [rows] = await db.promise().query(
    "SELECT * FROM achievements ORDER BY created_at DESC"
  );
  return rows;
};

// Buat achievement baru (admin)
const createAchievement = async (id, title, description, pointsReward) => {
  const [result] = await db.promise().query(
    "INSERT INTO achievements (id, title, description, points_reward) VALUES (?, ?, ?, ?)",
    [id, title, description, pointsReward]
  );
  return result;
};

// Update achievement (admin)
const updateAchievement = async (id, title, description, pointsReward) => {
  const [result] = await db.promise().query(
    "UPDATE achievements SET title = ?, description = ?, points_reward = ? WHERE id = ?",
    [title, description, pointsReward, id]
  );
  return result;
};

// Hapus achievement (admin)
const deleteAchievement = async (id) => {
  const [result] = await db.promise().query(
    "DELETE FROM achievements WHERE id = ?",
    [id]
  );
  return result;
};

// Claim achievement + update point (transaction)
const claimAchievement = async (userId, achievementId, points) => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)",
      [userId, achievementId]
    );

    await connection.query(
      "UPDATE users SET points = points + ? WHERE id = ?",
      [points, userId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export default {
  findUserByEmail,
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  claimAchievement,
};