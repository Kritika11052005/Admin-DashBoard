import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FeedbackModel from '@/models/Feedback';

export async function GET() {
  try {
    await connectDB();

    // Rating distribution
    const ratingDistribution = await FeedbackModel.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await FeedbackModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Satisfaction breakdown
    const satisfactionBreakdown = await FeedbackModel.aggregate([
      {
        $group: {
          _id: '$satisfaction',
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate average rating
    const avgRating = await FeedbackModel.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const totalFeedback = await FeedbackModel.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        totalFeedback,
        avgRating: avgRating[0]?.avgRating 
          ? Math.round(avgRating[0].avgRating * 10) / 10 
          : 0,
        ratingDistribution: ratingDistribution.map((item) => ({
          rating: item._id,
          count: item.count,
          percentage: Math.round((item.count / totalFeedback) * 100 * 10) / 10,
        })),
        categoryBreakdown: categoryBreakdown.map((item) => ({
          category: item._id,
          count: item.count,
        })),
        satisfactionBreakdown: satisfactionBreakdown.map((item) => ({
          satisfaction: item._id,
          count: item.count,
        })),
      },
    });
  }catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}