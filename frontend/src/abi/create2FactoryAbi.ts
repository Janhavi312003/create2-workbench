/** ABI for Create2Factory — checked in so `npm run build` works without Foundry artifacts. */
export const create2FactoryAbi = [
  {
    type: "function",
    name: "computeAddress",
    stateMutability: "view",
    inputs: [
      { name: "salt", type: "bytes32" },
      { name: "bytecode", type: "bytes" },
    ],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "computeAddress",
    stateMutability: "view",
    inputs: [
      { name: "salt", type: "bytes32" },
      { name: "initCodeHash", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "deploy",
    stateMutability: "payable",
    inputs: [
      { name: "salt", type: "bytes32" },
      { name: "bytecode", type: "bytes" },
    ],
    outputs: [{ name: "deployedAddress", type: "address" }],
  },
  {
    type: "event",
    name: "Deployed",
    inputs: [
      { name: "deployed", type: "address", indexed: true },
      { name: "salt", type: "bytes32", indexed: true },
    ],
  },
  {
    type: "error",
    name: "Create2DeployFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "ReentrantCall",
    inputs: [],
  },
] as const;
