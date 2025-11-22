import { Router } from "express";
import { validationResult, body, matchedData } from "express-validator";
import db from '../db/queries/sign-up.js';
import bcrypt from "bcryptjs";

const signUpRoute = Router();

signUpRoute.get('/', (req, res) => {
  res.render('sign-up', { isError: false });
})

signUpRoute.post('/', [
  body('fname').trim().notEmpty().withMessage('first name is required'),
  body('lname').trim().notEmpty().withMessage('last name is required'),
  body('username').trim().notEmpty().withMessage('username is required')
    .custom(async (value) => {
      const isAlreadyInUse = await db.checkIfUserExists(value);
      if (isAlreadyInUse) {
        throw new Error('username already exists');
      }
    }),
  body('password').trim().notEmpty().withMessage('password is required'),
  body('c-pass').trim().notEmpty().withMessage('confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('passwords do not match');
      return true;
    })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.locals.isError = true;
    res.locals.errors = errors.array();

    return res.render('sign-up');
  }

  const { fname, lname, username, password } = matchedData(req, { locations: ['body'] });
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.createAccount(fname, lname, username, hashedPassword);

  return res.redirect('/login');
})

export default signUpRoute;