import db from "../config/db.js";

// Ambil semua post + info author + jumlah upvote + jumlah reply
const getAllPosts = async () => {
  const [rows] = await db.promise().query(`
    SELECT 
      p.id,
      p.title,
      p.content,
      p.category,
      p.created_at,
      u.name AS author,
      u.id AS author_id,
      (SELECT COUNT(*) FROM forum_post_upvotes WHERE post_id = p.id) AS upvotes,
      (SELECT COUNT(*) FROM forum_replies WHERE post_id = p.id) AS reply_count
    FROM forum_posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  return rows;
};

// Ambil satu post + semua reply-nya
const getPostById = async (postId) => {
  const [posts] = await db.promise().query(`
    SELECT 
      p.id,
      p.title,
      p.content,
      p.category,
      p.created_at,
      u.name AS author,
      u.id AS author_id,
      (SELECT COUNT(*) FROM forum_post_upvotes WHERE post_id = p.id) AS upvotes
    FROM forum_posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `, [postId]);

  if (posts.length === 0) return null;

  const [replies] = await db.promise().query(`
    SELECT 
      r.id,
      r.content,
      r.created_at,
      u.name AS author,
      u.id AS author_id,
      (SELECT COUNT(*) FROM forum_reply_upvotes WHERE reply_id = r.id) AS upvotes
    FROM forum_replies r
    JOIN users u ON r.user_id = u.id
    WHERE r.post_id = ?
    ORDER BY r.created_at ASC
  `, [postId]);

  return { ...posts[0], replies };
};

// Buat post baru
const createPost = async (userId, title, content, category) => {
  const [result] = await db.promise().query(
    "INSERT INTO forum_posts (user_id, title, content, category) VALUES (?, ?, ?, ?)",
    [userId, title, content, category]
  );
  return result.insertId;
};

// Buat reply baru
const createReply = async (postId, userId, content) => {
  const [result] = await db.promise().query(
    "INSERT INTO forum_replies (post_id, user_id, content) VALUES (?, ?, ?)",
    [postId, userId, content]
  );
  return result.insertId;
};

// Upvote post
const upvotePost = async (postId, userId) => {
  await db.promise().query(
    "INSERT INTO forum_post_upvotes (post_id, user_id) VALUES (?, ?)",
    [postId, userId]
  );
};

// Upvote reply
const upvoteReply = async (replyId, userId) => {
  await db.promise().query(
    "INSERT INTO forum_reply_upvotes (reply_id, user_id) VALUES (?, ?)",
    [replyId, userId]
  );
};

// Cek apakah post ada (dipakai sebelum insert reply/upvote)
const postExists = async (postId) => {
  const [rows] = await db.promise().query(
    "SELECT id FROM forum_posts WHERE id = ?",
    [postId]
  );
  return rows.length > 0;
};

// Hapus post (otomatis hapus reply & upvote terkait karena ON DELETE CASCADE)
const deletePost = async (postId) => {
  const [result] = await db.promise().query(
    "DELETE FROM forum_posts WHERE id = ?",
    [postId]
  );
  return result;
};

// Hapus reply
const deleteReply = async (replyId) => {
  const [result] = await db.promise().query(
    "DELETE FROM forum_replies WHERE id = ?",
    [replyId]
  );
  return result;
};

// Cari post_id dari sebuah reply (dipakai untuk emit ke room yang tepat)
const getPostIdByReplyId = async (replyId) => {
  const [rows] = await db.promise().query(
    "SELECT post_id FROM forum_replies WHERE id = ?",
    [replyId]
  );
  return rows.length > 0 ? rows[0].post_id : null;
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  createReply,
  upvotePost,
  upvoteReply,
  postExists,
  deletePost,
  deleteReply,
  getPostIdByReplyId,
};