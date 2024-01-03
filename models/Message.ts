import { ObjectId, Schema, model } from 'mongoose';
import { IUser } from './User';

export interface IMessage {
  title: string;
  timestamp: Date;
  content: string;
  user: ObjectId | IUser;
}

const MessageSchema = new Schema<IMessage>({
  title: {
    type: String,
    maxlength: 1200,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    maxlength: 5000,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

export default model('Message', MessageSchema);
