import mongoose, { Schema, Model } from 'mongoose';
import { CVAnalysis } from '@/types';

const CVAnalysisSchema = new Schema<CVAnalysis>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    analysisDate: {
      type: Date,
      required: true,
    },
    improvements: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CVAnalysisModel: Model<CVAnalysis> = 
  mongoose.models.CVAnalysis || mongoose.model<CVAnalysis>('CVAnalysis', CVAnalysisSchema);

export default CVAnalysisModel;