// src/config/networks.ts
export const ROOTSTOCK_TESTNET = {
  chainId: '0x1f', // 31 in hex
  chainName: 'Rootstock Testnet',
  nativeCurrency: {
    name: 'Test RSK BTC',
    symbol: 'tRBTC',
    decimals: 18
  },
  rpcUrls: ['https://public-node.testnet.rsk.co'],
  blockExplorerUrls: ['https://explorer.testnet.rsk.co']
};

export const ROOTSTOCK_MAINNET = {
  chainId: '0x1e', // 30 in hex
  chainName: 'Rootstock Mainnet',
  nativeCurrency: {
    name: 'RSK BTC',
    symbol: 'RBTC',
    decimals: 18
  },
  rpcUrls: ['https://public-node.rsk.co'],
  blockExplorerUrls: ['https://explorer.rsk.co']
};
