import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
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

    const { postId, commentId } = await params;

    // Connect to database
    await dbConnect();

    // Find the comment in the Comment model
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Verify the comment belongs to this post
    if (comment.contentId.toString() !== postId || comment.contentType !== 'post') {
      return NextResponse.json(
        { error: 'Comment does not belong to this post' },
        { status: 400 }
      );
    }

    // Check if user already liked this comment
    const existingLike = comment.likes.find((like: any) => like.wallet === wallet);
    
    if (existingLike) {
      return NextResponse.json(
        { error: 'Comment already liked' },
        { status: 400 }
      );
    }

    // Add the like
    comment.likes.push({ wallet });
    await comment.save();

    return NextResponse.json({
      success: true,
      commentId,
      likesCount: comment.likes.length,
      isLiked: true,
      message: 'Comment liked successfully',
    });

  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
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

    const { postId, commentId } = await params;

    // Connect to database
    await dbConnect();

    // Find the comment in the Comment model
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Verify the comment belongs to this post
    if (comment.contentId.toString() !== postId || comment.contentType !== 'post') {
      return NextResponse.json(
        { error: 'Comment does not belong to this post' },
        { status: 400 }
      );
    }

    // Find and remove the like
    const likeIndex = comment.likes.findIndex((like: any) => like.wallet === wallet);
    
    if (likeIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not liked' },
        { status: 400 }
      );
    }

    comment.likes.splice(likeIndex, 1);
    await comment.save();

    return NextResponse.json({
      success: true,
      commentId,
      likesCount: comment.likes.length,
      isLiked: false,
      message: 'Comment unliked successfully',
    });

  } catch (error) {
    console.error('Error unliking comment:', error);
    return NextResponse.json(
      { error: 'Failed to unlike comment' },
      { status: 500 }
    );
  }
}
