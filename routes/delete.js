import { Router } from "express";
import { matchedData, param, validationResult } from "express-validator";
import db from '../db/queries/post.js';

const deleteRoute = Router();

deleteRoute.get('/:id', 
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }

    next();
  },
  param('id').trim().isInt({ min: 1 }).withMessage('id should be int').toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new Error());

    const { id } = matchedData(req, { locations: ['params'] });

    try {
      const isUserOwnerOfPost = await db.isPostsFromOwner(req.user.id, id);
      if (!req.user.admin && !isUserOwnerOfPost) return res.redirect('/');

      await db.deletePost(id);
    } catch (err) {
      return next(err);
    }

    res.redirect('/');
  }
)

export default deleteRoute;