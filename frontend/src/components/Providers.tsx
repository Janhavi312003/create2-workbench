"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { config, hasWalletConnectProjectId } from "../wagmiConfig";

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
