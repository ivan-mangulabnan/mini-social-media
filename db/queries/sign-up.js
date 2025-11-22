import pool from "../pool.js";

const checkIfUserExists = async (username) => {
  const { rows } = await pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) AS existence', [username]);
  return rows[0].existence;
}

const createAccount = async (fname, lname, username, password) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]);
    const id = rows[0].id;
    await client.query('INSERT INTO accounts (id, fname, lname) VALUES ($1, $2, $3)', [id, fname, lname]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

export default { checkIfUserExists, createAccount };