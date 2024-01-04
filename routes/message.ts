import express from 'express';
import asyncHandler from 'express-async-handler';
import { param, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import Message from '../models/Message';

const messageRouter = express.Router();

const validations = [
  param('id')
    .custom(async (id) => {
      if (!isValidObjectId(id)) {
        throw new Error('Invalid object param id');
      }
    }),
];

messageRouter.post('/:id/delete', ...validations, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !res.locals.canDeleteMessages || !req.params) {
    // Do nothing if there are errors
    // or does not have permission to delete
    // or params is undefined
    return res.redirect('/');
  }

  // Delete message
  await Message.findByIdAndDelete(req.params.id);
  res.redirect('/');
}));

export default messageRouter;
