import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';
import User from '@/models/User';
import Comment from '@/models/Comment';
import { Comment as CommentType } from '@/types/interfaces';
import mongoose from 'mongoose';

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
    const { content, parentCommentId } = body;

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

    // Verify the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Create comment in separate Comment model
    const commentData: any = {
      wallet,
      content: content.trim(),
      contentId: new mongoose.Types.ObjectId(videoId),
      contentType: 'video'
    };

    // Add parentCommentId if this is a reply
    if (parentCommentId) {
      commentData.parentCommentId = new mongoose.Types.ObjectId(parentCommentId);
    }

    const savedComment = new Comment(commentData);
    await savedComment.save();
    
    return NextResponse.json({
      success: true,
      videoId,
      comment: {
        _id: savedComment._id,
        wallet: savedComment.wallet,
        content: savedComment.content,
        createdAt: savedComment.createdAt,
        parentCommentId: savedComment.parentCommentId,
        likes: savedComment.likes || [],
        contentId: savedComment.contentId,
        contentType: savedComment.contentType
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

    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Get comments from Comment model
    const allComments = await Comment.find({
      contentId: new mongoose.Types.ObjectId(videoId),
      contentType: 'video'
    }).sort({ createdAt: 1 });

    // Separate top-level comments and replies
    const topLevelComments = allComments.filter((comment: any) => !comment.parentCommentId);
    const replies = allComments.filter((comment: any) => comment.parentCommentId);
    

    // Get commenter profile info for all comments
    const getCommenterInfo = async (comment: any) => {
      const commenter = await User.findOne(
        { wallet: comment.wallet }, 
        'wallet profilePicture'
      ).lean();
      
      const commentObj = 'toObject' in comment && typeof comment.toObject === 'function' 
        ? comment.toObject() 
        : comment;
      
      return {
        ...commentObj,
        commenterInfo: commenter || { wallet: comment.wallet, profilePicture: null },
      };
    };

    // Build threaded structure
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment: any) => {
        const commentWithProfile = await getCommenterInfo(comment);
        
        // Find replies for this comment
        const commentReplies = replies.filter((reply: any) => {
          if (!reply.parentCommentId || !comment._id) return false;
          // Handle both ObjectId and string comparisons
          const replyParentId = reply.parentCommentId.toString();
          const commentId = comment._id.toString();
          return replyParentId === commentId;
        });
        
        // Get profile info for replies
        const repliesWithProfiles = await Promise.all(
          commentReplies.map((reply: any) => getCommenterInfo(reply))
        );
        
        return {
          ...commentWithProfile,
          replies: repliesWithProfiles
        };
      })
    );

    
    return NextResponse.json({
      success: true,
      videoId,
      comments: commentsWithReplies,
      totalComments: topLevelComments.length,
    });

  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}
