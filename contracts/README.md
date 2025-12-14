
# CREATE2 Workbench - Smart Contracts

Solidity smart contracts for deterministic deployment on Rootstock blockchain. This package includes a CREATE2 factory contract implementing EIP-1014 and helper scripts for deployment and testing.

---

## ✨ Features

🏭 **CREATE2 Factory**: EIP-1014 compliant factory for deterministic deployments  
🔮 **Address Prediction**: Compute addresses before deployment  
🧪 **Test Contracts**: Sample contracts for testing (SimpleStorage)  
🛠️ **Deployment Scripts**: Foundry scripts for easy deployment  
✅ **Verification**: Scripts to verify predictions match deployments  
⚡ **Gas Optimized**: Minimal gas consumption for deployments  
🔒 **Secure**: Audited CREATE2 implementation  

---

## 🛠️ Tech Stack

```

| Technology | Purpose |
|------------|---------|
| **Solidity 0.8.20** | Smart contract language |
| **Foundry** | Development framework |
| **Forge** | Build, test, and deploy |
| **OpenZeppelin** | Security-audited libraries |
| **Rootstock RPC** | Blockchain connectivity |
```
---

## 📋 Prerequisites

- **Foundry** installed ([Installation Guide](https://book.getfoundry.sh/getting-started/installation))
- **Node.js 18+** (optional, for scripts)
- **Rootstock RPC** access
- **Private Key** with tRBTC for testnet deployment
- **Git** for version control

---

## 🚀 Installation

### 1. Navigate to Contracts Directory

```
cd contracts
```

### 2. Install Foundry Dependencies

```
forge install
```

This installs:
- `forge-std`: Foundry testing library
- `openzeppelin-contracts`: Security libraries (if used)

### 3. Create Environment File

```
cp .env.example .env
```

### 4. Configure Environment Variables

Edit `.env`:

Rootstock RPC Configuration

```
ROOTSTOCK_TESTNET_RPC=https://public-node.testnet.rsk.co
ROOTSTOCK_MAINNET_RPC=https://public-node.rsk.co

Private Key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

Block Explorer (for verification)
ROOTSTOCK_EXPLORER_API=https://blockscout.com/rsk/testnet/api
```

⚠️ **Security Note**: 
- Never commit `.env` to Git
- Use a test wallet with minimal funds
- Keep your private key secure

---

## 🏗️ Building

### Compile Contracts

```
forge build
```

Output:
```
[⠢] Compiling...
[⠆] Compiling 3 files with Solc 0.8.20
[⠰] Solc 0.8.20 finished in 1.23s
Compiler run successful!
```

### Clean Build Artifacts

```
forge clean
```

---

## 🧪 Testing

### Run All Tests
```
forge test
```

### Run Tests with Verbosity

```
forge test -vvvv
```

### Run Specific Test

```
forge test --match-test testComputeAddress -vvv
```

### Test Coverage

```
forge coverage
```

---

## 🚀 Deployment

### Deploy to Rootstock Testnet

**Step 1: Fund Your Wallet**

Get tRBTC from [Rootstock Faucet](https://faucet.rootstock.io/)

**Step 2: Deploy Factory Contract**
```
forge script script/Deploy.s.sol
--rpc-url rootstock_testnet
--broadcast
--legacy
-vvvv
```

**Step 3: Save Deployment Address**

Copy the deployed factory address from the output:
```
== Return ==
Deployed Factory: 0xf39e31f414e707f129AdC1E970006E07b07eA3Cc
```

**Step 4: Verify Deployment**

Check on Rootstock Explorer:
```
https://explorer.testnet.rsk.co/address/0xf39e31f414e707f129AdC1E970006E07b07eA3Cc
```

---

### Deploy to Rootstock Mainnet

⚠️ **Use with caution on mainnet!**

```
forge script script/Deploy.s.sol
--rpc-url rootstock_mainnet
--broadcast
--legacy
--verify
-vvvv
```

---

## 📜 Smart Contracts

### Create2Factory.sol

**Purpose:** Factory contract for deterministic CREATE2 deployments

**Key Functions:**

#### `deploy(bytes32 salt, bytes memory bytecode)`

Deploys a contract using CREATE2.

function deploy(bytes32 salt, bytes memory bytecode)
public
returns (address addr)


**Parameters:**
- `salt`: 32-byte value for address generation
- `bytecode`: Contract creation bytecode

**Returns:**
- `addr`: Deployed contract address

**Example:**
```
bytes32 salt = bytes32(uint256(1));
bytes memory bytecode = type(SimpleStorage).creationCode;
address deployed = factory.deploy(salt, bytecode);
```

---

#### `computeAddress(bytes32 salt, bytes32 initCodeHash)`

Predicts the deployment address.
```
function computeAddress(bytes32 salt, bytes32 initCodeHash)
public
view
returns (address)
```

**Parameters:**
- `salt`: 32-byte value
- `initCodeHash`: keccak256 hash of bytecode

**Returns:**
- Predicted contract address

**Example:**
```
bytes32 initCodeHash = keccak256(bytecode);
address predicted = factory.computeAddress(salt, initCodeHash);
```

---

#### `getBytecodeHash(bytes memory bytecode)`

Helper function to compute bytecode hash.

```
function getBytecodeHash(bytes memory bytecode)
public
pure
returns (bytes32)
```

---

### SimpleStorage.sol

**Purpose:** Simple test contract for CREATE2 deployments

**Functions:**

```
function store(uint256 value) public
function retrieve() public view returns (uint256)
```

**Usage:**
Test contract to verify CREATE2 predictions work correctly.

---

## 📁 Project Structure

```
contracts/
├── src/
│ ├── Create2Factory.sol # Main factory contract
│ └── SimpleStorage.sol # Test contract
│
├── script/
│ ├── Deploy.s.sol # Deployment script
│ ├── GetInfo.s.sol # Get bytecode info
│ └── TestCreate2.s.sol # Test deployment
│
├── test/
│ └── Create2Factory.t.sol # Unit tests
│
├── lib/ # Foundry dependencies
├── out/ # Compiled artifacts
├── broadcast/ # Deployment records
│
├── foundry.toml # Foundry configuration
├── .env 
├── .env.example 
└── README.md 
```

---

## 🔧 Foundry Scripts

### Deploy.s.sol

Deploys the CREATE2 factory to Rootstock.

**Usage:**
```
forge script script/Deploy.s.sol --rpc-url rootstock_testnet --broadcast --legacy
```

**Output:**
- Factory contract address
- Deployment transaction hash
- Gas used

---

### GetInfo.s.sol

Gets bytecode and hash information for contracts.

**Usage:**
```
forge script script/GetInfo.s.sol
```


**Output:**
```
=== SimpleStorage Info ===
Bytecode:
0xyour_bytcode_here...

Bytecode Hash:
0xyour_bytcode_hash_here...

Bytecode Length: 366 bytes
```

---

### TestCreate2.s.sol

Tests CREATE2 deployment and verifies prediction.

**Usage:**
```
forge script script/TestCreate2.s.sol
--rpc-url rootstock_testnet
--broadcast
--legacy
-vvvv
```

**Output:**
```
== Logs ==
Init Code Hash: 0x1a2b...
Salt: 0x0000...0002
Predicted Address: 0xABC123...
Deployed Address: 0xABC123...
SUCCESS: Addresses match! ✅
```

---

## ⚙️ Configuration

### Environment Variables
```

| Variable | Description | Required |
|----------|-------------|----------|
| `ROOTSTOCK_TESTNET_RPC` | Testnet RPC URL | ✅ Yes |
| `ROOTSTOCK_MAINNET_RPC` | Mainnet RPC URL | No |
| `PRIVATE_KEY` | Deployment wallet private key | ✅ Yes |
| `ROOTSTOCK_EXPLORER_API` | Block explorer API | No |

```

### Foundry Configuration (foundry.toml)

```
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.20"
optimizer = true
optimizer_runs = 200
via_ir = false

[rpc_endpoints]
rootstock_testnet = "${ROOTSTOCK_TESTNET_RPC}"
rootstock_mainnet = "${ROOTSTOCK_MAINNET_RPC}"

[etherscan]
rootstock_testnet = { key = "${ROOTSTOCK_EXPLORER_API}" }
```

---

## 🧮 How CREATE2 Works

### The Formula

```
address = keccak256(
abi.encodePacked(
bytes1(0xff),
address(this),
salt,
keccak256(bytecode)
)
)
```

### Implementation in Create2Factory.sol

```
function computeAddress(bytes32 salt, bytes32 initCodeHash)
public
view
returns (address)
{
return address(uint160(uint256(keccak256(abi.encodePacked(
bytes1(0xff),
address(this),
salt,
initCodeHash
)))));
}
```

### Deployment Process

1. **Calculate Init Code Hash**: `keccak256(bytecode)`
2. **Predict Address**: Use `computeAddress(salt, initCodeHash)`
3. **Deploy**: Call `deploy(salt, bytecode)`
4. **Verify**: Check that predicted == deployed address

---

## 📊 Gas Costs

```

| Operation | Gas Cost | tRBTC (approx) |
|-----------|----------|----------------|
| Deploy Factory | ~350,000 | 0.000021 |
| Deploy SimpleStorage | ~100,000 | 0.000006 |
| computeAddress | ~2,000 | 0.00000012 |
| getBytecodeHash | ~1,500 | 0.00000009 |

*Gas prices vary based on network congestion*

```

---

## 🔍 Verification & Testing

### Verify Factory Deployment

Check contract code exists
```
cast code 0xf39e31f414e707f129AdC1E970006E07b07eA3Cc
--rpc-url $ROOTSTOCK_TESTNET_RPC
```

Check contract is factory
```
cast call 0xf39e31f414e707f129AdC1E970006E07b07eA3Cc
"getBytecodeHash(bytes)"
"0x6080..."
--rpc-url $ROOTSTOCK_TESTNET_RPC
```

### Verify Prediction Matches Deployment

Run the test script:

```
forge script script/TestCreate2.s.sol
--rpc-url rootstock_testnet
--broadcast
--legacy
-vvvv
```

Look for:
```
SUCCESS: Addresses match! ✅
```

---

## 🐛 Troubleshooting

### Compilation Errors

**Problem:** `Error: Compiler version not found`

**Solution:**
Install specific Solidity version
```
foundryup
```

Or specify version in foundry.toml
solc = "0.8.20"


---

### Deployment Errors

**Problem:** `Error: insufficient funds`

**Solution:**
- Get tRBTC from [faucet](https://faucet.rootstock.io/)
- Check balance: `cast balance YOUR_ADDRESS --rpc-url $ROOTSTOCK_TESTNET_RPC`

**Problem:** `Error: nonce too low`

**Solution:**
Reset nonce
cast nonce YOUR_ADDRESS --rpc-url $ROOTSTOCK_TESTNET_RPC

text

**Problem:** `CREATE2: Failed to deploy contract`

**Solution:**
- Contract already exists at that address
- Change the salt to deploy to a different address
- Each salt can only be used once

---

### RPC Connection Issues

**Problem:** `Error: failed to get gas price`

**Solution:**
Test RPC connection
cast chain-id --rpc-url $ROOTSTOCK_TESTNET_RPC

Try alternative RPC

```
ROOTSTOCK_TESTNET_RPC=https://testnet.sovryn.app/rpc
```
---

### Legacy Transaction Flag

**Problem:** `Error: EIP-1559 not supported`

**Solution:**
Always use `--legacy` flag for Rootstock:

```
forge script script/Deploy.s.sol --legacy
```

---

## 📚 Useful Commands

### Foundry Cast Commands

Get block number
```
cast block-number --rpc-url $ROOTSTOCK_TESTNET_RPC
```

Get gas price
```
cast gas-price --rpc-url $ROOTSTOCK_TESTNET_RPC
```

Get balance
```
cast balance YOUR_ADDRESS --rpc-url $ROOTSTOCK_TESTNET_RPC
```

Call contract function
```
cast call FACTORY_ADDRESS "computeAddress(bytes32,bytes32)" 0x... 0x...
--rpc-url $ROOTSTOCK_TESTNET_RPC
```

Send transaction

```
cast send FACTORY_ADDRESS "deploy(bytes32,bytes)" 0x... 0x...
--rpc-url $ROOTSTOCK_TESTNET_RPC
--private-key $PRIVATE_KEY
--legacy
```

---

## 🧪 Running Tests

### Unit Tests

Run all tests

```
forge test
```

Run specific test file

```
forge test --match-path test/Create2Factory.t.sol
```

Run specific test function

```
forge test --match-test testDeploy -vvv
```

Show gas report

```
forge test --gas-report
```

### Test Output Example

Running 3 tests for test/Create2Factory.t.sol:Create2FactoryTest
[PASS] testComputeAddress() (gas: 12345)
[PASS] testDeploy() (gas: 98765)
[PASS] testGetBytecodeHash() (gas: 5432)
Test result: ok. 3 passed; 0 failed; finished in 1.23s

text

---

## 📖 Additional Resources

### Documentation
- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [EIP-1014 Specification](https://eips.ethereum.org/EIPS/eip-1014)
- [Rootstock Dev Portal](https://dev.rootstock.io/)

### Rootstock Resources
- [Rootstock RPC Endpoints](https://dev.rootstock.io/developers/requirements/)
- [Rootstock Faucet](https://faucet.rootstock.io/)
- [Rootstock Explorer (Testnet)](https://explorer.testnet.rsk.co/)
- [Rootstock Explorer (Mainnet)](https://explorer.rsk.co/)

### Tools
- [Remix IDE](https://remix.ethereum.org/)
- [Hardhat](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. **Tests pass**: Run `forge test` before committing
2. **Code compiles**: Run `forge build` successfully
3. **Follow style**: Use existing Solidity style
4. **Document changes**: Update README if needed
5. **Security**: No vulnerabilities introduced

---

## 🔒 Security Considerations

⚠️ **Important Security Notes:**

1. **Private Keys**: 
   - Never commit private keys to Git
   - Use `.gitignore` for `.env` files
   - Use test wallets for development

2. **Contract Deployment**:
   - Test thoroughly on testnet first
   - Audit CREATE2 factory before mainnet
   - Use minimal funds for testing

3. **Salt Management**:
   - Each salt can only be used once per deployer
   - Changing salt changes deployment address
   - Store used salts to avoid conflicts

4. **Bytecode**:
   - Verify bytecode hash matches expected contract
   - Be cautious with constructor arguments
   - Test deployment before production use

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details

---

## 🙏 Acknowledgments

- Built for the Rootstock blockchain
- Powered by Foundry development framework
- EIP-1014 CREATE2 implementation
- Inspired by Ethereum smart contract patterns
- Thanks to the Solidity and Foundry communities

---

<div align="center">

**Part of [CREATE2 Workbench](https://github.com/Janhavi312003/create2-workbench)**

[⬅️ Back to Main README](../README.md) • [🐛 Report Bug](https://github.com/Janhavi312003/create2-workbench/issues) • [✨ Request Feature](https://github.com/Janhavi312003/create2-workbench/issues)

</div>
