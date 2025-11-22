import { Router } from "express";
import loginRoute from "./login.js";
import signUpRoute from "./sign-up.js";
import passport from "passport";

const router = Router();

router.use('/login', loginRoute);
router.use('/sign-up', signUpRoute);
router.get('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

export default router;