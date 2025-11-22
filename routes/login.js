import { Router } from "express";

const loginRoute = Router();

loginRoute.get('/', (req, res) => {
  res.render('login');
})

export default loginRoute;