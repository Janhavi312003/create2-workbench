/**
 * Rootstock testnet CREATE2 factory — single source of truth for docs, FAQ, and examples.
 * When you redeploy, update this value and `VITE_FACTORY_ADDRESS` in `frontend/.env`.
 */
export const ROOTSTOCK_TESTNET_CREATE2_FACTORY =
  "0x058d31B1491230B1441eeeE9c9E4dB78A8E7AaDF" as const;

export function rootstockTestnetExplorerAddress(
  address: string = ROOTSTOCK_TESTNET_CREATE2_FACTORY,
): string {
  return `https://explorer.testnet.rsk.co/address/${address}`;
}
