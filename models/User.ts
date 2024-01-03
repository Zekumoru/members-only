import { Schema, model } from 'mongoose';

export interface IUser {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  role: "owner" | "admin" | "member" | "visitor";
};

const UserSchema = new Schema<IUser>({
  firstname: {
    type: String,
    maxlength: 100,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 100,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    maxlength: 100,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: String,
});

export default model('User', UserSchema);
