import pool from "../pool.js";

const createPost = async (id, message) => {
  await pool.query('INSERT INTO posts (owner_id, message) VALUES ($1, $2)', [id, message]);
}

const getPosts = async () => {
  const { rows } = await pool.query('SELECT p.*, a.fname, a.lname, a.member, a.admin FROM posts AS p INNER JOIN accounts AS a ON p.owner_id = a.id ORDER BY created_at DESC');
  return rows;
}

export default { createPost, getPosts };