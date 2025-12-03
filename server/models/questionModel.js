// server/models/questionModel.js
import {pool} from "../config/db.js";

/**
 * Fetch ONE random country row from the database.
 * Returns: { id, country, capital, currency }
 */
export const getRandomQuestion = async () => {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      country_name AS country,
      capital_name AS capital,
      currency
    FROM countries
    ORDER BY RANDOM()
    LIMIT 1;
    `
  );

  return rows[0] || null;
};

/**
 * Fetch a specific question by country name.
 * Returns: { id, country, capital, currency }
 */
export const getQuestionByCountry = async (country) => {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      country_name AS country,
      capital_name AS capital,
      currency
    FROM countries
    WHERE country_name = $1
    LIMIT 1;
    `,
    [country]
  );

  return rows[0] || null;
};
