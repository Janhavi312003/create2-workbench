# CREATE2 Workbench for Rootstock

> Deterministic contract deployment calculator implementing EIP-1014 on Rootstock

## 🔗 Links

- **Live App**: https://your-app.vercel.app (update after deployment)
(https://explorer.testnet.rsk.co/address/0xf39e31f414e707f129AdC1E970006E07b07eA3Cc)
- **Network**: Rootstock Testnet (Chain ID: 31)

## ✨ Features

- Calculate CREATE2 addresses before deployment
- Find vanity salts (custom address prefixes like 0x0000...)
- MetaMask integration with Rootstock
- Web Workers for fast vanity mining
- Init code hash calculator

## 🚀 Quick Start

### Frontend

cd frontend
npm install
npm run dev


### Contracts
cd contracts
forge build
forge script script/Deploy.s.sol --rpc-url rootstock_testnet --broadcast --legacy


## 🛠️ Tech Stack

**Frontend**: React, TypeScript, Vite, Tailwind CSS, ethers.js v6  
**Contracts**: Solidity 0.8.20, Foundry

## 📖 How It Works

CREATE2 generates deterministic addresses using:

address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]

This allows you to:
- ✅ Know contract addresses before deploying
- ✅ Deploy to the same address on multiple chains
- ✅ Create vanity addresses (0x0000...)
- ✅ Enable counterfactual contracts

## 🏗️ Built For

Rootstock Hacktivator Program 2025

---

**Resources**: [Rootstock Docs](https://dev.rootstock.io) • [EIP-1014](https://eips.ethereum.org/EIPS/eip-1014) • [Faucet](https://faucet.rootstock.io)

