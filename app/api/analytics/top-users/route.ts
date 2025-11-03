import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const topUsers = await UserModel.find()
      .sort({ cvScore: -1 })
      .limit(limit)
      .select('name email cvScore country isPaid');

    const data = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      email: user.email,
      cvScore: user.cvScore,
      country: user.country,
      isPaid: user.isPaid,
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