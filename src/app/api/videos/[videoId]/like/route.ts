import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';
import { Like } from '@/types/interfaces';
import User from '@/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    // Extract wallet from JWT token
    const wallet = getWalletFromRequest(request);
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { videoId } = await params;

    // Connect to database
    await dbConnect();

    // Find the video
    const video = await Video.findById(videoId);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this video
    const existingLike = video.likes.find((like: Like) => like.wallet === wallet);
    
    if (existingLike) {
      return NextResponse.json(
        { error: 'You have already liked this video' },
        { status: 400 }
      );
    }

    // Add like to video
    video.likes.push({ wallet });
    await video.save();

    // Update like count in user's uploadedVideos array if this is their video
    if (video.uploader === wallet) {
      await User.findOneAndUpdate(
        { 
          wallet: video.uploader,
          'uploadedVideos.publicId': video.publicId 
        },
        {
          $inc: { 'uploadedVideos.$.likes': 1 }
        }
      );
    }

    return NextResponse.json({
      success: true,
      videoId,
      totalLikes: video.likes.length,
      message: 'Video liked successfully',
    });

  } catch (error) {
    console.error('Error liking video:', error);
    return NextResponse.json(
      { error: 'Failed to like video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    // Extract wallet from JWT token
    const wallet = getWalletFromRequest(request);
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { videoId } = await params;

    // Connect to database
    await dbConnect();

    // Find the video and remove like
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $pull: { likes: { wallet } }
      },
      { new: true }
    );
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Update like count in user's uploadedVideos array if this is their video
    if (video.uploader === wallet) {
      await User.findOneAndUpdate(
        { 
          wallet: video.uploader,
          'uploadedVideos.publicId': video.publicId 
        },
        {
          $inc: { 'uploadedVideos.$.likes': -1 }
        }
      );
    }

    return NextResponse.json({
      success: true,
      videoId,
      totalLikes: video.likes.length,
      message: 'Like removed successfully',
    });

  } catch (error) {
    console.error('Error unliking video:', error);
    return NextResponse.json(
      { error: 'Failed to unlike video' },
      { status: 500 }
    );
  }
}
