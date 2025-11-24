import { Router } from "express";
import loginRoute from "./login.js";
import signUpRoute from "./sign-up.js";
import { body, matchedData, validationResult } from "express-validator";
import db from '../db/queries/post.js';
import memberRoute from "./member-sign-up.js";
import logoutRoute from "./logout.js";

const router = Router();

router.use('/login', loginRoute);
router.use('/sign-up', signUpRoute);
router.use('/member-sign-up', memberRoute);
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
  body('id').trim().notEmpty().withMessage('id should not be empty').isInt({ min: 1 }).withMessage('id should be a number').custom((value, { req }) => {
    if (req.user.id !== parseInt(value)) throw new Error('id do not match');
    return true;
  }),
  body('message').trim().notEmpty().withMessage('message should not be empty')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error(JSON.stringify(errors.array())));
  const { id, message } = matchedData(req, { locations: ['body'] });
  try {
    await db.createPost(id, message);
  } catch (err) {
    return next(err)
  }

  res.redirect('/');
})

router.use((err, req, res, next) => {
  return res.send('Something went wrong in index route');
})

export default router;