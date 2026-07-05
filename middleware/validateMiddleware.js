const validateAchievement = (req, res, next) => {
  const { achievementId, points } = req.body;

  if (!achievementId || isNaN(achievementId)) {
    return res.status(400).json({
      message: "Valid achievementId is required",
    });
  }

  if (typeof points !== "number" || points < 0) {
    return res.status(400).json({
      message: "Points must be a non-negative number",
    });
  }

  next();
};

export const validateAchievementInput = (req, res, next) => {
  const { id, title, description, points_reward } = req.body;

  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return res.status(400).json({
      message: "ID achievement wajib diisi",
    });
  }

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      message: "Title wajib diisi",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Description harus berupa string",
    });
  }

  if (
    points_reward !== undefined &&
    (typeof points_reward !== "number" || points_reward < 0)
  ) {
    return res.status(400).json({
      message: "Points reward harus berupa angka non-negatif",
    });
  }

  next();
};

export default validateAchievement;