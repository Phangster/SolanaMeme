import dotenv from 'dotenv';
import { Connection, clusterApiUrl } from '@solana/web3.js';

dotenv.config();

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
}

export interface SolanaConfig {
  network: string;
  rpcUrl: string;
  connection: Connection;
}

export const tokenConfig: TokenConfig = {
  name: process.env.TOKEN_NAME || 'MEME',
  symbol: process.env.TOKEN_SYMBOL || 'MEME',
  decimals: parseInt(process.env.TOKEN_DECIMALS || '9'),
  supply: parseInt(process.env.TOKEN_SUPPLY || '1000000000'),
};

export const solanaConfig: SolanaConfig = {
  network: process.env.SOLANA_NETWORK || 'devnet',
  rpcUrl: process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
  connection: new Connection(
    process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
    'confirmed'
  ),
};

export const getConnection = (): Connection => {
  return solanaConfig.connection;
};

export const getNetwork = (): string => {
  return solanaConfig.network;
};
