import express from 'express';

const logoutRouter = express.Router();

logoutRouter.get('/', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default logoutRouter;