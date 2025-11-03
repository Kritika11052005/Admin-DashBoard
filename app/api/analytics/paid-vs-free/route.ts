import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const [paidUsers, freeUsers, totalUsers] = await Promise.all([
      UserModel.countDocuments({ isPaid: true }),
      UserModel.countDocuments({ isPaid: false }),
      UserModel.countDocuments(),
    ]);

    // Growth trends over last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const growthTrends = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            isPaid: '$isPaid',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary: [
          {
            type: 'Paid',
            count: paidUsers,
            percentage: Math.round((paidUsers / totalUsers) * 100 * 10) / 10,
          },
          {
            type: 'Free',
            count: freeUsers,
            percentage: Math.round((freeUsers / totalUsers) * 100 * 10) / 10,
          },
        ],
        trends: growthTrends,
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