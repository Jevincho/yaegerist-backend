const validateProgress = (req, res, next) => {
  const { duration, cardReviewed, points } = req.body;

  if (duration !== undefined && (typeof duration !== "number" || duration < 0)) {
    return res.status(400).json({
      message: "Duration harus berupa angka non-negatif",
    });
  }

  if (cardReviewed !== undefined && (typeof cardReviewed !== "number" || cardReviewed < 0)) {
    return res.status(400).json({
      message: "CardReviewed harus berupa angka non-negatif",
    });
  }

  if (points !== undefined && (typeof points !== "number" || points < 0)) {
    return res.status(400).json({
      message: "Points harus berupa angka non-negatif",
    });
  }

  next();
};

export default validateProgress;