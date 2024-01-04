import { Schema, Types, model } from 'mongoose';
import { IUser } from './User';
import { format } from 'date-fns';

export interface IMessage {
  title: string;
  timestamp: Date;
  content: string;
  user: Types.ObjectId | IUser;
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
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

MessageSchema.virtual('formattedDate').get(function () {
  return format(this!.timestamp, `MMM d, yyyy (hh:mm:ss aa)`);
});

export default model('Message', MessageSchema);
