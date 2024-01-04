import express from 'express';
import asyncHandler from 'express-async-handler';
import Message from '../models/Message';

const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const messages = await Message.find().sort({ timestamp: -1 }).populate('user').exec();

  res.render('index', {
    messages,
  });
}));

const indexRouter = router;
export default indexRouter;
