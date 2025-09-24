import { NextRequest, NextResponse } from 'next/server';
import { generateAuthChallenge, isValidSolanaAddress } from '@/lib/solana-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet } = body;

    // Validate wallet address
    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Generate challenge
    const challenge = generateAuthChallenge();

    return NextResponse.json({
      success: true,
      challenge: challenge.message,
      nonce: challenge.nonce,
    });

  } catch (error) {
    console.error('Error generating authentication challenge:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication challenge' },
      { status: 500 }
    );
  }
}
