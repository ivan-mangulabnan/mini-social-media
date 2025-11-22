import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import db from "../db/queries/login.js";

async function verify (username, password, done) {
  try {
    const user = await db.getUserByUsername(username);
    if (!user) return done(null, false, { message: 'Please re-check username' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getAccountByID(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(verify));

export default passport;