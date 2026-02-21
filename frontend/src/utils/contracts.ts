import factoryArtifact from '../../../contracts/out/Create2Factory.sol/Create2Factory.json';
import simpleStorageArtifact from '../../../contracts/out/SimpleStorage.sol/SimpleStorage.json';

export const factoryConfig = {
  address: import.meta.env.VITE_FACTORY_ADDRESS as `0x${string}`,
  abi: factoryArtifact.abi,
};

export const simpleStorageABI = simpleStorageArtifact.abi;