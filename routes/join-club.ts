import express from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const joinClubRouter = express.Router();

const adminHashedPassword = process.env.ADMIN_PASSWORD;
const memberHashedPassword = process.env.MEMBER_PASSWORD;

const validations = [
  body('password')
    .isLength({ min: 1 })
    .withMessage('Secret password is required')
    .custom(async (password) => {
      const adminMatched = await bcrypt.compare(password, adminHashedPassword ?? '');
      const memberMatched = await bcrypt.compare(password, memberHashedPassword ?? '');
      if (!(adminMatched || memberMatched)) {
        throw new Error('Uh oh, your password is invalid');
      }
    })
    .escape(),
];

joinClubRouter.get('/', (req, res) => {
  if (res.locals && !res.locals.currentUser) {
    // User not logged in so redirect
    return res.redirect('/');
  }

  res.render('join-club');
});

joinClubRouter.post('/', ...validations, asyncHandler(async (req, res) => {
  if (!adminHashedPassword || !memberHashedPassword) {
    throw new Error('Admin/Member passwords are not set! Contact the developer.');
  }

  if (res.locals && !res.locals.currentUser) {
    // User is not logged in so redirect to home page
    return res.redirect('/');
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('join-club', {
      password: req.body.password,
      errors: errors.mapped(),
    });
  }

  const user = await User.findById(res.locals.currentUser!._id);
  if (!user) {
    // User does not exist, for some reason, so redirect to home page
    return res.redirect('/');
  }

  const adminMatched = await bcrypt.compare(req.body.password, adminHashedPassword ?? '');
  const memberMatched = await bcrypt.compare(req.body.password, memberHashedPassword ?? '');
  if (adminMatched) {
    user.role = 'admin';
  } else if (memberMatched) {
    user.role = 'member';
  }

  await user.save();
  res.redirect('/');
}));

export default joinClubRouter;
