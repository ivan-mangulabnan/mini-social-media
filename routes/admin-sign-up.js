import { Router } from "express";
import { body, validationResult } from "express-validator";
import db from '../db/queries/admin-sign-up.js';

const adminRoute = Router();

adminRoute.get('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  if (req.user.admin) return res.redirect('/');

  next();
}, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render('admin-sign-up', { errors: [] });
})

adminRoute.post('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
}, [
  body('id').trim().notEmpty().withMessage('id should not be empty')
    .isInt({ min: 1 }).withMessage('id should be greater than 0')
    .custom((value, { req }) => {
      if (parseInt(value) !== req.user.id) throw new Error('id do not match');
      return true;
    }),
  body('code').trim().notEmpty().withMessage('id should not be empty')
    .custom(value => {
      if (value !== 'ivansobrangpogi') throw new Error('Wrong code');
      return true;
    })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin-sign-up', { errors: errors.array().map(err => err.msg) });
  }

  try {
    await db.setAdmin(req.user.id);
  } catch(err) {
    return next(err);
  }

  res.redirect('/');
})

export default adminRoute;