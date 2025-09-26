import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromRequest } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

// GET /api/posts - Fetch posts for feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const status = searchParams.get('status') || 'approved';

    await dbConnect();

    // Fetch posts with author info
    const posts = await Post.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 50)) // Cap at 50 posts per request
      .lean();

    // Get comment counts for all posts
    const postIds = posts.map(post => new mongoose.Types.ObjectId(post._id));
    const commentCounts = await Comment.aggregate([
      {
        $match: {
          contentId: { $in: postIds },
          contentType: 'post'
        }
      },
      {
        $group: {
          _id: '$contentId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of post ID to comment count
    const commentCountMap = commentCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Get author profile info for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findOne({ wallet: post.author }, 'wallet profilePicture').lean();
        return {
          ...post,
          authorInfo: author || { wallet: post.author, profilePicture: null },
          likesCount: post.likes?.length || 0,
          commentsCount: commentCountMap[post._id.toString()] || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      posts: postsWithAuthors,
      count: postsWithAuthors.length,
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
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
    const { content, imageUrl } = body;

    // Validate required fields
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Post content must be 2000 characters or less' },
        { status: 400 }
      );
    }

    // Validate image URL if provided
    if (imageUrl && typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Image URL must be a valid string' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Create post
    const post = await Post.create({
      author: wallet,
      content: content.trim(),
      imageUrl: imageUrl?.trim() || null,
      status: 'approved', // Auto-approve text posts
      likes: [],
      comments: [],
      views: 0,
    });

    // Get author info for response
    const author = await User.findOne({ wallet }, 'wallet profilePicture').lean();

    return NextResponse.json({
      success: true,
      post: {
        _id: post._id,
        author: post.author,
        content: post.content,
        imageUrl: post.imageUrl,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likesCount: 0,
        commentsCount: 0,
        views: 0,
        authorInfo: author || { wallet, profilePicture: null },
      },
      message: 'Post created successfully',
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
