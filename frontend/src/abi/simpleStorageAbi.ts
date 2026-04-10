/** ABI for SimpleStorage — checked in so `npm run build` works without Foundry artifacts. */
export const simpleStorageAbi = [
  {
    type: "function",
    name: "store",
    stateMutability: "nonpayable",
    inputs: [{ name: "_value", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "retrieve",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "ValueChanged",
    inputs: [{ name: "newValue", type: "uint256", indexed: false }],
  },
] as const;
