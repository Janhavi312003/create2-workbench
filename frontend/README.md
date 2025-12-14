# CREATE2 Workbench

A deterministic contract deployment tool for Rootstock and EVM-compatible chains. This workbench implements the CREATE2 opcode (EIP-1014) to calculate contract addresses and find vanity salts.

## Features

- **Calculate Mode**: Compute the deterministic address given deployer, salt, and init code hash
- **Find Salt Mode**: Search for a salt that generates a vanity address with your desired prefix
- **Init Code Helper**: Hash your contract bytecode to get the init code hash
- **Web Worker**: Non-blocking salt mining using Web Workers
- **EIP-1014 Compliant**: Implements the official CREATE2 specification

## Tech Stack

- React 18 + TypeScript
- Vite
- ethers.js v6
- Web Workers API

## Installation

git clone https://github.com/yourusername/create2-workbench.git

cd create2-workbench

npm install


## Development

npm run dev

Open http://localhost:5173

## Build

npm run build


## Usage

### Calculate Address

1. Enter your deployer address (the contract/EOA that will call CREATE2)
2. Enter a salt (32-byte hex value)
3. Enter the init code hash (keccak256 of your contract bytecode)
4. The address is calculated instantly

### Find Vanity Salt

1. Enter deployer address and init code hash
2. Specify your desired prefix (e.g., `0x0000` for leading zeros)
3. Click "Start Search" - the app will iterate through salts until a match is found
4. Copy the found salt and address

## Formula (EIP-1014)

address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]

Step 3: Run and Test

npm run dev




