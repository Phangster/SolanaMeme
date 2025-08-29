import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createKeypairFromPrivateKey, createNewKeypair } from './utils';
import { tokenConfig, solanaConfig } from './config';

export class TokenCreatorAndMinter {
  private umi: any;
  private userWalletSigner: any;

  constructor(network: string = 'devnet') {
    // Create UMI instance
    const endpoint = network === 'devnet' 
      ? "https://api.devnet.solana.com" 
      : "https://api.mainnet-beta.solana.com";
    
    this.umi = createUmi(endpoint);
    
    // Setup wallet
    let userWallet: any;
    
    if (process.env.WALLET_PRIVATE_KEY) {
      // Use existing wallet from environment
      userWallet = createKeypairFromPrivateKey(process.env.WALLET_PRIVATE_KEY);
      console.log('🔑 Using existing wallet from environment');
          } else {
        console.error('❌ ERROR: No wallet found');
        console.error('💡 Please set WALLET_PRIVATE_KEY in your .env file');
        console.error('💡 Or run: npm run setup-wallet to generate a new wallet');
        throw new Error('WALLET_PRIVATE_KEY not found in environment variables');
      }

    // Create UMI signer from keypair
    this.userWalletSigner = createSignerFromKeypair(this.umi, {
      publicKey: userWallet.publicKey.toBase58(),
      secretKey: new Uint8Array(userWallet.secretKey)
    });

    // Setup UMI with identity and token metadata
    this.umi.use(signerIdentity(this.userWalletSigner));
    this.umi.use(mplTokenMetadata());
  }

  async createAndMintToken(
    metadata?: {
      name?: string;
      symbol?: string;
      uri?: string;
    }
  ): Promise<{
    mint: string;
    transactionSignature: string;
  }> {
    try {
      console.log('🚀 Creating and Minting SPL Token with Metaplex...');
      console.log(`Network: ${solanaConfig.network}`);
      
      // Use provided metadata or defaults
      const tokenMetadata = {
        name: metadata?.name || tokenConfig.name,
        symbol: metadata?.symbol || tokenConfig.symbol,
        uri: metadata?.uri || "",
      };

      console.log(`Token Name: ${tokenMetadata.name}`);
      console.log(`Token Symbol: ${tokenMetadata.symbol}`);
      console.log(`Decimals: ${tokenConfig.decimals}`);
      console.log(`Total Supply: ${tokenConfig.supply}`);

      // Generate mint signer
      const mint = generateSigner(this.umi);
      console.log(`📝 Generated mint signer: ${mint.publicKey}`);

      // Create and mint token
      console.log('🪙 Creating and minting token...');
      
      const result = await createAndMint(this.umi, {
        mint,
        authority: this.umi.identity,
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
        uri: tokenMetadata.uri,
        sellerFeeBasisPoints: percentAmount(0), // 0% royalty
        decimals: tokenConfig.decimals,
        amount: tokenConfig.supply,
        tokenOwner: this.userWalletSigner.publicKey,
        tokenStandard: TokenStandard.Fungible,
      }).sendAndConfirm(this.umi);

      console.log('\n🎉 Token created and minted successfully!');
      console.log('=====================================');
      console.log(`Mint Address: ${mint.publicKey}`);
      console.log(`Transaction: ${result.signature}`);
      console.log(`Network: ${solanaConfig.network}`);
      console.log('=====================================');

      return {
        mint: mint.publicKey,
        transactionSignature: result.signature.toString(),
      };

    } catch (error) {
      console.error('❌ Error creating and minting token:', error);
      throw error;
    }
  }

  async mintAdditionalTokens(
    mintAddress: string,
    recipientAddress: string,
    amount: number
  ): Promise<string> {
    try {
      console.log('💰 Minting additional tokens...');
      console.log(`Mint: ${mintAddress}`);
      console.log(`Recipient: ${recipientAddress}`);
      console.log(`Amount: ${amount} (${amount / Math.pow(10, tokenConfig.decimals)} tokens)`);

      // For additional minting, we'll use the traditional SPL token approach
      // since UMI createAndMint is designed for initial creation
      console.log('⚠️  Additional minting requires mint authority access');
      console.log('💡 Use the createAndMint function for initial token creation');

      return 'Additional minting not implemented with UMI - requires mint authority';

    } catch (error) {
      console.error('❌ Error minting additional tokens:', error);
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
}

async function main() {
  try {
    console.log('🎭 Metaplex UMI Token Creator');
    console.log('==============================\n');

    // Check if private key is provided in environment
    if (!process.env.WALLET_PRIVATE_KEY) {
      console.log('⚠️  No WALLET_PRIVATE_KEY in environment');
      console.log('💡 A new wallet will be generated and saved to secretKey.json');
    }

    const tokenCreator = new TokenCreatorAndMinter(solanaConfig.network);

    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 3) {
      // Three arguments - create with custom metadata
      const [name, symbol, uri] = args;
      console.log('\n🎯 Creating token with custom metadata...');
      await tokenCreator.createAndMintToken({ name, symbol, uri });
    } else {
      console.log('Usage:');
      console.log('  npm run create-and-mint <name> <symbol> <uri>    - Create token with custom metadata');
      console.log('');
      console.log('Examples:');
      console.log('  npm run create-and-mint "MyToken" "MTK" "https://example.com/metadata.json"');
      console.log('  npm run create-and-mint "SolanaMeme" "SMEME" "https://filebase.com/ipfs/Qm.../metadata.json"');
      console.log('');
      console.log('Note: You must provide name, symbol, and metadata URI for token creation.');
    }

  } catch (error) {
    console.error('❌ Main execution error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
