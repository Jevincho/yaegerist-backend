export const validatePost = (req, res, next) => {
  const { title, content, category } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 5) {
    return res.status(400).json({
      message: "Judul wajib diisi, minimal 5 karakter",
    });
  }

  if (!content || typeof content !== "string" || content.trim().length < 10) {
    return res.status(400).json({
      message: "Konten wajib diisi, minimal 10 karakter",
    });
  }

  const validCategories = ["matematika", "fisika", "kimia", "biologi", "bahasa", "umum"];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      message: "Kategori tidak valid",
    });
  }

  next();
};

export const validateReply = (req, res, next) => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim().length < 3) {
    return res.status(400).json({
      message: "Jawaban wajib diisi, minimal 3 karakter",
    });
  }

  next();
};