import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';
import User from '@/models/User';
import { Comment } from '@/types/interfaces';

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
    const body = await request.json();
    const { content } = body;

    // Validate comment content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the video and add comment
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $push: {
          comments: {
            wallet,
            content: content.trim(),
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Get the newly added comment (last one in the array)
    const newComment = video.comments[video.comments.length - 1];
    
    return NextResponse.json({
      success: true,
      videoId,
      totalComments: video.comments.length,
      comment: {
        _id: newComment._id,
        wallet: newComment.wallet,
        content: newComment.content,
        createdAt: newComment.createdAt
      },
      message: 'Comment added successfully',
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    // Connect to database
    await dbConnect();

    // Get video comments
    const video = await Video.findById(videoId).select('comments');
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Sort comments by creation date (oldest first)
    const sortedComments = video.comments.sort((a: Comment, b: Comment) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Get commenter profile info
    const commentsWithProfiles = await Promise.all(
      sortedComments.map(async (comment: Comment) => {
        const commenter = await User.findOne(
          { wallet: comment.wallet }, 
          'wallet profilePicture'
        ).lean();
        
        // Convert Mongoose document to plain object
        const commentObj = 'toObject' in comment && typeof comment.toObject === 'function' 
          ? comment.toObject() 
          : comment;
        
        return {
          ...commentObj,
          commenterInfo: commenter || { wallet: comment.wallet, profilePicture: null },
        };
      })
    );

    return NextResponse.json({
      success: true,
      videoId,
      comments: commentsWithProfiles,
      totalComments: video.comments.length,
    });

  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}
