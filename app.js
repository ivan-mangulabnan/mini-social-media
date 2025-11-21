import 'dotenv/config';
import express from 'express';

const app = express();

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);

  console.log('Server running');
});