'use client'

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, http } from 'wagmi'
import {
  rootstock,
  rootstockTestnet,
} from 'wagmi/chains'
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'Missing WalletConnect Project ID. Please add VITE_WALLET_CONNECT_PROJECT_ID to your .env file'
  );
}

// Create a config for RainbowKit
export const config = getDefaultConfig({
  appName: 'CREATE2 Workbench',
  projectId: projectId, 
  chains: [rootstockTestnet, rootstock],
  transports: {
    [rootstockTestnet.id]: http(import.meta.env.VITE_ROOTSTOCK_TESTNET_RPC || 'https://public-node.testnet.rsk.co'),
    [rootstock.id]: http(import.meta.env.VITE_ROOTSTOCK_MAINNET_RPC || 'https://public-node.rsk.co'),
  },
  ssr: false,
})

// Create a query client for React Query
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          coolMode
          appInfo={{
            appName: 'CREATE2 Workbench',
            learnMoreUrl: 'https://dev.rootstock.io',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}