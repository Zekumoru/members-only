import express from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

const createMessageRouter = express.Router();

const validations = [
  body('title')
    .isLength({ min: 1 })
    .withMessage('Title is required')
    .isLength({ max: 1200 })
    .withMessage('Title must be less than 1200 characters')
    .escape(),
  body('content')
    .isLength({ max: 5000 })
    .withMessage('Message content has a limit of 5000 characters')
    .escape(),
];

createMessageRouter.get('/', (req, res) => {
  if (res.locals && !res.locals.currentUser) {
    // User not logged in so redirect
    return res.redirect('/');
  }

  res.render('create-message');
});

createMessageRouter.post('/', ...validations, asyncHandler((req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('create-message', {
      title: req.body.title,
      content: req.body.content,
      errors: errors.mapped(),
    });
  }

  res.redirect('/');
}));

export default createMessageRouter;
