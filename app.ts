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
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import MongoStore from 'connect-mongo';
import createMessageRouter from './routes/create-message';
import joinClubRouter from './routes/join-club';
import messageRouter from './routes/message';

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
const dbString = process.env.MONGODB_CONNECTION_STRING;
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbString,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14, // set cookie for 2 weeks
  },
}));

// setup passport
app.use(passport.initialize());
app.use(passport.session());

// access current user in views
// without having to pass it in render()
declare global {
  namespace Express {
    interface Locals {
      currentUser: Express.User | undefined;
      canViewAuthorAndDate: boolean;
      canDeleteMessages: boolean;
    }
  }
}

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// put permissions in locals
app.use((req, res, next) => {
  res.locals.canViewAuthorAndDate = ['owner', 'admin', 'member'].includes(res.locals.currentUser?.role ?? '');
  res.locals.canDeleteMessages = ['owner', 'admin'].includes(res.locals.currentUser?.role ?? '');
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/sign-up', signUpRouter);
app.use('/join-club', joinClubRouter);
app.use('/create-message', createMessageRouter);
app.use('/message', messageRouter);

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
