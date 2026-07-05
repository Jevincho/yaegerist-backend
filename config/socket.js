import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // Client join ke room khusus post tertentu saat membuka detail post
    socket.on("join_post", (postId) => {
      socket.join(`post_${postId}`);
    });

    // Client leave room saat keluar dari detail post
    socket.on("leave_post", (postId) => {
      socket.leave(`post_${postId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io belum diinisialisasi");
  return io;
};  