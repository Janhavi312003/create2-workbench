import { ethers } from 'ethers';

export function calculateCreate2Address(
  deployerAddress: string,
  salt: string,
  initCodeHash: string
): string {
  try {
    // Ensure salt is 32 bytes
    const saltBytes32 = ethers.zeroPadValue(salt, 32);
    
    // Pack: 0xff ++ address ++ salt ++ initCodeHash
    const create2Inputs = ethers.solidityPacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', deployerAddress, saltBytes32, initCodeHash]
    );
    
    // Hash and take last 20 bytes
    const hash = ethers.keccak256(create2Inputs);
    const address = '0x' + hash.slice(-40);
    
    return ethers.getAddress(address);
  } catch (error) {
    throw new Error('Invalid input parameters');
  }
}

export function hashInitCode(bytecode: string): string {
  if (!bytecode.startsWith('0x')) {
    bytecode = '0x' + bytecode;
  }
  return ethers.keccak256(bytecode);
}

export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

export function isValidHex(hex: string): boolean {
  return /^0x[0-9A-Fa-f]*$/.test(hex);
}
