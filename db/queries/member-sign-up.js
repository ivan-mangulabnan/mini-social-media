import pool from "../pool.js";

const setMember = async (id) => {
  await pool.query('UPDATE accounts SET member = true WHERE id = $1', [id]);
}

export default { setMember }