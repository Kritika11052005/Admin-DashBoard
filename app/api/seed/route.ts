import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import CVAnalysisModel from '@/models/CVAnalysis';
import FeedbackModel from '@/models/Feedback';
import { generateUsers, generateCVAnalyses, generateFeedback } from '@/lib/seed-data';

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await UserModel.deleteMany({});
    await CVAnalysisModel.deleteMany({});
    await FeedbackModel.deleteMany({});

    // Generate and insert users
    const usersData = generateUsers(200);
    const users = await UserModel.insertMany(usersData);
    console.log(`✅ Created ${users.length} users`);

    // Generate CV analyses
    const userIds = users.map(u => u._id.toString());
    const analysesData = generateCVAnalyses(userIds);
    const analyses = await CVAnalysisModel.insertMany(analysesData);
    console.log(`✅ Created ${analyses.length} CV analyses`);

    // Generate feedback
    const feedbackData = generateFeedback(userIds);
    const feedback = await FeedbackModel.insertMany(feedbackData);
    console.log(`✅ Created ${feedback.length} feedback entries`);

    return NextResponse.json({
      success: true,
      message: '🎉 Database seeded successfully!',
      data: {
        users: users.length,
        analyses: analyses.length,
        feedback: feedback.length,
      },
    });
  } catch (error: unknown) {
    console.error('Seed error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to seed the database',
    endpoint: 'POST /api/seed',
  });
}