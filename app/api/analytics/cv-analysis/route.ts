import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CVAnalysisModel from '@/models/CVAnalysis';

export async function GET() {
  try {
    await connectDB();

    // Get CV analysis trends by day for last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const trends = await CVAnalysisModel.aggregate([
      {
        $match: {
          analysisDate: { $gte: ninetyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$analysisDate' },
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = trends.map((item) => ({
      date: item._id,
      count: item.count,
      avgScore: Math.round(item.avgScore * 10) / 10,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}