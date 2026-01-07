// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Create2Factory is ReentrancyGuard {
    event Deployed(address indexed proxy, bytes32 indexed salt, address indexed implementation);

    /// @notice Computes the counterfactual CREATE2 address
    function computeAddress(bytes32 salt, bytes memory bytecode) public view returns (address) {
        bytes32 initCodeHash = keccak256(bytecode);
        return computeAddress(salt, initCodeHash);
    }

    /// @notice Computes the counterfactual CREATE2 address  
    function computeAddress(bytes32 salt, bytes32 initCodeHash) public view returns (address) {
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0xff00000000000000000000000000000000000000000000000000000000000000)
            mstore(add(ptr, 4), salt)
            mstore(add(ptr, 36), initCodeHash)
            mstore(add(ptr, 68), address())
            mstore(ptr, keccak256(ptr, 100))
            return(ptr, 32)
        }
    }

    /// @notice Deploys a contract using CREATE2 
    function deploy(bytes32 salt, bytes memory bytecode) 
        public 
        payable 
        nonReentrant 
        returns (address deployedAddress) 
    {
        assembly {
            deployedAddress := create2(callvalue(), add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(deployedAddress)) { revert(0, 0) }
        }
        emit Deployed(deployedAddress, salt, deployedAddress);
    }

    receive() external payable {}
}
