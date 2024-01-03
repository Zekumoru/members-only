import express from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

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
    // TODO: Create validator to check if username already exists
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .isLength({ max: 100 })
    .withMessage('Username must be 100 characters or below')
    .escape(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
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

signUpRouter.post('/', ...validations, asyncHandler((req, res) => {
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

  res.redirect('/');
}));

export default signUpRouter;
