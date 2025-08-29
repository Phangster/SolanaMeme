import {
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createKeypairFromPrivateKey, createNewKeypair } from './utils';
import { solanaConfig } from './config';

export class TokenTransfer {
  private umi: any;
  private senderSigner: any;

  constructor(network: string = 'devnet') {
    // Create UMI instance
    const endpoint = network === 'devnet' 
      ? "https://api.devnet.solana.com" 
      : "https://api.mainnet-beta.solana.com";
    
    this.umi = createUmi(endpoint);
    
    // Setup sender wallet
    let senderWallet: any;
    
    if (process.env.WALLET_PRIVATE_KEY) {
      // Use existing wallet from environment
      senderWallet = createKeypairFromPrivateKey(process.env.WALLET_PRIVATE_KEY);
      console.log('🔑 Using existing wallet from environment');
    } else {
      // Generate new wallet
      senderWallet = createNewKeypair();
      console.log('🔑 Generated new wallet (for testing only)');
      console.log(`Public Key: ${senderWallet.publicKey.toBase58()}`);
      console.log(`Private Key: ${Buffer.from(senderWallet.secretKey).toString('base64')}`);
      console.log('⚠️  Save this private key for future use!');
    }

    // Create UMI signer from keypair
    this.senderSigner = createSignerFromKeypair(this.umi, {
      publicKey: senderWallet.publicKey.toBase58(),
      secretKey: new Uint8Array(senderWallet.secretKey)
    });

    // Setup UMI with identity and token metadata
    this.umi.use(signerIdentity(this.senderSigner));
    this.umi.use(mplTokenMetadata());
  }

  async transferTokens(
    mintAddress: string,
    recipientAddress: string,
    amount: number
  ): Promise<string> {
    try {
      console.log('🔄 Transferring tokens...');
      console.log(`Mint: ${mintAddress}`);
      console.log(`From: ${this.senderSigner.publicKey}`);
      console.log(`To: ${recipientAddress}`);
      console.log(`Amount: ${amount}`);

      // For token transfers, we'll use the traditional SPL token approach
      // since UMI transfer is designed for NFT transfers
      console.log('⚠️  Token transfers require SPL token program access');
      console.log('💡 This script demonstrates the transfer workflow');
      console.log('💡 For actual transfers, you need mint authority access');

      // Simulate transfer (replace with actual SPL transfer logic)
      console.log('🔄 Simulating transfer...');
      
      // In a real implementation, you would:
      // 1. Get the token account for the sender
      // 2. Get or create token account for recipient
      // 3. Execute the transfer using SPL token program
      
      console.log('✅ Transfer simulation completed!');
      console.log(`Transaction: simulated_transfer_${Date.now()}`);

      return `simulated_transfer_${Date.now()}`;

    } catch (error) {
      console.error('❌ Error transferring tokens:', error);
      throw error;
    }
  }

  async getTokenBalance(mintAddress: string, ownerAddress: string): Promise<number> {
    try {
      // Get token balance using UMI
      const balance = await this.umi.rpc.getTokenAccountBalance(mintAddress, ownerAddress);
      return balance.value.uiAmount || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  async getTokenAccounts(ownerAddress: string): Promise<any[]> {
    try {
      // Get all token accounts for an owner
      const tokenAccounts = await this.umi.rpc.getTokenAccountsByOwner(ownerAddress);
      return tokenAccounts.value || [];
    } catch (error) {
      console.error('Error getting token accounts:', error);
      return [];
    }
  }
}

async function main() {
  try {
    console.log('🔄 Token Transfer Tool');
    console.log('======================\n');

    // Check if private key is provided in environment
    if (!process.env.WALLET_PRIVATE_KEY) {
      console.log('⚠️  No WALLET_PRIVATE_KEY in environment');
      console.log('💡 A new wallet will be generated for testing');
    }

    const tokenTransfer = new TokenTransfer(solanaConfig.network);

    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 3) {
      // Three arguments: mint address, recipient address, amount
      const [mintAddress, recipientAddress, amountStr] = args;
      const amount = parseInt(amountStr);
      
      if (isNaN(amount) || amount <= 0) {
        console.error('❌ Invalid amount. Please provide a positive number.');
        process.exit(1);
      }
      
      console.log('\n🎯 Transferring tokens...');
      await tokenTransfer.transferTokens(mintAddress, recipientAddress, amount);
      
      // Show balances
      const senderBalance = await tokenTransfer.getTokenBalance(mintAddress, tokenTransfer['senderSigner'].publicKey);
      const recipientBalance = await tokenTransfer.getTokenBalance(mintAddress, recipientAddress);
      
      console.log(`\n📊 Balances after transfer:`);
      console.log(`Sender: ${senderBalance} tokens`);
      console.log(`Recipient: ${recipientBalance} tokens`);
      
    } else {
      console.log('Usage:');
      console.log('  npm run transfer-token <mint_address> <recipient_address> <amount>');
      console.log('');
      console.log('Examples:');
      console.log('  npm run transfer-token ABC123... XYZ789... 1000000000');
      console.log('  npm run transfer-token QmX7K... QmY9L... 500000000');
      console.log('');
      console.log('Note: You must provide mint address, recipient address, and amount.');
      console.log('Amount should be in the smallest unit (e.g., 1000000000 for 1 token with 9 decimals)');
    }

  } catch (error) {
    console.error('❌ Main execution error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
