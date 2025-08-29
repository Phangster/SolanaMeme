# Solana SPL Token Implementation

A comprehensive implementation of Solana SPL tokens based on the [Ultimate Guide to SPL Tokens on Solana](https://hackernoon.com/the-ultimate-guide-to-spl-tokens-on-solana-from-an-actual-dev?utm_source=chatgpt.com).

## 🚀 Features

- **Metaplex UMI Integration**: Modern token creation using Metaplex Foundation tools
- **Custom Metadata Required**: All tokens must have custom names, symbols, and metadata URIs
- **Efficient Creation**: Create and mint SPL tokens in one operation
- **Wallet Setup**: Generate new wallets and get devnet airdrops
- **Network Support**: Works with Solana devnet and mainnet-beta
- **TypeScript**: Fully typed implementation for better development experience

## 📋 Prerequisites

- Node.js 16+ and npm
- Solana CLI tools (optional but recommended)
- A Solana wallet with SOL for transaction fees
- Metaplex UMI packages (automatically installed)

## 🛠️ Installation

### Option 1: Automated Setup (Recommended)

1. Navigate to the solana-token directory:
```bash
cd solana-token
```

2. **Run the automated deployment script**:
```bash
./deploy.sh
```

This script will automatically:
- ✅ Check if Node.js and npm are installed
- ✅ Install all dependencies
- ✅ Create your `.env` file from template
- ✅ Build the project
- ✅ Provide next steps

**When to run `./deploy.sh`:**
- 🆕 **First time setup** - When you're setting up the project for the first time
- 🔄 **After cloning** - When you've cloned the repository to a new location
- 🧹 **Clean reinstall** - When you want to clean install dependencies
- 🚀 **Quick start** - When you want to get up and running quickly

### Option 2: Manual Setup

If you prefer manual setup or the automated script fails:

1. Navigate to the solana-token directory:
```bash
cd solana-token
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure it:
```bash
cp env.example .env
```

4. Edit `.env` with your configuration:
```bash
# Solana Network Configuration
SOLANA_NETWORK=devnet
# SOLANA_NETWORK=mainnet-beta

# Your wallet private key (base58 encoded)
WALLET_PRIVATE_KEY=your_private_key_here

# Token configuration
TOKEN_NAME=TMEME
TOKEN_SYMBOL=TM
TOKEN_DECIMALS=9
TOKEN_SUPPLY=1000000000
```

## 🔑 Getting Your Private Key

### From Phantom Wallet:
1. Open Phantom wallet
2. Go to Settings → Security & Privacy → Export Private Key
3. Enter your password
4. Copy the private key (base58 format)

## 🎯 Usage

### 0. Setup New Wallet (Optional)

If you don't have a wallet yet or want to create a new one for testing:

```bash
npm run setup-wallet
```

This will:
- 🔑 Generate a new Solana keypair
- 💰 Request a 1 SOL airdrop on devnet
- 📁 Save wallet files (private key, public key, etc.)
- ✅ Display all wallet information
- 🔗 Provide explorer links for verification

**Files created:**
- `privateKey.txt` - Private key in base64 format (for .env file)
- `publicKey.txt` - Public key only

This will:
- Create a new mint with custom name, symbol, and metadata URI
- Mint the initial supply to your wallet
- Support for rich token metadata

**Note**: You must provide all three parameters (name, symbol, and metadata URI) to create a token.

## 📋 Preparing Your Token Metadata

### Step 1: Create Your Token Metadata Files

#### **1.1 Create token.json**
Create a `token.json` file with your token's metadata:

```json
{
  "name": "SolanaMeme",
  "symbol": "SMEME",
  "description": "The ultimate Solana meme token",
  "image": "https://filebase.com/ipfs/Qm.../your-image.png",
  "attributes": [
    {
      "trait_type": "Category",
      "value": "Meme"
    },
    {
      "trait_type": "Blockchain",
      "value": "Solana"
    }
  ],
  "properties": {
    "files": [
      {
        "type": "image/png",
        "uri": "https://filebase.com/ipfs/Qm.../your-image.png"
      }
    ]
  }
}
```

#### **1.2 Prepare Your Image**
- **Format**: PNG, JPG, or GIF (PNG recommended)
- **Size**: 512x512 pixels or larger
- **File Size**: Keep under 10MB for best performance
- **Quality**: High resolution for professional appearance

### Step 2: Upload to Filebase

#### **2.1 Get Filebase Account**
1. Visit [Filebase.com](https://filebase.com)
2. Sign up for a free account
3. Verify your email address

#### **2.2 Upload Your Files**
1. **Upload Image First**:
   - Go to your Filebase dashboard
   - Click "Upload" → "File"
   - Select your token image
   - Choose IPFS as storage option
   - Copy the IPFS URI (starts with `Qm...`)

2. **Update token.json**:
   - Replace the image URI in your `token.json` with the Filebase IPFS URI
   - Save the updated file

3. **Upload token.json**:
   - Upload your updated `token.json` to Filebase
   - Choose IPFS storage
   - Copy the IPFS URI for the JSON file

#### **2.3 Filebase IPFS URIs**
Your files will have URIs like:
- **Image**: `https://filebase.com/ipfs/QmX7K.../token-image.png`
- **Metadata**: `https://filebase.com/ipfs/QmY9L.../token.json`

### Step 3: Create Your Token

Now use the metadata URI to create your token:

```bash
npm run create-and-mint "SolanaMeme" "SMEME" "https://filebase.com/ipfs/QmY9L.../token.json"
```

### Transfer Your Tokens

After creating your token, you can transfer it to other wallets:

```bash
npm run transfer-token <mint_address> <recipient_address> <amount>
```

Example:
```bash
npm run transfer-token ABC123... XYZ789... 1000000000
```

This will:
- Transfer tokens from your wallet to another address
- Show balances before and after transfer
- Support for any amount (in smallest units)

**Note**: Amount should be in the smallest unit (e.g., 1000000000 for 1 token with 9 decimals)

### Test Your Token Workflow

Run the comprehensive test suite to verify everything is working:

```bash
npm run test
```

This will:
- Test token creation functionality
- Test token transfer functionality
- Test utility functions
- Generate test wallets
- Provide detailed feedback on each component

## 💡 Metadata Best Practices

### **Image Guidelines**
- **Dimensions**: 512x512, 1024x1024, or 2048x2048 pixels
- **Format**: PNG for transparency, JPG for photos, GIF for animations
- **Compression**: Optimize for web (under 5MB recommended)
- **Quality**: High resolution for marketplace displays

### **JSON Structure Tips**
- **Required Fields**: `name`, `symbol`, `description`, `image`
- **Optional Fields**: `attributes`, `properties`, `external_url`
- **Validation**: Use JSON validators to check syntax
- **Testing**: Verify URIs are accessible before token creation

### **Filebase Upload Tips**
- **IPFS Storage**: Always choose IPFS for decentralized access
- **File Naming**: Use descriptive names (e.g., `solana-meme-token.json`)
- **Organization**: Create folders for different projects
- **Backup**: Keep local copies of your metadata files

## 🐛 Troubleshooting Metadata Issues

### **Common Problems**
1. **Invalid JSON**: Check syntax with online JSON validators
2. **Broken URIs**: Ensure Filebase IPFS links are working
3. **Image Not Loading**: Verify image format and size
4. **Metadata Not Found**: Check if JSON file is publicly accessible

### **Verification Steps**
1. **Test URIs**: Open metadata and image URLs in browser
2. **Check IPFS**: Verify files are pinned and accessible
3. **Validate JSON**: Use tools like JSONLint
4. **Preview**: Test metadata in Solana explorers





## 🌐 Network Configuration

### Devnet (Recommended for Testing)
- **RPC URL**: https://api.devnet.solana.com
- **Faucet**: https://faucet.solana.com/
- **Explorer**: https://explorer.solana.com/?cluster=devnet

### Mainnet Beta (Real Tokens)
- **RPC URL**: https://api.mainnet-beta.solana.com
- **Explorer**: https://explorer.solana.com/

## 🚀 Making It a Real Token (Mainnet)

### **Step 1: Switch to Mainnet**
Edit your `.env` file:
```bash
SOLANA_NETWORK=mainnet-beta
# SOLANA_NETWORK=devnet  # Comment out or remove this line
```

### **Step 2: Get Real SOL**
- **No more airdrops** - you need real SOL for transaction fees
- **Minimum balance**: At least 0.01 SOL for fees (recommend 0.1+ SOL)
- **Buy SOL** from exchanges like Coinbase, Binance, or FTX

### **Step 3: Use Real Wallet**
- **Never use generated wallets** for mainnet
- **Use your real wallet** (Phantom, Solflare, etc.)
- **Set WALLET_PRIVATE_KEY** to your real wallet's private key

### **Step 4: Prepare Real Metadata**
- **Professional images** (512x512 or higher)
- **Complete metadata** with proper descriptions
- **Upload to reliable storage** (Filebase, Arweave, or your own server)
- **Test all URIs** before token creation

### **Step 5: Create Your Token**
```bash
npm run create-and-mint "YourTokenName" "SYMBOL" "https://your-metadata-uri.com/token.json"
```

### **⚠️ Mainnet Warnings:**
- **Real money involved** - test thoroughly on devnet first
- **No undo button** - once created, tokens are permanent
- **Transaction fees** - each operation costs real SOL
- **Market visibility** - your token will appear on Solana explorers
- **Legal compliance** - ensure you follow local regulations

### **🔍 Verify Your Token:**
1. **Check Solana Explorer**: https://explorer.solana.com/
2. **Search by mint address** or your wallet address
3. **Verify metadata** displays correctly
4. **Test transfers** with small amounts first

### **💡 Pro Tips:**
- **Start small** - create with minimal supply first
- **Document everything** - keep records of all transactions
- **Community building** - prepare marketing before launch
- **Liquidity planning** - consider DEX listings

## 📊 Token Configuration

The default token configuration creates a token with:
- **Name**: MEME
- **Symbol**: MEME
- **Decimals**: 9
- **Total Supply**: 1,000,000,000 tokens

You can modify these values in the `.env` file.

## 🔧 Development

### Build the Project
```bash
npm run build
```

### Run in Development Mode
```bash
npm run dev
```

### Project Structure
```
solana-token/
├── src/
│   ├── config.ts          # Configuration and environment setup
│   ├── utils.ts           # Utility functions
│   ├── setup-wallet.ts    # Wallet generation and airdrop
│   └── create-and-mint.ts # Combined token creation and minting
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── env.example            # Environment variables template
├── deploy.sh              # Automated setup script
└── README.md             # This file
```

## ⚠️ Important Notes

1. **Private Key Security**: Never commit your private key to version control
2. **Network Selection**: Start with devnet for testing
3. **Transaction Fees**: Ensure your wallet has sufficient SOL for fees
4. **Token Supply**: The supply is specified in the smallest unit (lamports for tokens)
5. **Authority**: The mint authority can mint additional tokens, freeze authority can freeze accounts

## 🐛 Troubleshooting

### Common Issues

1. **Insufficient Balance**
   - Ensure your wallet has at least 0.01 SOL for transaction fees
   - Use the Solana faucet for devnet testing

2. **Invalid Private Key**
   - Ensure your private key is in base58 format
   - Check that the WALLET_PRIVATE_KEY environment variable is set correctly

3. **Network Connection Issues**
   - Verify your internet connection
   - Check if the Solana network is accessible
   - Try switching between devnet and mainnet-beta

4. **Transaction Failures**
   - Check Solana network status
   - Verify account balances
   - Ensure proper permissions for the operation

## 📚 Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Program](https://spl.solana.com/token)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Explorer](https://explorer.solana.com/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.
