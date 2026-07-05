export const validateRegister = (req, res, next) => {
  const { nama, email, password } = req.body;

  if (!nama || typeof nama !== "string" || nama.trim().length < 3) {
    return res.status(400).json({
      message: "Nama wajib diisi, minimal 3 karakter",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email tidak valid",
    });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      message: "Password minimal 8 karakter",
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      message: "Email wajib diisi",
    });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({
      message: "Password wajib diisi",
    });
  }

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { email, newPassword } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email tidak valid",
    });
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(400).json({
      message: "Password baru minimal 8 karakter",
    });
  }

  next();
};