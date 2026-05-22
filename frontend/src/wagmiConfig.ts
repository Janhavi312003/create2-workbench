import {
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { rootstock, rootstockTestnet } from "wagmi/chains";

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
