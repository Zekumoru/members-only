import createError from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes';
import signUpRouter from './routes/sign-up';
import session from 'express-session';
import passport from 'passport';
import './setup/passport';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionSecret = process.env.SESSION_SECRET ?? 'some secret';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

// setup passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(
  (
    err: {
      message: string;
      status: number;
    },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
);

export default app;
