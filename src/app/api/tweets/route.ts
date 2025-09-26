import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TweetConfig from '@/models/Tweet';

// GET /api/tweets - Fetch tweet URLs array
export async function GET() {
  try {
    await connectToDatabase();
    
    let config = await TweetConfig.findOne({}).lean();
    
    // If no config exists, create one with empty array
    if (!config) {
      const newConfig = new TweetConfig({ urls: [] });
      await newConfig.save();
      config = newConfig.toObject();
    }

    return NextResponse.json({ 
      success: true, 
      tweets: (config as unknown as { urls: string[] })?.urls || []
    });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}