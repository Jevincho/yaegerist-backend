import UserModel from "../models/userModel.js";

// PROFILE
export const getProfile = (req, res) => {
  const email = req.user.email;

  UserModel.getProfile(email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error server",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json(results[0]);
  });
};

// UPDATE PROGRESS
export const updateProgress = (req, res) => {
  const email = req.user.email;
  const { duration, cardReviewed, points } = req.body;

  UserModel.updateProgress(
    email,
    duration,
    cardReviewed,
    points,
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Progress updated",
      });
    }
  );
};

// LEADERBOARD
export const getLeaderboard = (req, res) => {
  UserModel.getLeaderboard((err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error ambil leaderboard",
      });
    }

    res.json(results);
  });
};

// GET ALL USERS (admin only)
export const getAllUsers = (req, res) => {
  UserModel.getAllUsers((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error mengambil data user",
      });
    }

    res.json(results);
  });
};