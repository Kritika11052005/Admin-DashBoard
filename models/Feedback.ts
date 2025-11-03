import mongoose, { Schema, Model } from 'mongoose';
import { Feedback } from '@/types';

const FeedbackSchema = new Schema<Feedback>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    satisfaction: {
      type: String,
      enum: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Platform', 'Analysis', 'Support', 'Features'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeedbackModel: Model<Feedback> = 
  mongoose.models.Feedback || mongoose.model<Feedback>('Feedback', FeedbackSchema);

export default FeedbackModel;