import db from "../config/db.js";

const findUserByEmail = (email, callback) => {
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    callback
  );
};

const createUser = (name, email, password, callback) => {
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    callback
  );
};

const updatePassword = (email, password, callback) => {
  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [password, email],
    callback
  );
};

// Simpan token reset + waktu kadaluarsa
const setResetToken = (email, token, expiry, callback) => {
  db.query(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiry, email],
    callback
  );
};

// Cari user berdasarkan token (dan pastikan belum expired)
const findUserByResetToken = (token, callback) => {
  db.query(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token],
    callback
  );
};

// Update password + hapus token setelah dipakai
const updatePasswordAndClearToken = (email, password, callback) => {
  db.query(
    "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
    [password, email],
    callback
  );
};

export default {
  findUserByEmail,
  createUser,
  updatePassword,
  setResetToken,
  findUserByResetToken,
  updatePasswordAndClearToken,
};