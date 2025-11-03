import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get country distribution
    const countryData = await UserModel.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalUsers = await UserModel.countDocuments();

    const data = countryData.map((item) => ({
      country: item._id,
      count: item.count,
      percentage: Math.round((item.count / totalUsers) * 100 * 10) / 10,
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