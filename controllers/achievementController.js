import AchievementModel from "../models/achievementModel.js";

// CLAIM (student)
export const claimAchievement = async (req, res) => {
  const email = req.user.email;
  const { achievementId, points } = req.body;

  try {
    const users = await AchievementModel.findUserByEmail(email);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const userId = users[0].id;

    await AchievementModel.claimAchievement(userId, achievementId, points);

    return res.status(200).json({
      success: true,
      message: "Achievement claimed + points added",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Achievement sudah pernah diklaim",
      });
    }

    console.error(err);

    return res.status(500).json({
      message: "Gagal claim achievement",
    });
  }
};

// GET ALL (semua user yang login)
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await AchievementModel.getAllAchievements();
    res.json(achievements);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal mengambil daftar achievement",
    });
  }
};

// CREATE (admin only)
export const createAchievement = async (req, res) => {
  const { id, title, description, points_reward } = req.body;

  try {
    await AchievementModel.createAchievement(
      id,
      title,
      description || null,
      points_reward || 0
    );

    res.status(201).json({
      success: true,
      message: "Achievement berhasil dibuat",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "ID achievement sudah digunakan",
      });
    }

    console.error(err);
    res.status(500).json({
      message: "Gagal membuat achievement",
    });
  }
};

// UPDATE (admin only)
export const updateAchievement = async (req, res) => {
  const { id } = req.params;
  const { title, description, points_reward } = req.body;

  try {
    const result = await AchievementModel.updateAchievement(
      id,
      title,
      description || null,
      points_reward || 0
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Achievement tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Achievement berhasil diupdate",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal update achievement",
    });
  }
};

// DELETE (admin only)
export const deleteAchievement = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await AchievementModel.deleteAchievement(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Achievement tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Achievement berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal menghapus achievement",
    });
  }
};