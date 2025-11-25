import pool from "../pool.js";

const setAdmin = async (id) => {
  await pool.query('UPDATE accounts SET admin = true WHERE id = $1', [id]);
}

export default { setAdmin }