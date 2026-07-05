import QuizModel from "../models/quizModel.js";

// Simpan Quiz
export const saveQuiz = (req, res) => {
  const email = req.user.email;
  const { subject, score, totalQuestions } = req.body;

  QuizModel.findUserByEmail(email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error user" });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const userId = result[0].id;

    QuizModel.saveQuiz(
      userId,
      subject,
      score,
      totalQuestions,
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Error insert" });
        }

        QuizModel.updatePoints(score, userId, (err) => {
          if (err) {
            return res.status(500).json({
              message: "Error update points",
            });
          }

          res.json({
            message: "Quiz tersimpan + points terupdate",
          });
        });
      }
    );
  });
};

// History Quiz
export const getStudyHistory = (req, res) => {
  const email = req.user.email;
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  QuizModel.getStudyHistory(email, limit, offset, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
};