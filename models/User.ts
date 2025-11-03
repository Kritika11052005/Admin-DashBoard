import mongoose, { Schema, Model } from 'mongoose';
import { User } from '@/types';

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    cvScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    careerStage: {
      type: String,
      enum: ['Fresher', 'Graduate', 'Experienced'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;