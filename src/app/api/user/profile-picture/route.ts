import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Upload profile picture
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
    const { publicId, secureUrl } = body;

    // Validate required fields
    if (!publicId || !secureUrl) {
      return NextResponse.json(
        { error: 'publicId and secureUrl are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find and update user
    const user = await User.findOneAndUpdate(
      { wallet },
      {
        $set: {
          profilePicture: {
            publicId,
            secureUrl,
            uploadedAt: new Date(),
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to update profile picture' },
      { status: 500 }
    );
  }
}

// Get profile picture
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

    // Find user
    const user = await User.findOne({ wallet }).select('profilePicture');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profilePicture: user.profilePicture || null,
    });

  } catch (error) {
    console.error('Error getting profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to get profile picture' },
      { status: 500 }
    );
  }
}

// Delete profile picture
export async function DELETE(request: NextRequest) {
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

    // Find and update user to remove profile picture
    const user = await User.findOneAndUpdate(
      { wallet },
      {
        $unset: { profilePicture: 1 }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile picture removed successfully',
    });

  } catch (error) {
    console.error('Error removing profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to remove profile picture' },
      { status: 500 }
    );
  }
}
