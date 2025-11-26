import { Router } from "express";
import { body, validationResult } from "express-validator";
import db from '../db/queries/member-sign-up.js';

const memberRoute = Router();

memberRoute.get('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  if (req.user.member) return res.redirect('/');

  next();
}, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render('member-sign-up', { errors: [] });
})

memberRoute.post('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
}, [
  body('code').trim().notEmpty().withMessage('id should not be empty')
    .custom(value => {
      if (value !== 'ivanpogi') throw new Error('Wrong code');
      return true;
    })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('member-sign-up', { errors: errors.array().map(err => err.msg) });
  }

  try {
    await db.setMember(req.user.id);
  } catch(err) {
    return next(err);
  }

  res.redirect('/');
})

export default memberRoute;