import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { Like } from '@/types/interfaces';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
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

    const { postId } = await params;

    // Connect to database
    await dbConnect();

    // Find the post
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this post
    const existingLikeIndex = post.likes.findIndex(
      (like: Like) => like.wallet === wallet
    );

    let action = '';
    
    if (existingLikeIndex > -1) {
      // Unlike - remove the like
      post.likes.splice(existingLikeIndex, 1);
      action = 'unliked';
    } else {
      // Like - add the like
      post.likes.push({ wallet });
      action = 'liked';
    }

    // Save the updated post
    await post.save();

    return NextResponse.json({
      success: true,
      postId,
      action,
      likesCount: post.likes.length,
      isLiked: action === 'liked',
      message: `Post ${action} successfully`,
    });

  } catch (error) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json(
      { error: 'Failed to like/unlike post' },
      { status: 500 }
    );
  }
}
