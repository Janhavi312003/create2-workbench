// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Create2Factory.sol";
import "../src/SimpleStorage.sol";

contract TestCreate2 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        address factoryAddress = 0xf39e31f414e707f129AdC1E970006E07b07eA3Cc; 
        Create2Factory factory = Create2Factory(factoryAddress);

        vm.startBroadcast(deployerPrivateKey);

        // Get SimpleStorage bytecode
        bytes memory bytecode = type(SimpleStorage).creationCode;
        
        // Calculate bytecode hash
        bytes32 initCodeHash = keccak256(bytecode);
        console.log("Init Code Hash:");
        console.logBytes32(initCodeHash);

        // Define salt
        bytes32 salt = bytes32(uint256(2));
        console.log("Salt:");
        console.logBytes32(salt);

        // Predict address
        address predictedAddress = factory.computeAddress(salt, initCodeHash);
        console.log("Predicted Address:", predictedAddress);

        // Deploy using CREATE2
        address deployedAddress = factory.deploy(salt, bytecode);
        console.log("Deployed Address:", deployedAddress);

        // Verify they match
        require(predictedAddress == deployedAddress, "Address mismatch!");
        console.log("SUCCESS: Addresses match!");

        vm.stopBroadcast();
    }
}
