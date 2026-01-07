// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/Create2Factory.sol";
import "../src/SimpleStorage.sol";

contract TestCreate2 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address payable factoryAddress = payable(vm.envAddress("FACTORY_ADDRESS")); 
        bytes32 salt = vm.envBytes32("SALT");

        console.log("Using Factory:", factoryAddress);
        console.log("Using Salt:", uint256(salt));
        
        Create2Factory factory = Create2Factory(payable(factoryAddress)); 
        
        vm.startBroadcast(deployerPrivateKey);

        bytes memory bytecode = type(SimpleStorage).creationCode;
        bytes32 initCodeHash = keccak256(bytecode);
        console.log("Init Code Hash:");
        console.logBytes32(initCodeHash);

        console.log("Salt:");
        console.logBytes32(salt);

        address predictedAddress = factory.computeAddress(salt, initCodeHash);
        console.log("Predicted Address:", predictedAddress);

        address deployedAddress = factory.deploy(salt, bytecode);
        console.log("Deployed Address:", deployedAddress);

        require(predictedAddress == deployedAddress, "Address mismatch!");
        console.log("SUCCESS: Addresses match!");

        vm.stopBroadcast();
    }
}
