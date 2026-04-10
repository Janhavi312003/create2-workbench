import "@rainbow-me/rainbowkit/styles.css";
export declare const hasWalletConnectProjectId: boolean;
/** Single config for the app — WalletConnect is optional; browser wallets still work via `injected`. */
export declare const config: import("wagmi").Config<[{
    blockExplorers: {
        readonly default: {
            readonly name: "RSK Explorer";
            readonly url: "https://explorer.testnet.rootstock.io";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 2771150;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 31;
    name: "Rootstock Testnet";
    nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Rootstock Bitcoin";
        readonly symbol: "tRBTC";
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://public-node.testnet.rsk.co"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
    readonly network: "rootstock";
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "RSK Explorer";
            readonly url: "https://explorer.rsk.co";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 4249540;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 30;
    name: "Rootstock Mainnet";
    nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Rootstock Bitcoin";
        readonly symbol: "RBTC";
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://public-node.rsk.co"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
    readonly network: "rootstock";
}], {
    readonly 31: import("viem").HttpTransport<undefined, false>;
    readonly 30: import("viem").HttpTransport<undefined, false>;
}, import("wagmi").CreateConnectorFn<unknown, Record<string, unknown>, Record<string, unknown>>[]> | import("wagmi").Config<readonly [{
    blockExplorers: {
        readonly default: {
            readonly name: "RSK Explorer";
            readonly url: "https://explorer.testnet.rootstock.io";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 2771150;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 31;
    name: "Rootstock Testnet";
    nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Rootstock Bitcoin";
        readonly symbol: "tRBTC";
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://public-node.testnet.rsk.co"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
    readonly network: "rootstock";
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "RSK Explorer";
            readonly url: "https://explorer.rsk.co";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts: {
        readonly multicall3: {
            readonly address: "0xcA11bde05977b3631167028862bE2a173976CA11";
            readonly blockCreated: 4249540;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 30;
    name: "Rootstock Mainnet";
    nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Rootstock Bitcoin";
        readonly symbol: "RBTC";
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://public-node.rsk.co"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | [fn: ((args: import("viem").PrepareTransactionRequestParameters, options: {
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem").PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem").Client, parameters: import("viem").VerifyHashActionParameters) => Promise<import("viem").VerifyHashActionReturnType>) | undefined;
    readonly network: "rootstock";
}], {
    readonly 31: import("viem").HttpTransport<undefined, false>;
    readonly 30: import("viem").HttpTransport<undefined, false>;
}, readonly [import("wagmi").CreateConnectorFn<{
    on: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
    removeListener: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
    request: import("viem").EIP1193RequestFn<import("viem").EIP1474Methods>;
    isApexWallet?: true | undefined;
    isAvalanche?: true | undefined;
    isBackpack?: true | undefined;
    isBifrost?: true | undefined;
    isBitKeep?: true | undefined;
    isBitski?: true | undefined;
    isBlockWallet?: true | undefined;
    isBraveWallet?: true | undefined;
    isCoinbaseWallet?: true | undefined;
    isDawn?: true | undefined;
    isEnkrypt?: true | undefined;
    isExodus?: true | undefined;
    isFrame?: true | undefined;
    isFrontier?: true | undefined;
    isGamestop?: true | undefined;
    isHyperPay?: true | undefined;
    isImToken?: true | undefined;
    isKuCoinWallet?: true | undefined;
    isMathWallet?: true | undefined;
    isMetaMask?: true | undefined;
    isOkxWallet?: true | undefined;
    isOKExWallet?: true | undefined;
    isOneInchAndroidWallet?: true | undefined;
    isOneInchIOSWallet?: true | undefined;
    isOpera?: true | undefined;
    isPhantom?: true | undefined;
    isPortal?: true | undefined;
    isRabby?: true | undefined;
    isRainbow?: true | undefined;
    isStatus?: true | undefined;
    isTally?: true | undefined;
    isTokenPocket?: true | undefined;
    isTokenary?: true | undefined;
    isTrust?: true | undefined;
    isTrustWallet?: true | undefined;
    isUniswapWallet?: true | undefined;
    isXDEFI?: true | undefined;
    isZerion?: true | undefined;
    providers?: {
        on: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
        removeListener: <event extends keyof import("viem").EIP1193EventMap>(event: event, listener: import("viem").EIP1193EventMap[event]) => void;
        request: import("viem").EIP1193RequestFn<import("viem").EIP1474Methods>;
        isApexWallet?: true | undefined;
        isAvalanche?: true | undefined;
        isBackpack?: true | undefined;
        isBifrost?: true | undefined;
        isBitKeep?: true | undefined;
        isBitski?: true | undefined;
        isBlockWallet?: true | undefined;
        isBraveWallet?: true | undefined;
        isCoinbaseWallet?: true | undefined;
        isDawn?: true | undefined;
        isEnkrypt?: true | undefined;
        isExodus?: true | undefined;
        isFrame?: true | undefined;
        isFrontier?: true | undefined;
        isGamestop?: true | undefined;
        isHyperPay?: true | undefined;
        isImToken?: true | undefined;
        isKuCoinWallet?: true | undefined;
        isMathWallet?: true | undefined;
        isMetaMask?: true | undefined;
        isOkxWallet?: true | undefined;
        isOKExWallet?: true | undefined;
        isOneInchAndroidWallet?: true | undefined;
        isOneInchIOSWallet?: true | undefined;
        isOpera?: true | undefined;
        isPhantom?: true | undefined;
        isPortal?: true | undefined;
        isRabby?: true | undefined;
        isRainbow?: true | undefined;
        isStatus?: true | undefined;
        isTally?: true | undefined;
        isTokenPocket?: true | undefined;
        isTokenary?: true | undefined;
        isTrust?: true | undefined;
        isTrustWallet?: true | undefined;
        isUniswapWallet?: true | undefined;
        isXDEFI?: true | undefined;
        isZerion?: true | undefined;
        providers?: /*elided*/ any[] | undefined | undefined;
        _events?: {
            connect?: (() => void) | undefined;
        } | undefined | undefined;
        _state?: {
            accounts?: string[];
            initialized?: boolean;
            isConnected?: boolean;
            isPermanentlyDisconnected?: boolean;
            isUnlocked?: boolean;
        } | undefined | undefined;
    }[] | undefined | undefined;
    _events?: {
        connect?: (() => void) | undefined;
    } | undefined | undefined;
    _state?: {
        accounts?: string[];
        initialized?: boolean;
        isConnected?: boolean;
        isPermanentlyDisconnected?: boolean;
        isUnlocked?: boolean;
    } | undefined | undefined;
} | undefined, {
    onConnect(connectInfo: import("viem").ProviderConnectInfo): void;
}, {
    [x: `${string}.disconnected`]: true;
    "injected.connected": true;
}>]>;
export declare function Providers({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
