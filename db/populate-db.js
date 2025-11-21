import { Client } from "pg";

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255),
    password VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    fname VARCHAR (255), 
    lname VARCHAR (255), 
    admin BOOLEAN DEFAULT false, 
    member BOOLEAN DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    message TEXT
  );
`;

async function createTables () {
  console.log('seeding...');
  const client = new Client({ connectionString: process.argv[2] });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

createTables();