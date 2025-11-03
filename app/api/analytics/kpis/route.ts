import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import CVAnalysisModel from '@/models/CVAnalysis';
import FeedbackModel from '@/models/Feedback';

export async function GET() {
  try {
    await connectDB();

    // Get all data in parallel
    const [totalUsers, totalAnalyses, allScores, totalFeedback, paidUsers] = await Promise.all([
      UserModel.countDocuments(),
      CVAnalysisModel.countDocuments(),
      UserModel.find({}, 'cvScore'),
      FeedbackModel.countDocuments(),
      UserModel.countDocuments({ isPaid: true }),
    ]);

    // Calculate average CV score
    const avgCVScore = allScores.length > 0
      ? allScores.reduce((sum, user) => sum + user.cvScore, 0) / allScores.length
      : 0;

    // Calculate paid user percentage
    const paidUserPercentage = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

    // Calculate user growth (comparing last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [recentUsers, previousUsers] = await Promise.all([
      UserModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      UserModel.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    ]);

    const userGrowth = previousUsers > 0 
      ? ((recentUsers - previousUsers) / previousUsers) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalAnalyses,
        avgCVScore: Math.round(avgCVScore * 10) / 10,
        totalFeedback,
        paidUserPercentage: Math.round(paidUserPercentage * 10) / 10,
        userGrowth: Math.round(userGrowth * 10) / 10,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}