import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import crypto from 'crypto';

export interface AuthChallenge {
  nonce: string;
  message: string;
}

export function generateAuthChallenge(): AuthChallenge {
  const nonce = crypto.randomBytes(32).toString('hex');
  const message = `Sign this message to authenticate with YaoMe: ${nonce}`;
  
  return {
    nonce,
    message,
  };
}

export function verifySignature(
  message: string,
  signature: string,
  walletAddress: string
): boolean {
  try {
    // Convert signature from base64 to Uint8Array
    const signatureBytes = Buffer.from(signature, 'base64');
    
    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);
    
    // Convert wallet address to PublicKey
    const publicKey = new PublicKey(walletAddress);
    
    // Verify the signature
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
