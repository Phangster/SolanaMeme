import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Extract wallet from JWT token
    const wallet = getWalletFromRequest(request);
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { clicks = 1 } = body; // Default to 1 click if not specified

    // Validate clicks input
    if (typeof clicks !== 'number' || clicks < 1 || clicks > 100) {
      return NextResponse.json(
        { error: 'Invalid clicks value (must be 1-100)' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Update user clicks atomically
    const user = await User.findOneAndUpdate(
      { wallet },
      { $inc: { clicks } },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to update user clicks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet: user.wallet,
      clicks: user.clicks,
      clicksAdded: clicks,
      message: `Successfully added ${clicks} click${clicks > 1 ? 's' : ''} for ${wallet}`,
    });

  } catch (error) {
    console.error('Error updating user clicks:', error);
    return NextResponse.json(
      { error: 'Failed to update user clicks' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract wallet from JWT token
    const wallet = getWalletFromRequest(request);
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user clicks
    const user = await User.findOne({ wallet });
    
    if (!user) {
      return NextResponse.json({
        success: true,
        wallet,
        clicks: 0,
      });
    }

    return NextResponse.json({
      success: true,
      wallet: user.wallet,
      clicks: user.clicks,
    });

  } catch (error) {
    console.error('Error getting user clicks:', error);
    return NextResponse.json(
      { error: 'Failed to get user clicks' },
      { status: 500 }
    );
  }
}
