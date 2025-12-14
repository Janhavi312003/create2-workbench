import { ethers } from 'ethers';

interface MinerMessage {
  deployerAddress: string;
  initCodeHash: string;
  prefix: string;
  startNonce: number;
  maxIterations: number;
}

self.addEventListener('message', (e: MessageEvent<MinerMessage>) => {
  const { deployerAddress, initCodeHash, prefix, startNonce, maxIterations } = e.data;
  
  let counter = startNonce;
  const endNonce = startNonce + maxIterations;
  let found = false;
  
  const targetPrefix = prefix.toLowerCase().replace('0x', '');
  
  while (!found && counter < endNonce) {
    // Generate salt from counter
    const salt = ethers.zeroPadValue(ethers.toBeHex(counter), 32);
    
    try {
      // Calculate CREATE2 address
      const create2Inputs = ethers.solidityPacked(
        ['bytes1', 'address', 'bytes32', 'bytes32'],
        ['0xff', deployerAddress, salt, initCodeHash]
      );
      
      const hash = ethers.keccak256(create2Inputs);
      const address = '0x' + hash.slice(-40);
      
      // Check if address matches prefix
      if (address.toLowerCase().startsWith('0x' + targetPrefix)) {
        self.postMessage({
          type: 'found',
          salt: salt,
          address: ethers.getAddress(address),
          iterations: counter - startNonce
        });
        found = true;
        break;
      }
      
      // Send progress update every 5000 iterations
      if (counter % 5000 === 0) {
        self.postMessage({
          type: 'progress',
          current: counter - startNonce,
          total: maxIterations
        });
      }
      
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: 'Error during calculation'
      });
      break;
    }
    
    counter++;
  }
  
  if (!found) {
    self.postMessage({
      type: 'complete',
      message: `Searched ${maxIterations} salts, no match found`,
      iterations: counter - startNonce
    });
  }
});
