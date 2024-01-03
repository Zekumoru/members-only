import express from 'express';

const signUpRouter = express.Router();

signUpRouter.get('/', (req, res) => {
  res.render('sign-up');
});

export default signUpRouter;
