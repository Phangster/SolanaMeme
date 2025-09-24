import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface JWTPayload {
  wallet: string;
  iat?: number;
  exp?: number;
}

export function signJWT(payload: { wallet: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export function getWalletFromRequest(request: NextRequest): string | null {
  const token = extractTokenFromRequest(request);
  
  
  if (!token) {
    return null;
  }
  
  const payload = verifyJWT(token);
  
  if (!payload?.wallet) {
    return null;
  }
  
  return payload.wallet;
}
