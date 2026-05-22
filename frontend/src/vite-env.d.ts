/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID?: string
  readonly VITE_ROOTSTOCK_TESTNET_RPC?: string
  readonly VITE_ROOTSTOCK_MAINNET_RPC?: string
  readonly VITE_FACTORY_ADDRESS?: string
  readonly VITE_PUBLIC_CHAIN_ID?: string
  readonly VITE_PUBLIC_EXPLORER_URL?: string
  readonly VITE_DEPLOYER_ADDRESS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface WindowEventMap {
  hashCopied: CustomEvent<string>
}

