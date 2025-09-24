import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Video from '@/models/Video';


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
    const { publicId, secureUrl, title, description, uploadedAt } = body;

    // Validate required fields
    if (!publicId || !secureUrl || !title || !description) {
      return NextResponse.json(
        { error: 'Public ID, secure URL, title, and description are required' },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Validate description length
    if (description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Create video record in dedicated Video collection
    const video = await Video.create({
      uploader: wallet,
      publicId,
      secureUrl,
      title: title.trim(),
      description: description.trim(),
      uploadedAt: uploadedAt || new Date(),
      status: 'pending',
      likes: [],
      comments: [],
      views: 0,
    });

    // Also add video to user's uploadedVideos array
    await User.findOneAndUpdate(
      { wallet },
      {
        $push: {
          uploadedVideos: {
            publicId,
            secureUrl,
            title: title.trim(),
            description: description.trim(),
            uploadedAt: uploadedAt || new Date(),
            status: 'pending',
            likes: 0,
            views: 0,
          }
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      video: {
        id: video._id,
        publicId: video.publicId,
        title: video.title,
        description: video.description,
        status: video.status,
        uploadedAt: video.uploadedAt,
      },
      message: 'Video uploaded successfully and pending moderation',
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Video with this ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save video metadata' },
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

    // Get user's uploaded videos from Video collection (has full data including likes, views, etc.)
    const videos = await Video.find({ uploader: wallet })
      .sort({ uploadedAt: -1 })
      .select('publicId secureUrl title description status uploadedAt likes comments views')
      .lean();

    // Add computed fields
    const videosWithStats = videos.map(video => ({
      ...video,
      likesCount: video.likes?.length || 0,
      commentsCount: video.comments?.length || 0,
      // Keep the full likes array for detailed display
      likes: video.likes || [],
    }));

    return NextResponse.json({
      success: true,
      videos: videosWithStats,
      count: videosWithStats.length,
    });

  } catch (error) {
    console.error('Error getting user videos:', error);
    return NextResponse.json(
      { error: 'Failed to get user videos' },
      { status: 500 }
    );
  }
}
