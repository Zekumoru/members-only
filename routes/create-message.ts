import express from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Message from '../models/Message';

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

  res.render('create-message', {
    documentTitle: 'Members-Only | Create new message'
  });
});

createMessageRouter.post('/', ...validations, asyncHandler(async (req, res) => {
  if (res.locals && !res.locals.currentUser) {
    // User is not logged in so redirect to home page
    return res.redirect('/');
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('create-message', {
      documentTitle: 'Members-Only | Create new message',
      title: req.body.title,
      content: req.body.content,
      errors: errors.mapped(),
    });
  }

  const message = new Message({
    title: req.body.title,
    content: req.body.content,
    user: res.locals.currentUser
  });

  await message.save();
  res.redirect('/');
}));

export default createMessageRouter;
