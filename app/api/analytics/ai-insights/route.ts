import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import CVAnalysisModel from '@/models/CVAnalysis';
import FeedbackModel from '@/models/Feedback';
import { generateAIInsights, getFallbackInsights } from '@/lib/gemini';

export async function GET() {
  try {
    await connectDB();

    // Fetch all necessary data in parallel
    const [
      totalUsers,
      paidUsers,
      avgScoreResult,
      recentAnalyses,
      feedbackStats,
      countryDistribution,
      careerStageBreakdown
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ isPaid: true }),
      UserModel.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$cvScore' } } }
      ]),
      CVAnalysisModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      FeedbackModel.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      UserModel.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      UserModel.aggregate([
        { $group: { _id: '$careerStage', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const avgCVScore = avgScoreResult[0]?.avgScore || 0;
    const avgFeedbackRating = feedbackStats[0]?.avgRating || 0;
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;
    const topCountry = countryDistribution[0]?._id || 'N/A';
    const dominantCareerStage = careerStageBreakdown[0]?._id || 'N/A';

    // Prepare data for AI
    const analyticsData = {
      totalUsers,
      paidUsers,
      avgCVScore,
      avgFeedbackRating,
      conversionRate,
      recentAnalyses,
      topCountry,
      dominantCareerStage,
      countryDistribution: countryDistribution.map(c => ({
        country: c._id,
        count: c.count
      })),
      careerStageBreakdown: careerStageBreakdown.map(s => ({
        stage: s._id,
        count: s.count
      }))
    };

    let insights;
    let usingFallback = false;

    // Try Gemini AI first, fallback to rule-based if fails
    try {
      insights = await generateAIInsights(analyticsData);
      console.log('✅ Using Gemini AI insights');
    } catch (geminiError) {
      console.warn('⚠️ Gemini AI failed, using fallback insights:', geminiError);
      insights = getFallbackInsights(analyticsData);
      usingFallback = true;
    }

    return NextResponse.json({
      success: true,
      data: {
        insights,
        metrics: {
          totalUsers,
          conversionRate: Math.round(conversionRate * 10) / 10,
          avgCVScore: Math.round(avgCVScore * 10) / 10,
          avgFeedbackRating: Math.round(avgFeedbackRating * 10) / 10,
          recentAnalyses,
        },
        aiPowered: !usingFallback,
      }
    });
  } catch (error) {
    console.error('AI Insights Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'Failed to generate insights'
      },
      { status: 500 }
    );
  }
}