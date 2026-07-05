import { config } from "dotenv";
config();

const required = ["JWT_SECRET", "DB_HOST", "DB_USER", "DB_NAME"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required env variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
};