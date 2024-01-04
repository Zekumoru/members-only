import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import redirectIfLoggedIn from '../middlewares/redirectIfLoggedIn';

const loginRouter = express.Router();

const validations = [
  body('username')
    .trim()
    .toLowerCase()
    .isLength({ min: 1 })
    .withMessage('Please put in your username')
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User does not exist');
    })
    .escape(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Please put in your password')
    .custom(async (password, { req }) => {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return;

      const passwordsMatched = await bcrypt.compare(password, user.password);
      if (!passwordsMatched) throw new Error('Password is incorrect');
    })
    .escape(),
];

loginRouter.get('/', redirectIfLoggedIn, (req, res) => {
  res.render('login', {
    documentTitle: 'Members-Only | Login'
  });
});

loginRouter.post('/', ...validations, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('login', {
      documentTitle: 'Members-Only | Login',
      username: req.body.username,
      password: req.body.password,
      errors: errors.mapped(),
    });
  }

  next();
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

export default loginRouter;
