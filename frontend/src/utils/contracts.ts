import { isAddress } from "viem";
import { create2FactoryAbi } from "../abi/create2FactoryAbi";
import { simpleStorageAbi } from "../abi/simpleStorageAbi";

function parseFactoryAddress(): `0x${string}` | undefined {
  const raw = import.meta.env.VITE_FACTORY_ADDRESS?.trim();
  if (!raw) return undefined;
  if (!isAddress(raw)) return undefined;
  return raw;
}

export const factoryConfig = {
  address: parseFactoryAddress(),
  abi: create2FactoryAbi,
} as const;

export { simpleStorageAbi, simpleStorageAbi as simpleStorageABI };
