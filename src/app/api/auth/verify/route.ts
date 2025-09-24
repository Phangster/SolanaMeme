import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, isValidSolanaAddress } from '@/lib/solana-auth';
import { signJWT } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, signature, message } = body;

    // Validate required fields
    if (!wallet || !signature || !message) {
      return NextResponse.json(
        { error: 'Wallet, signature, and message are required' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValidSignature = verifySignature(message, signature, wallet);
    
    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find or create user
    let user = await User.findOne({ wallet: wallet.toLowerCase() });
    
    if (!user) {
      user = await User.create({
        wallet: wallet.toLowerCase(),
        clicks: 0,
      });
    }

    // Generate JWT token
    const token = signJWT({ wallet: wallet.toLowerCase() });

    return NextResponse.json({
      success: true,
      token,
      user: {
        wallet: user.wallet,
        clicks: user.clicks,
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Error verifying authentication:', error);
    return NextResponse.json(
      { error: 'Failed to verify authentication' },
      { status: 500 }
    );
  }
}
