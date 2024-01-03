import express from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const signUpRouter = express.Router();

const validations = [
  body('firstname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be 100 characters or below')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be 100 characters or below')
    .escape(),
  body('username')
    .trim()
    .toLowerCase()
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .isLength({ max: 100 })
    .withMessage('Username must be 100 characters or below')
    .custom(async (username) => {
      const user = await User.find({ username });
      if (user) throw new Error('Username already taken');
    })
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be 8 or more characters long')
    .isLength({ max: 30 })
    .withMessage('Password must be 30 characters or below')
    .escape(),
  body('confirmPassword')
    .escape()
    .custom((confirmPassword: string, { req }) => {
      return confirmPassword === req.body.password;
    })
    .withMessage('Confirm password does not match'),
];

signUpRouter.get('/', (req, res) => {
  res.render('sign-up');
});

signUpRouter.post('/', ...validations, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('sign-up', {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      errors: errors.mapped(),
    });
  }

  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    // An error occurred
    if (err) return next(err);

    // All's well, save the new user with the hashed password
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashedPassword,
      role: 'visitor',
    });

    await user.save();
    res.redirect('/');
  });
}));

export default signUpRouter;
