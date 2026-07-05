import mysql from "mysql2";
import { config } from "dotenv";
config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "elearning",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB ERROR:", err);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

export default db;