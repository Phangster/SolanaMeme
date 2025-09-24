import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { Comment } from '@/types/interfaces';

interface PostWithComments {
  _id: string;
  comments: Comment[];
}

// POST /api/posts/[postId]/comments - Add a comment
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

    // Find the post and add comment
    const post = await Post.findByIdAndUpdate(
      postId,
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
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get the newly added comment (last one in the array)
    const newComment = post.comments[post.comments.length - 1];
    
    return NextResponse.json({
      success: true,
      postId,
      totalComments: post.comments.length,
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

// GET /api/posts/[postId]/comments - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    const { postId } = await params;

    await dbConnect();

    // Find the post with comments
    const post = await Post.findById(postId).lean() as PostWithComments | null;
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get paginated comments (oldest first)
    const comments = post.comments
      .sort((a: Comment, b: Comment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(skip, skip + limit);

    // Get commenter profile info
    const commentsWithProfiles = await Promise.all(
      comments.map(async (comment: Comment) => {
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
      postId,
      comments: commentsWithProfiles,
      totalComments: post.comments.length,
      hasMore: skip + limit < post.comments.length,
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
