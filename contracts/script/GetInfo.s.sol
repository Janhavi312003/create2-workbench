// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SimpleStorage.sol";

contract GetInfo is Script {
    function run() external view {
        // Get SimpleStorage bytecode
        bytes memory bytecode = type(SimpleStorage).creationCode;
        
        console.log("=== SimpleStorage Contract Info ===");
        console.log("");
        console.log("Bytecode:");
        console.logBytes(bytecode);
        console.log("");
        console.log("Bytecode Hash (Init Code Hash):");
        console.logBytes32(keccak256(bytecode));
        console.log("");
        console.log("Bytecode Length:", bytecode.length, "bytes");
        console.log("");
        console.log("Factory Address: 0xf39e31f414e707f129AdC1E970006E07b07eA3Cc");
    }
}
