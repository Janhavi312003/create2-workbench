"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { rootstock, rootstockTestnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const testnetRpc =
  import.meta.env.VITE_ROOTSTOCK_TESTNET_RPC ||
  "https://public-node.testnet.rsk.co";
const mainnetRpc =
  import.meta.env.VITE_ROOTSTOCK_MAINNET_RPC || "https://public-node.rsk.co";

const transports = {
  [rootstockTestnet.id]: http(testnetRpc),
  [rootstock.id]: http(mainnetRpc),
} as const;

const walletConnectProjectId =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID?.trim() ?? "";

export const hasWalletConnectProjectId = walletConnectProjectId.length > 0;

function createRainbowWagmiConfig() {
  return getDefaultConfig({
    appName: "CREATE2 Workbench",
    projectId: walletConnectProjectId,
    chains: [rootstockTestnet, rootstock],
    transports,
    ssr: false,
  });
}

function createInjectedOnlyWagmiConfig() {
  return createConfig({
    chains: [rootstockTestnet, rootstock],
    connectors: [injected()],
    transports,
  });
}

/** Single config for the app — WalletConnect is optional; browser wallets still work via `injected`. */
export const config = hasWalletConnectProjectId
  ? createRainbowWagmiConfig()
  : createInjectedOnlyWagmiConfig();

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {!hasWalletConnectProjectId && (
          <div
            className="border-b border-amber-500/35 bg-amber-950/50 px-4 py-3 text-center text-sm text-amber-100"
            role="status"
          >
            WalletConnect is disabled (no{" "}
            <code className="font-mono text-amber-200">
              VITE_WALLET_CONNECT_PROJECT_ID
            </code>
            ). Use a browser extension wallet, or add a project ID from{" "}
            <a
              href="https://cloud.walletconnect.com/"
              className="underline text-amber-300 hover:text-amber-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              WalletConnect Cloud
            </a>
            .
          </div>
        )}
        {hasWalletConnectProjectId ? (
          <RainbowKitProvider
            modalSize="compact"
            coolMode
            appInfo={{
              appName: "CREATE2 Workbench",
              learnMoreUrl: "https://dev.rootstock.io",
            }}
          >
            {children}
          </RainbowKitProvider>
        ) : (
          children
        )}
        <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
