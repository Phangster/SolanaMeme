import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export const createKeypairFromPrivateKey = (privateKey: string): Keypair => {
  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch (error) {
    throw new Error('Invalid private key format. Please provide a base58 encoded private key.');
  }
};

export const createNewKeypair = (): Keypair => {
  return Keypair.generate();
};

export const getPublicKeyFromString = (publicKeyString: string): PublicKey => {
  try {
    return new PublicKey(publicKeyString);
  } catch (error) {
    throw new Error('Invalid public key format.');
  }
};

export const formatNumber = (number: number, decimals: number): string => {
  return (number / Math.pow(10, decimals)).toFixed(decimals);
};

export const parseNumber = (number: string, decimals: number): number => {
  return Math.floor(parseFloat(number) * Math.pow(10, decimals));
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
