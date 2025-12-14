# CREATE2 Workbench Frontend

Beautiful, modern web application for calculating and mining deterministic CREATE2 addresses on Rootstock blockchain.

---

## ✨ Features

🔮 **Calculate Mode**: Instantly predict CREATE2 deployment addresses  
💎 **Find Salt Mode**: Mine vanity salts for custom address prefixes  
🔍 **Init Code Helper**: Calculate bytecode hash (keccak256) from contract code  
🦊 **MetaMask Integration**: Seamless wallet connection with Rootstock networks  
🌐 **Network Switching**: Automatic detection and prompt for Rootstock testnet/mainnet  
⚡ **Web Workers**: Non-blocking vanity salt mining in background thread  
📋 **Copy to Clipboard**: One-click copy for all addresses, salts, and hashes  
🎨 **Modern UI**: Beautiful gradient design with indigo/purple theme  
🔔 **Toast Notifications**: User-friendly feedback for all actions  
📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile  

---

## 🛠️ Tech Stack
```
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **ethers.js v6** | Ethereum/Rootstock blockchain interaction |
| **Web Workers API** | Background computation for vanity mining |
| **React Hot Toast** | Toast notifications (alternative to react-toastify) |
```

---

## 📋 Prerequisites

- **Node.js 18+** or higher
- **npm** or **yarn** package manager
- **MetaMask** browser extension installed
- **Git** for version control

---

## 🚀 Installation

### 1. Navigate to Frontend Directory

```
cd frontend
```

### 2. Install Dependencies

```
npm install
```

### 3. Create Environment File (Optional)

```
cp .env.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local`:

```
Optional: Custom RPC endpoints
VITE_ROOTSTOCK_TESTNET_RPC=https://public-node.testnet.rsk.co
VITE_ROOTSTOCK_MAINNET_RPC=https://public-node.rsk.co

Optional: Factory contract address
VITE_FACTORY_ADDRESS=0xf39e31f414e707f129AdC1E970006E07b07eA3Cc
```

---

## 🎮 Running the Development Server

### Start Development Server

```
npm run dev
```

