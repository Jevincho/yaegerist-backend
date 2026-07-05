const validateQuiz = (req, res, next) => {
  const { subject, score, totalQuestions } = req.body;

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return res.status(400).json({
      message: "Subject wajib diisi",
    });
  }

  if (typeof score !== "number" || score < 0) {
    return res.status(400).json({
      message: "Score harus berupa angka non-negatif",
    });
  }

  if (typeof totalQuestions !== "number" || totalQuestions <= 0) {
    return res.status(400).json({
      message: "TotalQuestions harus berupa angka lebih dari 0",
    });
  }

  next();
};

export default validateQuiz;