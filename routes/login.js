import { Router } from "express";
import { body, matchedData, validationResult } from "express-validator";
import passport from "passport";

const loginRoute = Router();

loginRoute.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
})

loginRoute.get('/', (req, res) => {
  res.render('login', { isError: false });
})

loginRoute.post('/', [
  body('username').trim().notEmpty().withMessage("username can't be empty"),
  body('password').trim().notEmpty().withMessage("password can't be empty")
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.locals.isError = true;
    res.locals.errors = errors.array();

    return res.render('login');
  }
  req.body = matchedData(req, { locations: ['body'] });
  next();
}, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }))

export default loginRoute;