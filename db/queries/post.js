import pool from "../pool.js";

const createPost = async (id, message) => {
  await pool.query('INSERT INTO posts (owner_id, message) VALUES ($1, $2)', [id, message]);
}

const getPosts = async () => {
  const { rows } = await pool.query('SELECT p.*, a.fname, a.lname, a.member, a.admin FROM posts AS p INNER JOIN accounts AS a ON p.owner_id = a.id ORDER BY created_at DESC');
  return rows;
}

const deletePost = async (postID) => {
  await pool.query('DELETE FROM posts WHERE id = $1', [postID]);
}

const isPostsFromOwner = async (userID, postID) => {
  const { rows } = await pool.query('SELECT EXISTS (SELECT 1 FROM posts WHERE posts.owner_id = $1 AND posts.id = $2) AS existence', [userID, postID]);
  return rows[0].existence;
}

export default { createPost, getPosts, deletePost, isPostsFromOwner };