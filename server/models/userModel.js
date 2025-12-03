import { pool } from "../config/db.js";   // ❗ must be named import

export const createUser = async ({ username, email, passwordHash }) => {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;

  const values = [username, email, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, username, email, password_hash
    FROM users
    WHERE email = $1;
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
};
