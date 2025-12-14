// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Create2Factory.sol";

contract DeployScript is Script {
    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the factory
        Create2Factory factory = new Create2Factory();
        
        console.log("Create2Factory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
