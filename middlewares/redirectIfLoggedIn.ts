import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  if (res.locals.currentUser) {
    return res.redirect('/');
  }

  next();
};
