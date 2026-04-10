<div align="center">

# CREATE2 Workbench for Rootstock

### A Visual Deterministic Contract Deployment Tool

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg)](https://book.getfoundry.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Janhavi312003/create2-workbench/blob/main/LICENSE)

*Calculate deterministic contract addresses and deploy with CREATE2 on Rootstock blockchain*

[Live Demo](https://your-vercel-url.vercel.app) • [Documentation](#-usage-guide) • [Report Bug](https://github.com/Janhavi312003/create2-workbench/issues)

</div>

---

## 📖 About Rootstock

**Rootstock (RSK)** is a smart contract platform secured by the Bitcoin network through merge-mining. It's the first smart contract platform that enables smart contracts to be secured by the Bitcoin network's hashing power. Rootstock brings Ethereum-compatible smart contracts to Bitcoin, allowing developers to build decentralized applications with Bitcoin-level security.

**Key Features of Rootstock:**

- 🛡️ **Bitcoin Security**: Secured by merge-mining with Bitcoin
- 💰 **Native Currency**: RBTC (Rootstock Bitcoin) - 1:1 pegged with BTC
- ⚡ **EVM Compatible**: Supports Ethereum smart contracts and tooling
- 🌐 **Infrastructure**: RIF (Rootstock Infrastructure Framework) ecosystem
- 📈 **Scalability**: Enhanced performance with 30-second block times

---

## 🎯 What is CREATE2 Workbench?

**CREATE2 Workbench** is a production-ready web application that implements EIP-1014 (CREATE2 opcode) for deterministic contract deployment on Rootstock. It allows developers to predict contract addresses before deployment, create vanity addresses with custom prefixes, and deploy contracts to the same address across multiple chains.

### Why Use CREATE2 Workbench?

🔮 **Predictable Addresses**: Know contract addresses before deploying  
💎 **Vanity Mining**: Find custom address prefixes (e.g., 0x0000...)  
⚡ **Non-Blocking**: Web Workers for background vanity search  
🦊 **MetaMask Ready**: Seamless wallet integration with Rootstock  
🏭 **Factory Deployed**: Verified CREATE2 factory on Rootstock testnet  
🎨 **Beautiful UI**: Modern design with Tailwind CSS and responsive layout  

---

## ✨ Features

### Core Capabilities

- **Calculate Mode**: Predict CREATE2 addresses instantly with deployer + salt + init code hash
- **Find Salt Mode**: Mine vanity salts to get custom address prefixes
- **Init Code Helper**: Calculate bytecode hash (keccak256) from contract bytecode
- **Proxy Support**: Works with any ERC-20/ERC-1155 token or custom contract
- **Batch Operations**: Efficient address generation with optimized algorithms

### Advanced Features

- 🔍 **Real-time Validation**: Instant feedback on address and hex inputs
- 📋 **One-Click Copy**: Copy addresses, salts, and hashes to clipboard
- 🌐 **Network Switching**: Automatic detection and switching to Rootstock networks
- 🎯 **Progress Tracking**: Visual progress bar for vanity salt mining
- 🔒 **Secure**: All calculations happen client-side, no private keys transmitted
- 🚀 **Web Workers**: Background processing doesn't freeze the UI

### User Interface

- 🎨 Tailwind-based layout with Rootstock-style accent colors (no separate animation library; motion is CSS-only where used)
- 📱 Responsive layout and toast notifications for user feedback
- 🔗 Direct links to Rootstock explorer
- ⚙️ Configurable mining parameters (prefix length, attempts)

---

## 🏗️ Architecture
```bash
┌─────────────────────┐
│ Frontend │
│ (React + Vite) │
│ Port: 5173 │
│ - Calculate Mode │
│ - Find Salt Mode │
│ - Init Helper │
└──────────┬──────────┘
│ Web3/ethers.js
▼
┌─────────────────────┐
│ MetaMask Wallet │
│ (Browser) │
└──────────┬──────────┘
│ RPC
▼
┌─────────────────────┐
│ CREATE2 Factory │
│ 0x058d...7AaDF │
│ Rootstock Testnet │
└─────────────────────┘
│
▼
┌─────────────────────┐
│ Rootstock Blockchain│
│ (Mainnet/Testnet) │
└─────────────────────┘
```
---

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **wagmi / viem / RainbowKit**: Wallet and chain configuration (see `frontend/src/components/Providers.tsx` for Rootstock testnet and mainnet RPCs)
- **ethers.js v6**: CREATE2 math and hashing in the UI
- **Web Workers API**: Background vanity salt search

### Smart Contracts
- **Solidity 0.8.20**: Smart contract language
- **Foundry**: Development framework and testing
- **EIP-1014**: CREATE2 opcode implementation
- **Create2Factory** uses a minimal inlined reentrancy guard (no OpenZeppelin import required for the factory build)

### Development Tools
- **Git**: Version control
- **Vercel**: Frontend deployment
- **Rootstock RPC**: Blockchain connectivity

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** or higher
- **npm** or **yarn** package manager
- **MetaMask** browser extension
- **Git** for cloning the repository

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Janhavi312003/create2-workbench.git
cd create2-workbench
```

**2. Install OpenZeppelin Dependencies:**
```bash
cd contracts
git submodule update --init --recursive
# OR
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install
```

**3. Environment Configuration:**

**Contract Environment Setup**
```bash
cd contracts
cp .env.example .env
```

**Frontend Environment Setup**
```bash
cd frontend
cp .env.example .env
```

**4. Build Contracts:**
```bash
forge build
```

**4. Install Frontend Dependencies:**
```bash
cd frontend
npm install
npm run dev
```

### Configuration

#### Frontend Configuration

**Navigate to frontend directory:**
```bash
cd frontend
```

**Create `.env` file** (optional - for custom RPC):

```bash
VITE_ROOTSTOCK_TESTNET_RPC=https://public-node.testnet.rsk.co
VITE_ROOTSTOCK_MAINNET_RPC=https://public-node.rsk.co
```

#### Contracts Configuration

**Navigate to contracts directory:**
```bash
cd contracts
```

**Create `.env` file:**
```bash
PRIVATE_KEY=your_private_key_here
ROOTSTOCK_TESTNET_RPC=https://public-node.testnet.rsk.co
```

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Frontend starts at: [**http://localhost:5173**](http://localhost:5173)

**Terminal 2 - Compile Contracts (Optional):**
```bash
cd contracts
forge build
```

**Open your browser and navigate to http://localhost:5173**

### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Build Contracts:**
```bash
cd contracts
forge build
```

---

## 📚 Usage Guide

### Basic Workflow

1. **Open the Application** at http://localhost:5173
2. **Connect MetaMask** using the wallet button (top-right)
3. **Switch to Rootstock Testnet** if prompted
4. **Choose Your Mode**:
   - **Calculate Mode**: Predict addresses
   - **Find Salt Mode**: Mine vanity addresses

### Calculate Mode

**Step-by-step:**

1. Click **"Calculate Mode"** tab
2. Enter **Factory Address**: `0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF`
3. Enter **Salt**: Any 32-byte hex value (e.g., `0x0000...0001`)
4. Enter **Init Code Hash**: Bytecode hash from Init Helper
5. **Result**: Predicted CREATE2 address shown instantly
6. **Copy** the address for deployment

### Find Salt Mode

**Step-by-step:**

1. Click **"Find Salt Mode"** tab
2. Enter **Factory Address**: `0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF`
3. Enter **Init Code Hash**: Bytecode hash from Init Helper
4. Enter **Target Prefix**: Desired address start (e.g., `0000` for `0x0000...`)
5. Click **"Start Mining"**
6. **Wait**: Web Worker searches for matching salt
7. **Result**: Salt and address displayed when found
8. **Copy** both values for deployment

### Init Code Helper

**How to use:**

1. Get your contract bytecode from:
   - **Remix**: Compile → Copy bytecode
   - **Foundry**: `forge inspect ContractName bytecode`
2. Paste bytecode into text area
3. Click **"Calculate Hash"**
4. **Copy** the hash for use in Calculate/Find Salt modes

---

## 🔧 Deployed Contracts

Canonical factory address for documentation and examples: `frontend/src/constants/deployments.ts` (also set `VITE_FACTORY_ADDRESS` in `frontend/.env` to match when you run the app).

### Rootstock Testnet
```bash

| Contract | Address | Explorer |
|----------|---------|----------|
| **CREATE2 Factory** | `0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF` | [View](https://explorer.testnet.rsk.co/address/0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF) |
| **Deployment TX** | — | Update this row with your deployment transaction hash after redeploying. |
```

**Network Details:**
- Chain ID: `31`
- Currency: `tRBTC`
- Block Time: ~30 seconds
- Gas Price: ~0.06 Gwei

---

## 📖 How CREATE2 Works

### The Formula

address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]

**Where:**
- `0xff`: Constant prefix
- `deployer`: Factory contract address (20 bytes)
- `salt`: User-provided value (32 bytes)
- `init_code`: Contract creation bytecode
- `[12:]`: Take last 20 bytes as address

### Why CREATE2?

✅ **Deterministic Deployment**: Same inputs = same address  
✅ **Cross-Chain Consistency**: Deploy to same address on multiple chains  
✅ **Counterfactual Contracts**: Interact before deployment  
✅ **Vanity Addresses**: Create branded contract addresses  
✅ **Upgrade Patterns**: Predictable proxy implementations  

### Use Cases

- 🏦 **DeFi Protocols**: Predictable pool addresses
- 🎮 **Gaming**: Pre-computed NFT contract addresses
- 🔐 **Multisig Wallets**: Same address across chains
- 🌉 **Bridge Contracts**: Coordinated deployments
- 💎 **Token Launches**: Branded token addresses

---

## 🧪 Testing

### Test with Sample Contracts

The project includes test contracts you can deploy:
```bash

cd contracts

Get bytecode hash
forge script script/GetInfo.s.sol

Test deployment
forge script script/TestCreate2.s.sol --rpc-url rootstock_testnet --broadcast --legacy -vvvv
```
---

## 📁 Project Structure
```bash

create2-workbench/
├── frontend/ # React web application
│ ├── src/
│ │ ├── components/ # React components
│ │ │ ├── CalculateMode.tsx
│ │ │ ├── FindSaltMode.tsx
│ │ │ ├── InitCodeHelper.tsx
│ │ │ └── WalletConnect.tsx
│ │ ├── utils/ # Utility functions
│ │ │ └── create2.ts # CREATE2 calculations
│ │ ├── workers/ # Web Workers
│ │ │ └── saltMiner.ts # Vanity mining
│ │ ├── types/ # TypeScript types
│ │ ├── App.tsx # Main component
│ │ └── main.tsx # Entry point
│ ├── public/ # Static assets
│ ├── package.json
│ ├── vite.config.ts
│ └── README.md
│
├── contracts/ # Solidity smart contracts
│ ├── src/
│ │ ├── Create2Factory.sol # Factory contract
│ │ └── SimpleStorage.sol # Test contract
│ ├── script/ # Deployment scripts
│ │ ├── Deploy.s.sol
│ │ ├── GetInfo.s.sol
│ │ └── TestCreate2.s.sol
│ ├── test/ # Contract tests
│ ├── foundry.toml # Foundry config
│ └── README.md
│
└── README.md
```

---

## 🔍 API Reference (Workbench Functions)

### Frontend Utilities

**`calculateCreate2Address(deployer, salt, initCodeHash)`**

Calculates the deterministic CREATE2 address.

const address = calculateCreate2Address(
'0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF', // factory (deployer in CREATE2 formula)
'0x0000000000000000000000000000000000000000000000000000000000000001', // salt
'0x1a2b3c...' // initCodeHash
);

**`findVanitySalt(deployer, initCodeHash, prefix, maxAttempts)`**

Finds a salt that produces an address with the desired prefix.

const result = await findVanitySalt(
'0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF',
'0x1a2b3c...',
'0000', // target prefix
1000000 // max attempts
);


### Smart Contract Functions

**`computeAddress(salt, initCodeHash)`**

Returns the predicted address for deployment.

address predicted = factory.computeAddress(salt, initCodeHash);

**`deploy(salt, bytecode)`**

Deploys a contract using CREATE2.

address deployed = factory.deploy(salt, bytecode);


---

## 🐛 Troubleshooting

### MetaMask Issues

**"Wrong Network" Error:**
- Click the network switcher button in the app
- Or manually switch to Rootstock Testnet in MetaMask
- Network details: ChainID `31`, RPC `https://public-node.testnet.rsk.co`

**Connection Refused:**
- Ensure MetaMask is installed and unlocked
- Refresh the page and try connecting again
- Check browser console for detailed errors

### Calculation Issues

**"Invalid Address" Error:**
- Ensure address is 42 characters (0x + 40 hex)
- Use checksummed addresses when possible
- Verify factory contract is deployed

**"Invalid Init Code Hash":**
- Hash must be 66 characters (0x + 64 hex)
- Use the Init Code Helper to generate correct hash
- Ensure bytecode is valid hex

### Vanity Mining Issues

**Mining Takes Too Long:**
- Reduce prefix length (each character is 16x harder)
- Increase max attempts
- Use shorter prefixes (2-3 characters recommended)

**Worker Not Responding:**
- Check browser console for errors
- Ensure Web Workers are supported in your browser
- Try refreshing the page

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing TypeScript and Solidity code style
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

 **MIT License** 

---

## 🔗 Useful Links

**Rootstock Resources:**
- [Rootstock Official](https://rootstock.io/)
- [Rootstock Docs](https://dev.rootstock.io/)
- [Rootstock Explorer (Testnet)](https://explorer.testnet.rsk.co/)
- [Rootstock Faucet](https://faucet.rootstock.io/)

**Development Tools:**
- [Foundry Book](https://book.getfoundry.sh/)
- [ethers.js Docs](https://docs.ethers.org/v6/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

**EIP Standards:**
- [EIP-1014: CREATE2](https://eips.ethereum.org/EIPS/eip-1014)
- [EIP-1967: Proxy Storage Slots](https://eips.ethereum.org/EIPS/eip-1967)

---

## 🏆 Built For

**Rootstock Hacktivator Program 2024-2025**

This project demonstrates:
- ✅ Production-ready tooling for Rootstock developers
- ✅ Full EIP-1014 implementation on Rootstock
- ✅ Full-stack dApp development (React + Solidity)
- ✅ Smart contract deployment and verification
- ✅ Developer-friendly user experience
- ✅ Real-world blockchain utility

---

## 🙏 Acknowledgments

- Built with ❤️ for the **Rootstock Community**
- Thanks to the **Rootstock Hacktivator** program
- Powered by **Foundry**, **ethers.js**, and **React**
- Inspired by the need for better deployment tools
- Special thanks to EIP-1014 authors

---

## 📧 Support

For issues, questions, or contributions:

- 🐛 [Open an issue](https://github.com/Janhavi312003/create2-workbench/issues)
- 💬 Check existing documentation
- 📖 Review [troubleshooting section](#-troubleshooting)
- 🔍 Search closed issues for solutions

---

<div align="center">

**Made with ❤️ for the Rootstock Ecosystem**

</div>



