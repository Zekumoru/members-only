import { Types } from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

declare global {
  namespace Express {
    interface User extends IUser {
      _id: Types.ObjectId;
    }
  }
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Username already taken' });
      }
      const passwordsMatched = await bcrypt.compare(password, user.password);
      if (!passwordsMatched) {
        return done(null, false, { message: 'Password is incorrect' });
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser<Types.ObjectId>((user, done) => {
  done(null, user._id);
});

passport.deserializeUser<Types.ObjectId>(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});