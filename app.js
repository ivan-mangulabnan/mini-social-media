import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import passport from './config/passport.js';
import router from './routes/routes.js';
import pool from './db/pool.js';
import connectPgSimple from 'connect-pg-simple';

const app = express();
const PgSession = connectPgSimple(session);

const __filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filepath);
const views = path.join(__dirname, 'views');
const assetsPath = path.join(__dirname, 'public');
const sessionOptions = {
  store: new PgSession({ pool }),
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
};

app.set('views', views);
app.set('view engine', 'ejs');

app.use(session(sessionOptions));
app.use(passport.session());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);

  console.log('Server running');
});