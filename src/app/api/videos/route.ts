import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const uploader = searchParams.get('uploader');

    // Connect to database
    await dbConnect();

    // Build query
    const query: { status?: string; uploader?: string } = {};
    
    // Only add status filter if provided
    if (status) {
      query.status = status;
    }
    
    if (uploader) {
      query.uploader = uploader.toLowerCase();
    }

    // Get videos with pagination
    const videos = await Video.find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('uploader publicId secureUrl title description uploadedAt likes views')
      .lean();

    // Get comment counts for all videos
    const videoIds = videos.map(video => new mongoose.Types.ObjectId(video._id.toString()));
    
    console.log('Debug - Main videos API - Video IDs:', videoIds);
    console.log('Debug - Main videos API - Status filter:', status);
    
    const commentCounts = await Comment.aggregate([
      {
        $match: {
          contentId: { $in: videoIds },
          contentType: 'video'
        }
      },
      {
        $group: {
          _id: '$contentId',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Debug - Main videos API - Comment counts:', commentCounts);

    // Create a map of video ID to comment count
    const commentCountMap = commentCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {} as Record<string, number>);

    console.log('Debug - Main videos API - Comment count map:', commentCountMap);

    // Add computed fields
    const videosWithStats = videos.map(video => ({
      ...video,
      likesCount: video.likes?.length || 0,
      commentsCount: commentCountMap[video._id.toString()] || 0,
      // Include likes array for modal functionality
      likes: video.likes || [],
    }));

    const totalVideos = await Video.countDocuments(query);

    return NextResponse.json({
      success: true,
      videos: videosWithStats,
      pagination: {
        page,
        limit,
        total: totalVideos,
        pages: Math.ceil(totalVideos / limit),
      },
    });

  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to get videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
