import { Router } from "express";
import loginRoute from "./login.js";
import signUpRoute from "./sign-up.js";
import { body, matchedData, validationResult } from "express-validator";
import db from '../db/queries/post.js';
import memberRoute from "./member-sign-up.js";
import logoutRoute from "./logout.js";
import adminRoute from "./admin-sign-up.js";
import deleteRoute from "./delete.js";

const router = Router();

router.use('/login', loginRoute);
router.use('/sign-up', signUpRoute);
router.use('/member-sign-up', memberRoute);
router.use('/admin-sign-up', adminRoute);
router.use('/delete', deleteRoute);
router.use('/logout', logoutRoute);

router.get('/', (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  next();
}, (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
}, async (req, res, next) => {
  try {
    res.locals.posts = await db.getPosts();
  } catch (err) {
    return next(err);
  }

  res.render('index');
});

router.post('/', (req, res, next) => {
 if (!req.isAuthenticated()) return res.redirect('/login');
 next();
}, [
  body('message').trim().notEmpty().withMessage('message should not be empty')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error(JSON.stringify(errors.array())));
  const { message } = matchedData(req, { locations: ['body'] });
  try {
    await db.createPost(req.user.id, message);
  } catch (err) {
    return next(err)
  }

  res.redirect('/');
})

router.use((err, req, res, next) => {
  return res.send('Something went wrong in index route');
})

export default router;