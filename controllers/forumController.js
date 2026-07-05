import ForumModel from "../models/forumModel.js";
import { getIO } from "../config/socket.js";

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumModel.getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal mengambil daftar post",
    });
  }
};

// GET POST DETAIL + REPLIES
export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await ForumModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post tidak ditemukan",
      });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal mengambil detail post",
    });
  }
};

// CREATE POST
export const createPost = async (req, res) => {
  const userId = req.user.id;
  const { title, content, category } = req.body;

  try {
    const postId = await ForumModel.createPost(
      userId,
      title,
      content,
      category || "umum"
    );

    // Beri tahu semua client agar refresh daftar post
    getIO().emit("forum_new_post", { postId });

    res.status(201).json({
      success: true,
      message: "Post berhasil dibuat",
      postId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal membuat post",
    });
  }
};

// CREATE REPLY
export const createReply = async (req, res) => {
  const userId = req.user.id;
  const { id: postId } = req.params;
  const { content } = req.body;

  try {
    const exists = await ForumModel.postExists(postId);

    if (!exists) {
      return res.status(404).json({
        message: "Post tidak ditemukan",
      });
    }

    await ForumModel.createReply(postId, userId, content);

    // Ambil ulang data post lengkap (termasuk reply baru), lalu kirim ke semua client yang buka post ini
    const updatedPost = await ForumModel.getPostById(postId);
    getIO().to(`post_${postId}`).emit("forum_post_updated", updatedPost);

    // Update jumlah reply di halaman list forum
    getIO().emit("forum_stats_updated", {
      postId,
      reply_count: updatedPost.replies.length,
      upvotes: updatedPost.upvotes,
    });

    res.status(201).json({
      success: true,
      message: "Jawaban berhasil ditambahkan",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal menambahkan jawaban",
    });
  }
};

// UPVOTE POST
export const upvotePost = async (req, res) => {
  const userId = req.user.id;
  const { id: postId } = req.params;

  try {
    const exists = await ForumModel.postExists(postId);

    if (!exists) {
      return res.status(404).json({
        message: "Post tidak ditemukan",
      });
    }

    await ForumModel.upvotePost(postId, userId);

    const updatedPost = await ForumModel.getPostById(postId);
    getIO().to(`post_${postId}`).emit("forum_post_updated", updatedPost);
    getIO().emit("forum_stats_updated", {
      postId,
      reply_count: updatedPost.replies.length,
      upvotes: updatedPost.upvotes,
    });

    res.json({
      success: true,
      message: "Upvote berhasil",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Kamu sudah upvote post ini",
      });
    }

    console.error(err);
    res.status(500).json({
      message: "Gagal upvote post",
    });
  }
};

// UPVOTE REPLY
export const upvoteReply = async (req, res) => {
  const userId = req.user.id;
  const { id: replyId } = req.params;

  try {
    await ForumModel.upvoteReply(replyId, userId);

    // Cari post_id dari reply ini supaya bisa emit ke room yang tepat
    const postId = await ForumModel.getPostIdByReplyId(replyId);

    if (postId) {
      const updatedPost = await ForumModel.getPostById(postId);
      getIO().to(`post_${postId}`).emit("forum_post_updated", updatedPost);
    }

    res.json({
      success: true,
      message: "Upvote berhasil",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Kamu sudah upvote jawaban ini",
      });
    }

    console.error(err);
    res.status(500).json({
      message: "Gagal upvote jawaban",
    });
  }
};

// DELETE POST (admin only)
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await ForumModel.deletePost(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Post tidak ditemukan",
      });
    }

    getIO().to(`post_${id}`).emit("forum_post_deleted", { postId: id });
    getIO().emit("forum_post_removed", { postId: id });

    res.json({
      success: true,
      message: "Post berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal menghapus post",
    });
  }
};

// DELETE REPLY (admin only)
export const deleteReply = async (req, res) => {
  const { id } = req.params;

  try {
    const postId = await ForumModel.getPostIdByReplyId(id);

    const result = await ForumModel.deleteReply(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Jawaban tidak ditemukan",
      });
    }

    if (postId) {
      const updatedPost = await ForumModel.getPostById(postId);
      getIO().to(`post_${postId}`).emit("forum_post_updated", updatedPost);
      getIO().emit("forum_stats_updated", {
        postId,
        reply_count: updatedPost.replies.length,
        upvotes: updatedPost.upvotes,
      });
    }

    res.json({
      success: true,
      message: "Jawaban berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal menghapus jawaban",
    });
  }
};