import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CountryClicks from '@/models/CountryClicks';

export async function GET() {
  try {
    await dbConnect();

    // Get top 20 countries sorted by clicks (descending)
    const leaderboard = await CountryClicks.find({})
      .sort({ clicks: -1 })
      .limit(20)
      .select('country clicks updatedAt')
      .lean();

    return NextResponse.json({
      success: true,
      leaderboard,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