The application will start at [**http://localhost:5173**](http://localhost:5173)

### Open in Browser

Navigate to http://localhost:5173 and start exploring!

---

## 📦 Building for Production

### Build the Application

```
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```
npm run preview
```

Preview the production build locally at http://localhost:4173

---

## 📁 Project Structure

```
frontend/
├── src/
│ ├── components/ # React components
│ │ ├── CalculateMode.tsx # Calculate CREATE2 addresses
│ │ ├── FindSaltMode.tsx # Mine vanity salts
│ │ ├── InitCodeHelper.tsx # Calculate bytecode hash
│ │ └── WalletConnect.tsx # MetaMask connection
│ │
│ ├── utils/ # Utility functions
│ │ └── create2.ts # CREATE2 calculations
│ │
│ ├── workers/ # Web Workers
│ │ └── saltMiner.ts # Vanity mining worker
│ │
│ ├── types/ # TypeScript definitions
│ │ └── window.d.ts # Window/MetaMask types
│ │
│ ├── App.tsx # Main application component
│ ├── main.tsx # Application entry point
│ └── index.css # Global styles & Tailwind
│
├── public/ # Static assets
├── index.html # HTML template
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript configuration
├── tsconfig.node.json # Node TypeScript config
├── vite.config.ts # Vite configuration
├── tailwind.config.js # Tailwind CSS config
├── postcss.config.js # PostCSS config
└── README.md # This file
```

---

## ⚙️ Environment Variables

```

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_ROOTSTOCK_TESTNET_RPC` | Rootstock testnet RPC URL | `https://public-node.testnet.rsk.co` | No |
| `VITE_ROOTSTOCK_MAINNET_RPC` | Rootstock mainnet RPC URL | `https://public-node.rsk.co` | No |
| `VITE_FACTORY_ADDRESS` | CREATE2 factory contract address | - | No |

```

**Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

---

## 🎯 Features Overview

### 1. Calculate Mode

**Purpose:** Predict CREATE2 deployment addresses instantly

**How it works:**
- User inputs factory address, salt (32 bytes), and init code hash
- App calculates: `keccak256(0xff ++ deployer ++ salt ++ keccak256(bytecode))`
- Result shown in real-time with copy button

**Key Functions:**
calculateCreate2Address(deployer: string, salt: string, initCodeHash: string): string

text

---

### 2. Find Salt Mode

**Purpose:** Mine vanity salts for custom address prefixes

**How it works:**
- User inputs factory address, init code hash, and target prefix (e.g., "0000")
- Web Worker searches for salts that produce matching addresses
- Progress bar shows mining status
- Results displayed when match found

**Key Functions:**
```
findVanitySalt(deployer: string, initCodeHash: string, prefix: string, maxAttempts: number)
```

**Web Worker Benefits:**
- Non-blocking UI (doesn't freeze the browser)
- Can be stopped/started anytime
- Progress updates in real-time

---

### 3. Init Code Helper

**Purpose:** Calculate keccak256 hash of contract bytecode

**How it works:**
- User pastes contract bytecode (from Remix or Foundry)
- App calculates `keccak256(bytecode)`
- Result can be used in Calculate or Find Salt modes

**Key Functions:**
```
calculateInitCodeHash(bytecode: string): string
```

---

### 4. MetaMask Integration

**Purpose:** Connect wallet and interact with Rootstock

**Features:**
- Auto-detect MetaMask installation
- Connect/disconnect wallet
- Display connected address (shortened)
- Network detection (Rootstock testnet/mainnet)
- Network switching prompt
- ChainId validation

**Networks Supported:**
- **Rootstock Testnet**: Chain ID `31`
- **Rootstock Mainnet**: Chain ID `30`

---

### 5. Web Workers

**Purpose:** Background computation without blocking UI

**Implementation:**
// Main thread
const worker = new Worker(new URL('../workers/saltMiner.ts', import.meta.url), { type: 'module' });

// Worker thread
self.postMessage({ type: 'result', salt, address });


**Benefits:**
- UI remains responsive during mining
- Can process millions of attempts
- Clean separation of concerns

---

## 🎨 Component Architecture

### App.tsx (Main Component)

State management (activeMode, theme)

Layout structure (header, main, footer)

Mode switching (Calculate/Find Salt)

Wallet integration

### CalculateMode.tsx

Deployer address input

Salt input (32 bytes hex)

Init code hash input

Real-time validation

Address calculation

Copy functionality


### FindSaltMode.tsx

Deployer address input

Init code hash input

Target prefix input

Mining controls (start/stop)

Progress tracking

Result display

### InitCodeHelper.tsx

Bytecode input (textarea)

Hash calculation

Copy functionality

Usage instructions

text

### WalletConnect.tsx

MetaMask detection

Connection management

Network switching

Address display

---

## 🧪 Development

### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Group by external, internal, types
- **Comments**: Add JSDoc for complex functions

### Adding New Features

1. **Create Component**: Add to `src/components/`
2. **Add Utilities**: Create in `src/utils/`
3. **Update Types**: Define in `src/types/`
4. **Style with Tailwind**: Use utility classes
5. **Test Locally**: Run `npm run dev`

## 🐛 Troubleshooting

### MetaMask Not Detected

**Problem:** "MetaMask not installed" error

**Solutions:**
- Install MetaMask browser extension
- Refresh the page after installation
- Check browser console for errors
- Ensure MetaMask is unlocked

---

### Build Errors

**Problem:** TypeScript compilation errors

**Solutions:**

1. **Clear cache and rebuild:**

```
rm -rf node_modules .vite dist
npm install
npm run build
```

2. **Check Node version:**

```
node --version # Should be 18+
```

3. **Verify tsconfig.json settings:**

```
{
"compilerOptions": {
"target": "ES2020",
"lib": ["ES2020", "DOM", "DOM.Iterable"]
}
}
```

---

### Web Worker Errors

**Problem:** Worker fails to load or crashes

**Solutions:**
- Ensure `type: 'module'` is set in Worker constructor
- Check browser console for worker errors
- Verify `saltMiner.ts` has no import errors
- Test in different browsers (Chrome, Firefox, Edge)

---

### Network Connection Issues

**Problem:** "Wrong network" or can't switch networks

**Solutions:**

1. **Manually add Rootstock to MetaMask:**

**Rootstock Testnet:**
- Network Name: `Rootstock Testnet`
- RPC URL: `https://public-node.testnet.rsk.co`
- Chain ID: `31`
- Currency Symbol: `tRBTC`
- Block Explorer: `https://explorer.testnet.rsk.co`

**Rootstock Mainnet:**
- Network Name: `Rootstock Mainnet`
- RPC URL: `https://public-node.rsk.co`
- Chain ID: `30`
- Currency Symbol: `RBTC`
- Block Explorer: `https://explorer.rsk.co`

2. **Try switching manually** in MetaMask
3. **Refresh the page** after switching

---

### Vite Dev Server Issues

**Problem:** Port already in use

**Solution:**
Kill process on port 5173
lsof -ti:5173 | xargs kill -9

Or use different port
npm run dev -- --port 3000

text

**Problem:** Slow HMR (Hot Module Replacement)

**Solution:**
- Close unused tabs
- Disable browser extensions
- Clear Vite cache: `rm -rf node_modules/.vite`

---

### Styling Issues

**Problem:** Tailwind classes not working

**Solutions:**

1. **Rebuild Tailwind:**

```
npm run dev
```

2. **Check tailwind.config.js:**

```
content: [
"./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
]
```


3. **Verify PostCSS config exists**

---

## 🔧 Scripts Reference

```

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
```
---

## 📚 Useful Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [ethers.js v6 Docs](https://docs.ethers.org/v6/)

### Rootstock
- [Rootstock Dev Portal](https://dev.rootstock.io/)
- [Rootstock RPC Endpoints](https://dev.rootstock.io/developers/requirements/)
- [EIP-1014 Specification](https://eips.ethereum.org/EIPS/eip-1014)

### Web Workers
- [MDN Web Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Vite Worker Support](https://vitejs.dev/guide/features.html#web-workers)

---

## 📄 License

MIT 

---
