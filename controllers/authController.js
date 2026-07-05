import AuthModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../config/jwt.js";
import { sendResetPasswordEmail } from "../config/mailer.js";

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  AuthModel.findUserByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error server",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "User tidak ditemukan",
      });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

// REGISTER
export const register = async (req, res) => {
  const { nama, email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    AuthModel.createUser(nama, email, hashPassword, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal register",
        });
      }

      res.json({
        message: "Register berhasil",
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// REQUEST RESET PASSWORD (kirim email)
export const requestResetPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email wajib diisi",
    });
  }

  AuthModel.findUserByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error server",
      });
    }

    // Selalu balas sukses walau email tidak ditemukan
    // supaya tidak bocor info "email mana yang terdaftar"
    if (results.length === 0) {
      return res.json({
        message: "Kalau email terdaftar, link reset sudah dikirim",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 menit dari sekarang

    AuthModel.setResetToken(email, token, expiry, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal memproses permintaan reset",
        });
      }

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      try {
        await sendResetPasswordEmail(email, resetLink);
        res.json({
          message: "Kalau email terdaftar, link reset sudah dikirim",
        });
      } catch (emailErr) {
        console.error("Gagal kirim email:", emailErr);
        res.status(500).json({
          message: "Gagal mengirim email reset",
        });
      }
    });
  });
};

// RESET PASSWORD (dengan token dari link email)
export const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      message: "Data tidak lengkap",
    });
  }

  AuthModel.findUserByResetToken(token, async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error server",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        message: "Token tidak valid atau sudah kadaluarsa",
      });
    }

    const user = results[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    AuthModel.updatePasswordAndClearToken(user.email, hashedPassword, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal update password",
        });
      }

      res.json({
        message: "Password berhasil diubah, silakan login",
      });
    });
  });
};