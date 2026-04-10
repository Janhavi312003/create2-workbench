import { ethers } from "ethers";

export function calculateCreate2Address(
  deployerAddress: string,
  salt: string,
  initCodeHash: string,
): string {
  try {
    const saltBytes32 = ethers.zeroPadValue(salt, 32);

    const create2Inputs = ethers.solidityPacked(
      ["bytes1", "address", "bytes32", "bytes32"],
      ["0xff", deployerAddress, saltBytes32, initCodeHash],
    );

    const hash = ethers.keccak256(create2Inputs);
    const address = "0x" + hash.slice(-40);

    return ethers.getAddress(address);
  } catch {
    throw new Error("Invalid input parameters");
  }
}

export function hashInitCode(bytecode: string): string {
  let normalized = bytecode.trim();
  if (!normalized.startsWith("0x")) {
    normalized = "0x" + normalized;
  }
  return ethers.keccak256(normalized);
}

export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

/** Non-empty `0x` hex with even number of nibbles (at least one byte). */
export function isValidHex(s: string): boolean {
  if (!s.startsWith("0x")) return false;
  const body = s.slice(2);
  if (body.length === 0) return false;
  if (body.length % 2 !== 0) return false;
  return /^[0-9a-fA-F]+$/.test(body);
}

/** Prefix while typing — allows odd length after `0x`. */
export function isValidHexPrefixLoose(value: string): boolean {
  if (!value.startsWith("0x")) return false;
  return /^0x[0-9a-fA-F]*$/.test(value);
}
