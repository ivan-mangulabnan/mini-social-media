import { Router } from "express";

const logoutRoute = Router();

logoutRoute.get('/', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  })

  res.redirect('/login');
});

export default logoutRoute;