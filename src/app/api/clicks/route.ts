import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CountryClicks from '@/models/CountryClicks';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { country, clicks } = await request.json();

    if (!country || typeof clicks !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { country, clicks }' },
        { status: 400 }
      );
    }

    // Use findOneAndUpdate with upsert to increment clicks
    const result = await CountryClicks.findOneAndUpdate(
      { country },
      { $inc: { clicks } },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    // Trigger WebSocket broadcast by calling the standalone server
    try {
      const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
      
      const response = await fetch(`${websocketUrl}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateLeaderboard' })
      });
      
      if (!response.ok) {
        console.log('⚠️ WebSocket broadcast failed with status:', response.status);      
      }
    } catch (websocketError: unknown) {
      const errorMessage = websocketError instanceof Error ? websocketError.message : 'Unknown error';
      console.log('❌ WebSocket broadcast error:', errorMessage);
      console.log('⚠️ Database update succeeded, but real-time updates may not work');
    }

    return NextResponse.json({
      success: true,
      country: result.country,
      clicks: result.clicks,
      message: `Successfully updated clicks for ${country}`,
      realtime: 'WebSocket broadcast triggered'
    });

  } catch (error) {
    console.error('Error in /api/clicks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
