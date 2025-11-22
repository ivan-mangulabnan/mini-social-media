import { Router } from "express";
import loginRoute from "./login.js";
import passport from "passport";

const router = Router();

router.use('/login', loginRoute);
router.get('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

export default router;