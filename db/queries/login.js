import pool from "../pool.js";

const getUserByUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0];
}

const getAccountByID = async (id) => {
  const { rows } = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
  return rows[0];
}

export default { getUserByUsername, getAccountByID };