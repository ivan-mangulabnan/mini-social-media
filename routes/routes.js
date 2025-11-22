import { Router } from "express";
import loginRoute from "./login.js";
import signUpRoute from "./sign-up.js";

const router = Router();

router.use('/login', loginRoute);
router.use('/sign-up', signUpRoute);
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render('index'); 
});

export default router;