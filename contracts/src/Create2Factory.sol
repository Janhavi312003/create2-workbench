// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Create2Factory is ReentrancyGuard {
    event Deployed(address indexed proxy, bytes32 indexed salt, address indexed implementation);

    function computeAddress(bytes32 salt, bytes memory bytecode) public view returns (address) {
        bytes32 initCodeHash = keccak256(bytecode);
        return computeAddress(salt, initCodeHash);
    }

    // FIXED: Correct CREATE2 formula (85 bytes total)
    function computeAddress(bytes32 salt, bytes32 initCodeHash) public view returns (address) {
        assembly {
            // ptr = 0x00: 0xff (1 byte)
            mstore(0x00, 0xff)
            // ptr = 0x01: address(this) (20 bytes)
            mstore(0x01, address())
            // ptr = 0x15: salt (32 bytes)  
            mstore(0x15, salt)
            // ptr = 0x35: initCodeHash (32 bytes)
            mstore(0x35, initCodeHash)
            
            // Hash 85 bytes: 0xff + 20 + 32 + 32 = 85 
            let hash := keccak256(0x00, 0x55)
            mstore(0x00, hash)
            return(0x00, 32)
        }
    }

    function deploy(bytes32 salt, bytes memory bytecode) 
        public payable nonReentrant returns (address deployedAddress) 
    {
        assembly {
            deployedAddress := create2(callvalue(), add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(deployedAddress)) { revert(0, 0) }
        }
        emit Deployed(deployedAddress, salt, deployedAddress);
    }

    receive() external payable {}
}
