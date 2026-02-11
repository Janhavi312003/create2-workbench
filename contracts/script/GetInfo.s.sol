// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

contract GetInfo is Script {
    function run() external view {
        // Get SimpleStorage bytecode
        bytes memory bytecode = type(SimpleStorage).creationCode;
        
        console.log("=== SimpleStorage Contract Info ===");
        address payable factoryAddress = payable(vm.envAddress("FACTORY_ADDRESS"));
        console.log("Factory Address:", factoryAddress);
        console.log("Bytecode Length:", bytecode.length, "bytes");
        console.log("Init Code Hash:");
        console.logBytes32(keccak256(bytecode));  
        console.log("");
        // Create2Factory factory = Create2Factory(payable(factoryAddress));
    }
}
