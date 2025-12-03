// config/db.js
import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); // ✅ load .env BEFORE using process.env

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Optional: debug log
// console.log("DB config:", {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   hasPassword: !!process.env.DB_PASSWORD, // should be true
//   port: process.env.DB_PORT || 5432,
// });

